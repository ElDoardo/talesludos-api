const ContactController = {
    submit(req, res) {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      // Simulando o envio de email
      res.json({ message: `Email sent from ${email}` });
    }
  };
  
  module.exports = ContactController;
  