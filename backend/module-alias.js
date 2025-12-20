require('module-alias/register');
const moduleAlias = require('module-alias');
const path = require('path');

// Register path aliases for production
moduleAlias.addAliases({
  '@common': path.join(__dirname, 'dist/src/common'),
  '@services': path.join(__dirname, 'dist/src/services'),
  '@middleware': path.join(__dirname, 'dist/src/middleware'),
  '@config': path.join(__dirname, 'dist/src/config'),
  '@shared': path.join(__dirname, '../shared/dist'),
});
