import debug from 'debug';
import http from 'http';
import cluster from 'cluster';
import os from 'os';

const port = process.env.PORT;
const cpus = os.cpus().length;
const debugLog = debug('mern:server');

function onListening(server) {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debugLog(`Listening on ${bind}`);
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

    // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function startServer(app) {
  app.set('port', port);

  const server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => onListening(server));
}

export default function startApp(app) {
  if (cluster.isMaster && process.env.NODE_ENV === 'production') {
    for (let i = 0; i < cpus; i += 1) {
      cluster.fork();
    }
  } else {
    startServer(app);
  }
}
