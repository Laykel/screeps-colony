module.exports = function (grunt) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const creds = require('./.creds.json');

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-screeps');

  // Compile to JS
  grunt.initConfig({
    run: {
      build: {
        exec: 'pnpm build',
      },
    },

    // Flatten directory structure
    // TODO This doesn't work, as `require` calls aren't rewritten
    copy: {
      screeps: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: '**',
            dest: 'dist/',
            filter: 'isFile',
            rename: function (dest, src) {
              // Replace folder structure with dots
              return dest + src.replace(/\//g, '.');
            },
          },
        ],
      },
    },

    // Push to Screeps server
    screeps: {
      options: {
        email: creds.email,
        token: creds.token,
        branch: 'default',
        ptr: false,
      },
      dist: {
        src: ['build/*.js'],
      },
    },
  });

  grunt.registerTask('default', ['run:build', 'screeps']);
};
