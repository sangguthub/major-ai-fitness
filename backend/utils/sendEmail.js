const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
    // 1. Set the API Key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // 2. Construct the message object for SendGrid
    const msg = {
        to: options.email, // Recipient's email address
        from: process.env.SENDER_EMAIL, // Must be a verified sender in SendGrid
        subject: options.subject,
        html: options.message, // Use HTML for the body
    };

    try {
        await sgMail.send(msg);
        console.log(`Email successfully sent to ${options.email} via SendGrid.`);
    } catch (error) {
        console.error('SendGrid Email Error:', error);
        
        // Log detailed error from SendGrid response body if available
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error('Failed to send email via SendGrid.');
    }
};

module.exports = sendEmail;