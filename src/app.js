import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname, previousDirectory } from './utils/path.js';
import { connectMongo } from './utils/mongoose.js';
import { middlewares } from './utils/middlewares.js';
import { connectSockets } from './utils/sockets.js';
import { Server } from 'socket.io';

const app = express();
const port = 8080;

await connectMongo();

middlewares(app);

const httpServer = app.listen(port, () => {
   console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

connectSockets(socketServer);

app.engine('handlebars', handlebars.engine());
app.set('views', `${previousDirectory}/views`);
app.set('view engine', 'handlebars');
