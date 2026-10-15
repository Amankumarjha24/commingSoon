/**
 * patch-node24.cjs
 * Critical fix for Node.js v24.14.0 on Windows
 * Next.js triggers EISDIR on fs.readlink for regular files instead of EINVAL.
 */
const fs = require('fs');
const originalReadlink = fs.readlink.bind(fs);
const originalReadlinkSync = fs.readlinkSync.bind(fs);

fs.readlink = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  originalReadlink(path, options, function(err, linkString) {
    if (err && err.code === 'EISDIR') {
      const newErr = new Error(err.message.replace('EISDIR', 'EINVAL'));
      newErr.code = 'EINVAL';
      return callback(newErr);
    }
    callback(err, linkString);
  });
};

fs.readlinkSync = function(path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (err) {
    if (err.code === 'EISDIR') {
      const newErr = new Error(err.message.replace('EISDIR', 'EINVAL'));
      newErr.code = 'EINVAL';
      throw newErr;
    }
    throw err;
  }
};
