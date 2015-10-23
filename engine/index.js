/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , extname = path.extname
  , Promise = require('bluebird')
  , Engine = require('velocity').Engine
  , dirname = path.dirname
  , viewsPath = require('../config').viewsPath;

var readCache = {};

/**
 * Require cache.
 */

var cacheStore = {};

/**
 * Require cache.
 */

var requires = {};

/**
 * Clear the cache.
 *
 * @api public
 */

exports.clearCache = function(){
  cacheStore = {};
};

/**
 * Conditionally cache `compiled` template based
 * on the `options` filename and `.cache` boolean.
 *
 * @param {Object} options
 * @param {Function} compiled
 * @return {Function}
 * @api private
 */

function cache(options, compiled) {
  // cachable
  if (compiled && options.filename && options.cache) {
    delete readCache[options.filename];
    cacheStore[options.filename] = compiled;
    return compiled;
  }

  // check cache
  if (options.filename && options.cache) {
    return cacheStore[options.filename];
  }

  return compiled;
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the template string will be cached.
 *
 * @param {String} options
 * @param {Function} fn
 * @api private
 */

function read(path, options, fn) {
  var str = readCache[path];
  var cached = options.cache && str && 'string' == typeof str;

  // cached (only if cached is a string and not a compiled template function)
  if (cached) return fn(null, str);

  // read
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    // remove extraneous utf8 BOM marker
    str = str.replace(/^\uFEFF/, '');
    if (options.cache) readCache[path] = str;
    fn(null, str);
  });
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the partial string will be cached.
 *
 * @param {String} options
 * @param {Function} fn
 * @api private
 */

function readPartials(path, options, fn) {
  if (!options.partials) return fn();
  var partials = options.partials;
  var keys = Object.keys(partials);

  function next(index) {
    if (index == keys.length) return fn(null);
    var key = keys[index];
    var file = join(dirname(path), partials[key] + extname(path));
    read(file, options, function(err, str){
      if (err) return fn(err);
      options.partials[key] = str;
      next(++index);
    });
  }

  next(0);
}


/**
 * promisify
 */
function promisify(fn, exec) {
  return new Promise(function (res, rej) {
    fn = fn || function (err, html) {
      if (err) {
        return rej(err);
      }
      res(html);
    };
    exec(fn);
  });
}

function fromStringRenderer(name) {
  return function(path, options, fn){
    options.filename = path;

    return promisify(fn, function(fn) {
      readPartials(path, options, function (err) {
        if (err) return fn(err);
        if (cache(options)) {
          exports[name].render('', options, fn);
        } else {
          read(path, options, function(err, str){
            if (err) return fn(err);
            exports[name].render(str, options, fn);
          });
        }
      });
    });
  };
}

exports.vm = fromStringRenderer('vm');

exports.vm.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.vm || (requires.vm = new Engine({template: str, root: viewsPath}));
    try {
      fn(null, engine.render(options));
    } catch (err) {
      fn(err);
    }
  });
};


exports.requires = requires;
