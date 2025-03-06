const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Reservation = require('../model/reservation.model');
const emailService = require('../service/email');
const User = require('../model/user.model');

// Création d'une réservation
router.post('/create', authenticate, async (req, res) => {
    const { reservationDate, numberOfGuests } = req.body;
    const userId = req.user.id;

    if (!reservationDate || !numberOfGuests) {
        return res.status(400).json({ message: 'Reservation date and number of guests are required' });
    }

    // Calcul de la plage horaire (créneau d'1 heure)
    const reservationTime = new Date(reservationDate);
    const slotStart = new Date(reservationTime);
    slotStart.setMinutes(0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotEnd.getHours() + 1);

    const totalTables = parseInt(process.env.TOTAL_TABLES, 10) || 10;

    try {
        // Vérification de la disponibilité des tables sur le créneau choisi
        const count = await Reservation.countDocuments({
            reservationDate: { $gte: slotStart, $lt: slotEnd }
        });

        if (count >= totalTables) {
            return res.status(400).json({ message: 'No available tables at this time slot' });
        }

        const newReservation = new Reservation({
            user: userId,
            reservationDate: reservationTime,
            numberOfGuests
        });

        await newReservation.save();

        // Récupération de l'e-mail utilisateur si non présent dans le token
        if (!req.user.email) {
            const userData = await User.findById(userId);
            req.user.email = userData.email;
        }

        // Envoi de l'e-mail de confirmation de création
        emailService.sendConfirmationEmail(req.user.email, {
            reservationDate: reservationTime,
            numberOfGuests
        }, req.user.username)
            .catch(err => console.error("Email sending error:", err));

        res.status(200).json({
            message: 'Reservation created successfully',
            reservationId: newReservation._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Récupération des réservations de l'utilisateur connecté (via le token)
router.get('/user', authenticate, async (req, res) => {
    const userId = req.user.id;
    try {
        const reservations = await Reservation.find({ user: userId });
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// (Optionnel) Récupération des réservations d'un utilisateur par son id
router.get('/user/:userId', authenticate, async (req, res) => {
    const requestedUserId = req.params.userId;
    if (req.user.id !== requestedUserId) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    try {
        const reservations = await Reservation.find({ user: requestedUserId });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modification d'une réservation
router.put('/update/:id', authenticate, async (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;
    const { reservationDate, numberOfGuests } = req.body;

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        if (reservation.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Mise à jour des champs
        if (reservationDate) {
            reservation.reservationDate = new Date(reservationDate);
        }
        if (numberOfGuests) {
            reservation.numberOfGuests = numberOfGuests;
        }
        await reservation.save();

        // Récupération de l'e-mail utilisateur si non présent dans le token
        if (!req.user.email) {
            const userData = await User.findById(userId);
            req.user.email = userData.email;
        }

        // Envoi de l'e-mail de confirmation de modification
        emailService.sendUpdateEmail(req.user.email, {
            reservationDate: reservation.reservationDate,
            numberOfGuests: reservation.numberOfGuests
        }, req.user.username)
            .catch(err => console.error("Error sending update email:", err));

        res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Suppression d'une réservation
router.delete('/delete/:id', authenticate, async (req, res) => {
    const reservationId = req.params.id;
    const userId = req.user.id;
    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        if (reservation.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Récupération de l'e-mail utilisateur si non présent dans le token
        if (!req.user.email) {
            const userData = await User.findById(userId);
            req.user.email = userData.email;
        }

        // Envoi de l'e-mail de confirmation d'annulation avant suppression
        emailService.sendDeletionEmail(req.user.email, {
            reservationDate: reservation.reservationDate,
            numberOfGuests: reservation.numberOfGuests
        }, req.user.username)
            .catch(err => console.error("Error sending deletion email:", err));

        await Reservation.findByIdAndDelete(reservationId);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;