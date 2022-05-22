const path = require('path');
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], 
    prependData: `@import "_global_variables.scss";`,
},
};