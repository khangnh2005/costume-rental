const authRoutes = require('./auth.route');
const costumeRoutes = require('./costume.route');
const categoryRoutes = require('./category.route');

const routeClient = (app) => {
  app.use('/client/auth', authRoutes);
  app.use('/client/costumes', costumeRoutes);
  app.use('/client/categories', categoryRoutes);
};

module.exports = routeClient;
