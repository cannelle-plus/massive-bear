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
          files: ['../yolo-bear/dist/**/*'],
          tasks: ['yolo-bear']
        },
        devjs: {
          files: ['src/**/*', 'specs/**/*'],
          tasks: ['devjs']
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
            {expand: true, cwd:'../yolo-bear/dist/', src: ['**'], dest: 'www-root'}
          ]
        }
      },
      simplemocha: {
          options: {
              globals: ['expect'],
              timeout: 500,
              ignoreLeaks: true,
              ui: 'bdd',
              reporter: 'spec'
          },
          views: { src: ['specs/integrationTests/views/**/*.js'] },
          travis : { src: ['specs/integrationTests/api/**/*.js',
                           'specs/unitTests/**/*.js'
                           ] },
      },
      express: {
        options: {
          // Override defaults here
          // port : 5498 
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
    grunt.loadNpmTasks('grunt-parallel');

    
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'simplemocha:travis', 'clean','copy', 'simplemocha:views',  'watch']);
    grunt.registerTask('yolo-bear', ['clean','copy', 'simplemocha:views']);

    grunt.registerTask('travis',['jshint', 'simplemocha:travis']);

};

