module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      jshint: {
        // define the files to lint
        files: ['gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
        // configure JSHint (documented at http://www.jshint.com/docs/)
        options: {
            // more options here if you want to override JSHint defaults
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        }
      }, 

      watch: {
        yolobear : {
          files: ['../yolo-bear/www-root/**/*'],
          tasks: ['yolo-bear']
        },
        devjs: {
          files: ['src/**/*'],
          tasks: ['devjs'],
          options: {
            spawn: false //Without this option specified express won't be reloaded
          }
        },
        wwwroot : {
          files: ['www-root/**/*'],
          options : {
            //livereload : 6546
          }
        }
      },

      clean : {
        wwwroot : ['www-root'],
				options : { force : true }
      },

      copy: {
        wwwroot : {
          files: [
            // includes files within path and its sub-directories
            {expand: true, cwd:'../yolo-bear/www-root/', src: ['**'], dest: 'www-root'}
          ]
        }
      },
      simplemocha: {
          options: {
              globals: ['expect'],
              timeout: 3000,
              ignoreLeaks: false,
              ui: 'bdd',
              reporter: 'tap'
          },
          all: { src: ['specs/unitTests/*.js'] }
      },
      replace : {
        yoloToMAssive: {
          src : ['www-root/js/yolo-bear.js'],
          overwrite : true,
          replacements: [{
            from:   'new fakeRepository',
            to: 'new ajaxRepository'
          }]
        }
      },

      express: {
        options: {
          // Override defaults here
          port : 5498 
        },
        web: {
          options: {
            script: 'src/server.js'  
          }
        },
      },
      parallel : {
        web : {
          options:{
            stream:true
          },
          tasks : [ 
            {
            grunt:true,
            args : ['watch:yolobear']
            },
            {
            grunt:true,
            args : ['watch:devjs']
            },
            {
            grunt:true,
            args : ['watch:wwwroot']
            }
          ]
        }
      }

    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-parallel');
    
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'simplemocha', 'clean','copy', 'replace', 'express', "watch:devjs"]);
    grunt.registerTask('yolobear', ['watch:yolobear']);
    

    grunt.registerTask('devjs', ['jshint', 'simplemocha','express:web']);
    grunt.registerTask('yolo-bear', ['clean', 'copy', 'replace']);

    grunt.registerTask('travis',['jshint', 'simplemocha']);

};

