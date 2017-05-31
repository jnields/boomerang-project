import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import authentication from './helpers/authentication';

(function validateEnvironment() {
  const envVars = [
    'DB_PASSWORD',
    'PORT',
    'HOST',
  ];
  if (process.env.NODE_ENV !== 'production') {
    envVars.push('PROXY_PORT');
  }
  envVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable '${envVar}' not defined.`);
    }
  });
}());

export default function (router) {
  const app = express();
  app.use(compression());

  // view engine setup
  app.set('views', path.resolve(__dirname, 'src', 'server', 'views'));
  app.set('view engine', 'pug');

  app.use(favicon(
    path.resolve(__dirname, 'src', 'server', 'assets', 'favicon.ico'),
  ));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    '/public',
    express.static(path.resolve(__dirname, 'public')),
  );
  app.use(authentication);

  app.use(router);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  if (process.env.NODE_ENV === 'production') {
    // production error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
      });
    });
  } else {
    // development error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
      });
    });
  }

  return app;
}
