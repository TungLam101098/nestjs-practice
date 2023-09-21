import { Express } from 'express-serve-static-core';

import registerRoute from './register';
import loginRoute from './login';
import courseRoute from './course';
import wishlistRoute from './wishlist';

const route = (app: Express) => {
  app.use('/api/register', registerRoute);
  app.use('/api/login', loginRoute);
  app.use('/api/courses', courseRoute);
  app.use('/api/wishlist', wishlistRoute);
};

export default route;
