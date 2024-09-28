import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import connectDB from './db/database.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// configuracion de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// middleware para manejar datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// conectar a MongoDB
connectDB();

// configuracion de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// rutas para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// integracion de WebSockets para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);

  socket.on('newProduct', (data) => {
    io.emit('updateProducts', data);
  });

  socket.on('deleteProduct', (data) => {
    io.emit('updateProducts', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });
});

app.set('io', io);

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
