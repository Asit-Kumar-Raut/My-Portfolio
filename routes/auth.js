const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @route   POST api/auth/signup
// @desc    Register user & send OTP
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 3600000; // 1 hour

        user = new User({ name, email, password, otp, otpExpires });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification OTP for Portfolio',
            text: `Your OTP is: ${otp}. It expires in 1 hour.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error(err);
            else console.log('OTP Email sent: ' + info.response);
        });

        res.json({ msg: 'OTP sent to email. Please verify.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            res.json({ msg: 'Email verified successfully' });
        } else {
            res.status(400).json({ msg: 'Invalid or expired OTP' });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        if (!user.isVerified) return res.status(400).json({ msg: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, name: user.name });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/contact
// @desc    Protected Contact Route
router.post('/contact', async (req, res) => {
    const { name, email, subject, message, token } = req.body;
    try {
        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Portfolio Message: ${subject}`,
            text: `From: ${name} (${email})\n\nMessage:\n${message}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json({ msg: 'Error sending email' });
            res.json({ msg: 'Message sent successfully!' });
        });
    } catch (err) {
        res.status(401).json({ msg: 'Authorization denied. Please login first.' });
    }
});

module.exports = router;
