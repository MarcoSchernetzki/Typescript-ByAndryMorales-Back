import http from 'http';
import { app } from './app.js';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { CustomError } from './interfaces/error.js';
import createDebug from 'debug';
import { dbConnect } from './db.conect.js';
dotenv.config();
const debug = createDebug('MS:src:index');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.on('listening', () => {
    const addr = server.address();
    if (addr === null) return;
    let bind: string;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `port ${addr?.port}`;
    }
    debug(`Listening on ${bind}`);
});

server.on('error', (error: CustomError, response: http.ServerResponse) => {
    response.statusCode = error.statusCode;
    response.statusMessage = error.statusMessage;
    response.write(error.message);
    response.end();
});

dbConnect()
    .then(() => server.listen(port))
    .catch((error) => server.emit(error));
