/*global describe, beforeEach, it*/
'use strict';

var assert  = require('yeoman-generator').assert;
var path    = require('path');
var helpers = require('yeoman-generator').test;

var basicExpected = [
  '.bowerrc',
  '.gitignore',
  'bower.json',
  'app.js',
  'public/img',
  'public/components',
  'public/js',
  'public/css/style.css',
  'package.json',
  'routes/index.js',
  'routes/user.js',
  'bin/www'
];

var MVCExpected = [
  '.bowerrc',
  '.gitignore',
  'bower.json',
  'app.js',
  'public/img',
  'public/components',
  'public/js',
  'public/css',
  'package.json',
  'config/config.js',
  'config/express.js',
  'app/controllers',
  'app/controllers/home.js',
  'app/models',
  'app/views'
];

var appFiles = {
  basic: basicExpected,
  mvc: MVCExpected
};

var toCoffeeFileArray = function (fileArray) {
  var newArray = [];
  for (var i in fileArray) {
    if (fileArray[i] === 'app.js') {
      newArray.push(fileArray[i]);
    } else {
      newArray.push(fileArray[i].replace(/(.*?)\.js$/, '$1.coffee'));
    }
  }

  return newArray;
};

var runGenerationTest = function (extraFiles, type, engine, coffee, database, buildTool, callback) {
  var expectedFiles;
  this.app.options[type] = true;
  this.app.options['skip-install'] = true;
  this.app.options.database = database;
  this.app.options.viewEngine = engine;
  this.app.options.coffee = coffee;
  this.app.options.buildTool = buildTool;
  expectedFiles = extraFiles.concat(appFiles[type]);
  if (this.app.options.coffee) {
    expectedFiles = toCoffeeFileArray(expectedFiles);
  }
  expectedFiles.push(buildTool === 'grunt' ? 'Gruntfile.js' : 'gulpfile.js');
  this.app.run({}, function () {
    assert.file(expectedFiles);
    callback();
  });
};

describe('Express generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('express:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  describe('Basic generator with Jade', function () {
    var expected = [
      'views/index.jade',
      'views/layout.jade',
      'views/error.jade'
    ];

    it('creates expected files', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'jade', false, 'none', 'grunt', done);
    });

    it('works with coffee', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'jade', true, 'none', 'grunt', done);
    });

    it('works with gulp', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'jade', false, 'none', 'gulp', done);
    });

    it('works with coffee and gulp', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'jade', true, 'none', 'gulp', done);
    });
  });

  describe('Basic generator with EJS', function () {
    var expected = [
      'views/index.ejs',
      'views/header.ejs',
      'views/footer.ejs',
      'views/error.ejs',
    ];

    it('creates expected files', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'ejs', false, 'none', 'grunt', done);
    });

    it('works with coffee', function (done) {
      runGenerationTest.call(this, expected, 'basic', 'ejs', true, 'none', 'grunt', done);
    });
  });


  describe('MVC generator with Jade', function () {
    var expected = [
      'app/views/layout.jade',
      'app/views/error.jade',
      'app/views/index.jade'
    ];
    it('creates expected files', function (done) {
      runGenerationTest.call(this, expected, 'mvc', 'jade', false, 'none', 'grunt', done);
    });

    it('works with coffee', function (done) {
      runGenerationTest.call(this, expected, 'mvc', 'jade', true, 'none', 'grunt', done);
    });

    it('works with gulp', function (done) {
      runGenerationTest.call(this, expected, 'mvc', 'jade', false, 'none', 'gulp', done);
    });

    it('works with coffee and gulp', function (done) {
      runGenerationTest.call(this, expected, 'mvc', 'jade', true, 'none', 'gulp', done);
    });
  });

  describe('MVC generator with EJS', function () {
    it('creates expected files', function (done) {
      var expected = [
        'app/views/header.ejs',
        'app/views/footer.ejs',
        'app/views/error.ejs',
        'app/views/index.ejs'
      ];
      runGenerationTest.call(this, expected, 'mvc', 'ejs', false, 'none', 'grunt', done);
    });

    it('works with coffee', function (done) {
      var expected = [
        'app/views/header.ejs',
        'app/views/footer.ejs',
        'app/views/error.ejs',
        'app/views/index.ejs'
      ];
      runGenerationTest.call(this, expected, 'mvc', 'ejs', true, 'none', 'grunt', done);
    });
  });

  describe('MVC generator with MySQL', function () {
    it('creates expected files', function (done) {
      var expected = [
        'app/models/index.js'
      ];
      runGenerationTest.call(this, expected, 'mvc', 'jade', false, 'mysql', 'grunt', done);
    });

    it('works with coffee', function (done) {
      var expected = [
        'app/models/index.js'
      ];
      runGenerationTest.call(this, expected, 'mvc', 'jade', true, 'mysql', 'grunt', done);
    });
  });
});
