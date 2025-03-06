const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(400).json({ message: "Email not found" });
        }

        const passwordMatch = await bcrypt.compare(password, currentUser.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Création du token directement lors du login
        const token = jwt.sign(
            { id: currentUser._id, username: currentUser.username },
            process.env.SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: currentUser._id,
                username: currentUser.username,
                email: currentUser.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

module.exports = router;