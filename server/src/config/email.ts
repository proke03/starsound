import nodemailer from 'nodemailer'

export const smtpTransport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE_NAME,
    auth: {
        user: process.env.MAIL_SERVICE_USER,
        pass: process.env.MAIL_SERVICE_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});