/* global atob:true */

if (typeof atob === 'undefined') {
  global.atob = require('atob');
}
