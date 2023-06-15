import express from 'express';
import { create } from 'express-handlebars';
import { __dirname, previousDirectory } from './utils/path.js';
import { environment } from './utils/mongoose.js';
import { middlewares } from './middlewares/middlewares.js';
import { connectSockets } from './utils/sockets.js';
import { Server } from 'socket.io';

const app = express();
const port = 8080;

await environment();

middlewares(app);

const httpServer = app.listen(port, () => {
   console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

connectSockets(socketServer);

const hbs = create({
   runtimeOptions: {
      allowProtoPropertiesByDefault: true,
   },
});
app.engine('handlebars', hbs.engine);
app.set('views', `${previousDirectory}/views`);
app.set('view engine', 'handlebars');
