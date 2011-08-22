// Module dependencies.
var async = require('async');

// Module proper.
module.exports = function (redis, version) {
  var oldVersion;

  var versionMigrations = [
    // v0 to v1
    function (callback) {
      redis.mset('a:title', 'josh is gross',
        'a:tagline', 'student, developer, third culture kid',
        'a:contact', JSON.stringify({
          'email': 'joshua.gross@gmail.com',
          'facebook': 'http://www.facebook.com/joshisgross',
          'twitter': 'joshuagross',
          'gplus': '103805160491385357340'
        }),
        callback);
    }
  ];

  async.series([
    function (callback) {
      redis.getset('d:migration_version', version, function (err, res) {
        oldVersion = parseInt(res) || 0;
        callback();
      });
    },
    function (callback) {
      async.whilst(
        function () { return oldVersion < version },
        function (callback) {
          versionMigrations[oldVersion](function () {
            console.log('Migrated from database v' + oldVersion);
            redis.incr('d:migration_version', function (err, res) {
              oldVersion = res;
              callback();
            });
          });
        },
        function () { }
      );
    }
  ]);

  // Warnings about defaults
  /*redis.get('admin_password', function (err, reply) {
    if (reply == null) {
      redis.set('admin_password', 'password', redis_lib.print);
    } else if (reply == 'password') {
      console.log('WARNING: you really should change the default password!');
    }
  });*/
};
