const Contact = require('../entities/contactEntity');

class ContactRepository {
    async create(contactData) {
        return await Contact.create(contactData);
    }
}

module.exports = new ContactRepository();