const EmailVerificationTemplate = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            text-align: center;
        }
        
        .confirm-button {
            background-color: #ffd94f;
            border: none;
            color: #00796b;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #800080;">Hello {Username}!</h1>
        
        <p>Thank you for joining <strong>Fork & Feast</strong>!</p>
        
        <p>To start reserving your favorite dining spots and exploring exclusive offers, please confirm your email address.</p>
        
        <a href="{url}" class="confirm-button">Confirm Email</a>
        
        <p>We look forward to helping you discover your next great meal!</p>
        
        <p>If you didn't sign up, please ignore this email—no further action is needed.</p>
        
        <p style="color: #aaa; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

const ResetPasswordTemplate = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            text-align: center;
        }
        
        .reset-button {
            background-color: #ffd94f;
            border: none;
            color: #00796b;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #800080;">Hello {Username}!</h1>
        
        <p>We received a request to reset your password for your <strong>Fork & Feast</strong> account!</p>
        
        <p>To reset your password, please click the button below:</p>
        
        <a href="{url}" class="reset-button">Reset Password</a>
        
        <p>This link will expire in 15 minutes for your security.</p>
        
        <p>If you didn't request this, please ignore this email. Your password won't be changed.</p>
        
        <p style="color: #aaa; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

module.exports = { EmailVerificationTemplate, ResetPasswordTemplate };