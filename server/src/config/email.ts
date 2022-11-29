import nodemailer from 'nodemailer'

export const smtpTransport = nodemailer.createTransport({
    service: 'google',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.MAIL_SERVICE_USER,
        pass: process.env.MAIL_SERVICE_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});