import getApp from './get-app';
import startApp from './start-app';
import routes from './routes/dev-server';

startApp(getApp(routes));
