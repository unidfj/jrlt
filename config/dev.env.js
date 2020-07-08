var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API:'"http://jrlt_fa.hqshop.com:"',
  // PORT:'"8095"', 
  // PORT:'"8092"', 
  API:'"https://fajrlt.a6shop.net:"',
  PORT:'"443"', 
  proxy:'"local"'
});
