import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import proxy from 'proxy-middleware';

import routes from './routes';
import authentication from './helpers/authentication';

const app = express();

function setupApp(resolvedRoutes) {
  app.use(compression());

  if (process.env.NODE_ENV !== 'production') {
    app.use(
      '/hot-reload-server',
      proxy('http://localhost:35612/hot-reload-server/'),
    );
  }

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
    express.static(
      path.resolve(__dirname, 'public'),
        ),
    );

  app.use(authentication);
  Object.keys(resolvedRoutes).forEach((key) => {
    app.use(key, resolvedRoutes[key]);
  });

    // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

    // error handlers

    // development error handler
    // will print stacktrace
  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
      });
    });
  }

    // production error handler
    // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });
}

export default Promise.resolve(routes)
  .then(setupApp)
  .then(() => app);
