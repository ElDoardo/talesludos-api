require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./src/middlewares/errorHandler');
const routes = require('./src/routes');
const seedAreas = require('./src/scripts/seedAreas');
const path = require('path');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    if (req.headers['content-length'] > 5 * 1024 * 1024) { // 5MB
      return res.status(413).json({ error: 'Arquivo muito grande' });
    }
  }
  next();
});

// Rotas
app.use('/api', routes);

// Inicialização
seedAreas().then(() => {
    console.log('Banco de dados verificado');
}).catch(error => {
    console.error('Erro ao verificar banco de dados:', error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;