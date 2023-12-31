import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USERMAILER,
        pass: process.env.PASSMAILER
    }
});

export default transporter;