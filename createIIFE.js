//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
const common = [xl + 'define.js', xl + 'xtal-latx.js',  'ob-session-api.js', 'ob-session-base.js'];
jiife.processFiles(common.concat(['ob-session-watch.js']), 'dist/ob-session-watch.iife.js');
jiife.processFiles(common.concat(['ob-session-update.js']), 'dist/ob-session-update.iife.js');
jiife.processFiles(common.concat(['ob-session-update.js', 'ob-session-watch.js']), 'dist/ob-session.iife.js');



