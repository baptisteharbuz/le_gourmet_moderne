const nodemailer = require('nodemailer');

// Création du transporteur
const transporter = nodemailer.createTransport({
    service: 'gmail', // Vous pouvez adapter selon votre fournisseur
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction pour formater la date (à personnaliser si besoin)
const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const sendConfirmationEmail = async (to, reservationDetails, userName) => {
    const { reservationDate, numberOfGuests } = reservationDetails;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Reservation Confirmation',
        text: `Bonjour ${userName},\n\nVotre réservation a été confirmée pour le ${formatDate(reservationDate)} pour ${numberOfGuests} personnes.\n\nMerci et à bientôt !`
    };
    return transporter.sendMail(mailOptions);
};

const sendUpdateEmail = async (to, reservationDetails, userName) => {
    const { reservationDate, numberOfGuests } = reservationDetails;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Reservation Update Confirmation',
        text: `Bonjour ${userName},\n\nVotre réservation a été modifiée.\nNouvelle réservation : le ${formatDate(reservationDate)} pour ${numberOfGuests} personnes.\n\nMerci !`
    };
    return transporter.sendMail(mailOptions);
};

const sendDeletionEmail = async (to, reservationDetails, userName) => {
    const { reservationDate, numberOfGuests } = reservationDetails;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Reservation Cancellation Confirmation',
        text: `Bonjour ${userName},\n\nVotre réservation pour le ${formatDate(reservationDate)} pour ${numberOfGuests} personnes a été annulée.\n\nNous espérons vous revoir bientôt !`
    };
    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendConfirmationEmail,
    sendUpdateEmail,
    sendDeletionEmail
};