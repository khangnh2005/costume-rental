const categoryRoutes = require('./category.route');
const costumeRoutes = require('./costume.route');
const config = require('../../config/config')

const PATH_ADMIN = config.systemConfig.prefixAdmin;
const routeAdmin = (app) => {
  app.use(`/${PATH_ADMIN}/categories`, categoryRoutes);
  app.use(`/${PATH_ADMIN}/costumes`, costumeRoutes);
};

module.exports = routeAdmin;