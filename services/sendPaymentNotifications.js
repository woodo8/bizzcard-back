import sgMail from "@sendgrid/mail";

// Service to send an email to the user when they are charged
export const sendChargeNotification = async (user, chargeDetails) => {
    try {
        const { email: to, name: toName } = user;
        const { amount } = chargeDetails;
        
        const msg = {
            to, // recipient email
            from: process.env.EMAIL, // your email from environment variable
            subject: `Payment Notification: You've been charged ${amount / 100} UZS`,
            html: `
                <p>Hello ${toName},</p>
                <h3>Your payment of <b>${amount / 100} UZS</b> has been successfully processed.</h3>
                <p>If you have any questions regarding this transaction, please contact our support.</p>
                <br />
                <p>Thank you for your business!</p>
            `,
        };
        sgMail.setApiKey(process.env.SG_API_KEY);

        await sgMail.send(msg); // Send the email
    } catch (error) {
        console.error('Failed to send charge notification:', error);
        throw new Error('Email notification could not be sent.');
    }
};

export const sendChargeFailureNotification = async (user, chargeDetails, errorMessage) => {
    try {
        const { email: to, name: toName } = user;
        const { amount } = chargeDetails;

        const msg = {
            to, // recipient email
            from: process.env.EMAIL, // your email from environment variable
            subject: `Payment Failure: Issue with processing your ${amount / 100} UZS payment`,
            html: `
                <p>Hello ${toName},</p>
                <h3>We encountered an issue while trying to process your payment of <b>${amount / 100} UZS</b>.</h3>
                <p>Error Details: <i>${errorMessage}</i></p>
                <p>Please ensure your payment details are up to date or contact our support team for assistance.</p>
                <p>We will be trying to process your payment again tomorrow!</p>
                <br />
                <p>We apologize for the inconvenience and appreciate your prompt attention to this matter.</p>
            `,
        };
        sgMail.setApiKey(process.env.SG_API_KEY);

        await sgMail.send(msg); // Send the email
    } catch (error) {
        console.error('Failed to send charge failure notification:', error);
        throw new Error('Failed to send error notification email.');
    }
};
