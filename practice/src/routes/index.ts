import { Express } from 'express-serve-static-core';

import registerRoute from './register';
import loginRoute from './login';
import courseRoute from './course';

const route = (app: Express) => {
  app.use('/api/register', registerRoute);
  app.use('/api/login', loginRoute);
  app.use('/api/courses', courseRoute);
};

export default route;
