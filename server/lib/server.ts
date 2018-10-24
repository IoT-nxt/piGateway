import { createServer, Server } from 'http';
import { AddressInfo } from 'net';

import app from './app';

const port: any = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server: Server = createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val): any {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind: string = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  let address: AddressInfo | string = server.address();
  const bind: string = typeof address === 'string'
    ? 'pipe ' + address
    : 'port ' + address.port;
  console.error('Listening on ' + bind);
}
