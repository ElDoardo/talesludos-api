const ContactService = require('../services/contactService');
const ContactRepository = require('../repositories/contactRepository');
const nodemailer = require('nodemailer');

class ContactServiceImpl extends ContactService {
    async submitContactForm(contactData) {
        const { name, email, message } = contactData;

        const contact = await ContactRepository.create({ name, email, message });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: 'eduardoguerreirorocha@gmail.com',
            subject: 'Contato - Tales Ludos',
            text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        return contact;
    }
}

module.exports = new ContactServiceImpl();