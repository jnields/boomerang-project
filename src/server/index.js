import debug from 'debug';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cluster from 'cluster';
import os from 'os';

import appPromise from './app';

const cpus = os.cpus().length;
const debugLog = debug('mern:server');

(function validateEnvironment() {
  const envVars = [
    'BOOMERANG_PASSWORD',
  ];
  if (process.env.NODE_ENV === 'production') {
    envVars.push('CERT_FILE', 'KEY_FILE', 'PORT');
  }
  envVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable '${envVar}' not defined.`);
    }
  });
}());

const port = ((val) => {
  const intPort = parseInt(val, 10);
  if (isNaN(intPort)) {
    return val;
  }
  if (intPort >= 0) {
    return intPort;
  }
  return false;
})(process.env.PORT || '3000');

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

  let server;
  if (process.env.NODE_ENV === 'production') {
    server = https.createServer(
      {
        cert: fs.readFileSync(process.env.CERT_FILE),
        key: fs.readFileSync(process.env.KEY_FILE),
      },
      app,
  );
  } else {
    server = http.createServer(app);
  }

  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => onListening(server));
}

Promise.resolve(appPromise).then(
  (app) => {
    if (cluster.isMaster && app.get('env') === 'production') {
      for (let i = 0; i < cpus; i += 1) {
        cluster.fork();
      }
    } else {
      startServer(app);
    }
  },
  (err) => {
    console.log(err);
    process.exit(1);
  },
);
