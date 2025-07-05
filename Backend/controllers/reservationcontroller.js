const Reservation = require('../model/reservationmodel');
const Restuarant = require('../model/restaurantmodel');
const nodemailer = require('nodemailer');
const User = require('../model/usermodel.js');
const { 
  BookingConfirmTemplate, 
  BookingUpdateTemplate, 
  BookingCancellationTemplate 
} = require('../templates/templates.js');
const mongoose = require('mongoose');
const { notifyRestaurantOwner } = require('../socket/websocket.js');
const WebSocket = require('ws');
const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

//function to check whether booking time is between opening and closing time of restaurant
const isWithinBusinessHours = (requestedTime, openingTime, closingTime) => {
    const requestedMinutes = convertTimeToMinutes(requestedTime);
    const openingMinutes = convertTimeToMinutes(openingTime);
    const closingMinutes = convertTimeToMinutes(closingTime);
    return requestedMinutes >= openingMinutes && requestedMinutes <= closingMinutes;
};

//function to check whether booking is done atleast 15 mins in advance
const isValidBookingTime = (bookingDate, bookingTime) => {
    const now = new Date();
    const bookingDateTime = new Date(bookingDate);
    const [hours, minutes] = bookingTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const diffInMinutes = (bookingDateTime - now) / (1000 * 60);
    return diffInMinutes >= 60;
};

const checkAvailability = async (restaurantId, date, time, currentReservationId = null) => {
    try {
        // Get restaurant details
        const restaurant = await Restuarant.findById(restaurantId);

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Helper function to get slot time
        const getSlotTime = (baseTime, hourOffset) => {
            const [hours, minutes] = baseTime.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + (hourOffset * 60);
            return convertMinutesToTime(totalMinutes);
        };

        // Get times for before and after slots
        const beforeTime = getSlotTime(time, -1);
        const afterTime = getSlotTime(time, 1);

        // Check if all times are within business hours
        const times = [beforeTime, time, afterTime];
        times.forEach(slotTime => {
            if (!isWithinBusinessHours(slotTime, restaurant.openingTime, restaurant.closingTime)) {
                if (slotTime === time) {
                    throw new Error('Selected time is outside business hours');
                }
            }
        });

        // Check if booking time is at least 15 mins in the future
        if (!isValidBookingTime(date, time)) {
            throw new Error('Reservations must be made at least 60 minutes in advance');
        }

        // Get all reservations for the requested date
        const requestedDate = new Date(date);
        const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

        const reservations = await Reservation.find({
            restaurantId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'confirmed',
            ...(currentReservationId && { _id: { $ne: currentReservationId } })
        });

        // Function to calculate available tables for a specific time
        const calculateAvailability = (checkTime) => {
            const checkMinutes = convertTimeToMinutes(checkTime);
            const occupiedTables = {
                twoPerson: 0,
                fourPerson: 0,
                sixPerson: 0
            };

            reservations.forEach(reservation => {
                const reservationMinutes = convertTimeToMinutes(reservation.time);
                if (Math.abs(reservationMinutes - checkMinutes) < 60) {
                    occupiedTables.twoPerson += reservation.tables.twoPerson;
                    occupiedTables.fourPerson += reservation.tables.fourPerson;
                    occupiedTables.sixPerson += reservation.tables.sixPerson;
                }
            });

            return {
                2: Math.max(0, restaurant.capacity.twoPerson - occupiedTables.twoPerson),
                4: Math.max(0, restaurant.capacity.fourPerson - occupiedTables.fourPerson),
                6: Math.max(0, restaurant.capacity.sixPerson - occupiedTables.sixPerson)
            };
        };

        // Calculate availability for all three time slots
        const availability = {
            beforeSlot: {
                time: beforeTime,
                tables: isWithinBusinessHours(beforeTime, restaurant.openingTime, restaurant.closingTime) && isValidBookingTime(requestedDate, beforeTime)
                    ? calculateAvailability(beforeTime)
                    : { 2: 0, 4: 0, 6: 0 }
            },
            currentSlot: {
                time: time,
                tables: calculateAvailability(time)
            },
            afterSlot: {
                time: afterTime,
                tables: isWithinBusinessHours(afterTime, restaurant.openingTime, restaurant.closingTime) && isValidBookingTime(requestedDate, beforeTime)
                    ? calculateAvailability(afterTime)
                    : { 2: 0, 4: 0, 6: 0 }
            }
        };

        return availability;
    } catch (error) {
        throw error;
    }
};


const sendBookingEmail = async (email, name, date, time, tables, code, template) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.email,
        pass: process.env.password
      }
    });

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: getEmailSubject(template),
      html: template
        .replace(/{Restaurant Name}/g, name)
        .replace("{Date}", date)
        .replace("{Time}", time)
        .replace("{Count1}", tables?.twoPerson || 0)
        .replace("{Count2}", tables?.fourPerson || 0)
        .replace("{Count3}", tables?.sixPerson || 0)
        .replace("{Booking Code}", code)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.log('Email sending error:', error);
  }
};

const getEmailSubject = (template) => {
  switch(template) {
    case BookingConfirmTemplate:
      return 'Booking Confirmation';
    case BookingUpdateTemplate:
      return 'Booking Update Confirmation';
    case BookingCancellationTemplate:
      return 'Booking Cancellation Confirmation';
    default:
      return 'Booking Information';
  }
};

// Function to create reservation
const createReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, tables } = req.body;
        const userId = req.user._id;

        // Check if booking time is at least 60 mins in the future
        if (!isValidBookingTime(date, time)) {
            return res.status(400).json({ message: "Reservations must be made at least 60 minutes in advance" });
        }

        const availabilityCheck = await checkAvailability(restaurantId, date, time);

        // Verify if requested tables are available
        if (tables.twoPerson > availabilityCheck.currentSlot.tables[2] ||
            tables.fourPerson > availabilityCheck.currentSlot.tables[4] ||
            tables.sixPerson > availabilityCheck.currentSlot.tables[6]) {
            return res.status(400).json({ message: "Requested tables are not available" });
        }

        // Generate unique entry code
        const generateEntryCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return code;
        };

        let entryCode;
        let isCodeUnique = false;
        while (!isCodeUnique) {
            entryCode = generateEntryCode();
            const existingReservation = await Reservation.findOne({ entryCode });
            if (!existingReservation) {
                isCodeUnique = true;
            }
        }

        // Create new reservation
        const reservation = new Reservation({
            restaurantId,
            userId,
            date,
            time,
            tables: {
                twoPerson: tables.twoPerson || 0,
                fourPerson: tables.fourPerson || 0,
                sixPerson: tables.sixPerson || 0
            },
            entryCode,
            status: 'confirmed'
        });

        await reservation.save();
        notifyRestaurantOwner(restaurantId, 'reservationCreated');
        const restaurantData = await Restuarant.findOne({ _id: reservation.restaurantId });
        const userData = await User.findOne({ _id: userId });
        await sendBookingEmail(userData.email, restaurantData.name, date, time, tables, entryCode, BookingConfirmTemplate);

        res.status(200).json({
            message: "Reservation created successfully",
            reservation,
            entryCode
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
const checkAvailaity_Controller = async (req, res) => {
    try {
        const { restaurantId, date, time, currentReservationId } = req.body;
        const availability = await checkAvailability(restaurantId, date, time, currentReservationId);
        res.json(availability);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const updateReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { date, time, tables } = req.body;
        const userId = req.user._id;

        // Find existing reservation
        const existingReservation = await Reservation.findOne({ _id: reservationId, userId });
        if (!existingReservation) {
            return res.status(404).json({ message: "Reservation not found or unauthorized" });
        }

        // If updating time, check if new time is at least 60 mins in the future
        if (time || date) {
            const checkDate = date || existingReservation.date;
            const checkTime = time || existingReservation.time;

            if (!isValidBookingTime(checkDate, checkTime)) {
                return res.status(400).json({ message: "Updated reservation time must be at least 60 minutes in advance" });
            }
        }

        // If date or time or tables are being updated, check availability
        if (date || time || tables) {
            const restaurant = await Restuarant.findById(existingReservation.restaurantId);

            // Check if new time is within business hours
            const checkTime = time || existingReservation.time;
            if (!isWithinBusinessHours(checkTime, restaurant.openingTime, restaurant.closingTime)) {
                return res.status(400).json({ message: "Updated time is outside business hours" });
            }

            // Check availability excluding current reservation
            const checkDate = date || existingReservation.date;
            const startOfDay = new Date(checkDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(checkDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Get all other reservations for the same day
            const overlappingReservations = await Reservation.find({
                restaurantId: existingReservation.restaurantId,
                _id: { $ne: reservationId },
                date: { $gte: startOfDay, $lte: endOfDay },
                status: 'confirmed'
            });

            const requestedMinutes = convertTimeToMinutes(checkTime);
            const occupiedTables = {
                twoPerson: 0,
                fourPerson: 0,
                sixPerson: 0
            };

            overlappingReservations.forEach(reservation => {
                const reservationMinutes = convertTimeToMinutes(reservation.time);
                if (Math.abs(reservationMinutes - requestedMinutes) < 60) {
                    occupiedTables.twoPerson += reservation.tables.twoPerson;
                    occupiedTables.fourPerson += reservation.tables.fourPerson;
                    occupiedTables.sixPerson += reservation.tables.sixPerson;
                }
            });

            // Check if requested tables are available
            const requestedTables = tables || existingReservation.tables;
            if (
                requestedTables.twoPerson > (restaurant.capacity.twoPerson - occupiedTables.twoPerson) ||
                requestedTables.fourPerson > (restaurant.capacity.fourPerson - occupiedTables.fourPerson) ||
                requestedTables.sixPerson > (restaurant.capacity.sixPerson - occupiedTables.sixPerson)
            ) {
                return res.status(400).json({ message: "Requested tables are not available for the updated time" });
            }
        }

        // Format the date for email
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {
                ...(date && { date }),
                ...(time && { time }),
                ...(tables && { tables })
            },
            { new: true }
        ).populate('restaurantId', 'name');

        // Send email notification
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.email,
                    pass: process.env.password
                }
            });

            const mailOptions = {
                from: process.env.email,
                to: req.user.email,
                subject: 'Reservation Update Confirmation',
                html: BookingConfirmTemplate
                    .replace(/{Restaurant Name}/g, updatedReservation.restaurantId.name)
                    .replace("{Date}", new Date(updatedReservation.date).toLocaleDateString())
                    .replace("{Time}", updatedReservation.time)
                    .replace("{Count1}", updatedReservation.tables.twoPerson)
                    .replace("{Count2}", updatedReservation.tables.fourPerson)
                    .replace("{Count3}", updatedReservation.tables.sixPerson)
                    .replace("{Booking Code}", updatedReservation.entryCode)
            };

            await transporter.sendMail(mailOptions);
            console.log(`Update confirmation email sent to ${req.user.email}`);
        } catch (emailError) {
            console.error('Error sending update confirmation email:', emailError);
            // Continue with the response even if email fails
        }

        // Send WebSocket notification
        // try {
        //     const ws = new WebSocket(process.env.WS_URL);
        //     ws.on('open', () => {
        //         ws.send(JSON.stringify({
        //             type: 'reservationUpdated',
        //             restaurantId: existingReservation.restaurantId
        //         }));
        //         ws.close();
        //     });
        // } catch (wsError) {
        //     console.error('WebSocket notification error:', wsError);
        //     // Continue with the response even if WebSocket fails
        // }
        const userData = await User.findOne({ _id: userId });
        await sendBookingEmail(
            userData.email, 
            updatedReservation.restaurantId.name, 
            formatDate(updatedReservation.date), // Format the date
            updatedReservation.time, // Time is already in correct format
            updatedReservation.tables, 
            updatedReservation.entryCode, 
            BookingUpdateTemplate
        );
        res.status(200).json({ 
            message: "Reservation updated successfully",
            reservation: updatedReservation 
        });
    } catch (error) {
        console.error('Update reservation error:', error);
        res.status(400).json({ message: error.message });
    }
};

const deleteReservation = async (req, res) => {
    try {

        const reservationId = req.params.reservationId;
        const userId = req.user._id;
        const reservation = await Reservation.findOne({ _id: reservationId });

        if (!reservation) {
            return res.status(400).json({ message: "No Reservation Found" });
        }

        if (reservation.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Unauthorized access to reservation" })
        }

        // Check if reservation is in the future
        const reservationDateTime = new Date(reservation.date);
        reservationDateTime.setHours(
            ...reservation.time.split(':').map(Number)
        );

        if (reservationDateTime < new Date()) {
            return res.status(401).json({ message: "Cannot delete past reservations" });
        }

        // Soft delete by updating status to cancelled
        const cancelledReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { status: 'cancelled' },
            { new: true }
        ).populate('restaurantId', 'name');

        // Send WebSocket notification
        notifyRestaurantOwner(reservation.restaurantId, 'reservationCancelled');

        const findUser = await User.findOne({ _id: req.user._id });
        // Send cancellation email
        await sendBookingEmail(
            findUser.email,
            cancelledReservation.restaurantId.name,
            cancelledReservation.date,
            cancelledReservation.time,
            cancelledReservation.tables,
            cancelledReservation.entryCode,
            BookingCancellationTemplate
        );

        res.status(200).json({ cancelledReservation });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const getRestaurantReservations = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const currentDate = new Date();

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        // Get all reservations for the restaurant
        const reservations = await Reservation.find({
            restaurantId: restaurantId,
            date: { $gte: currentDate }, // Only get current and future reservations
        })
            .populate('userId', 'name email') // Get user details
            .sort({ date: 1, time: 1 }) // Sort by date and time ascending
            .lean();

        res.status(200).json({
            data: reservations
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching reservations" })
    }
}

const markReservationsAsViewed = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Update all unviewed reservations for this restaurant
        await Reservation.updateMany(
            {
                restaurantId: restaurantId,
                viewed: false
            },
            {
                $set: { viewed: true }
            }
        );

        res.status(200).json({
            message: 'Reservations marked as viewed'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating reservation status'
        });
    }
}

const getUserReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId })
      .populate('restaurantId', 'name location');
    console.log(reservations);
    res.json({ reservations });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    console.log(reservation);
    res.json(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkAvailaity_Controller, createReservation, updateReservation, deleteReservation,getRestaurantReservations, markReservationsAsViewed, getUserReservations, getReservation }
