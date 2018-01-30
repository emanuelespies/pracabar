/*!
 * Cribbb Gruntfile
 * http://cribbb.com
 * @author Philip Brown
 */
 
'use strict';
 
/**
 * Grunt Module
 */
module.exports = function(grunt) {
	/**
	 * Configuration
	 */
	grunt.initConfig({
		/**
		 * Get package meta data
		 */
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Set project object
		 */
		project: {
		  assets: 'assets',
		  src: '<%= project.assets %>',
		  css: [
			'<%= project.src %>/dev/scss/style.scss',
		  ],
		  js: [
			'<%= project.src %>/dev/js/*.js'
		  ]
		},

		projectIe: {
		  assets: 'assets',
		  src: '<%= project.assets %>',
		  css: [
			'<%= project.src %>/dev/scss/ie.scss',
		  ]
		},

		/**
		* Project banner
		*/
		tag: {
		  banner: '/*\n' +
				  ' * <%= pkg.name %>\n' +
				  ' * <%= pkg.title %>\n' +
				  ' * <%= pkg.url %>\n' +
				  ' * @author <%= pkg.author %>\n' +
				  ' * @version <%= pkg.version %>\n' +
				  ' */\n'
		},
		concat: {
			jsExternal: {
				src: ['<%= project.src %>/dev/js/jquery.min.js', '<%= project.src %>/dev/js/bootstrap.min.js'],
				dest: '<%= project.src %>/dev/js/external.js'
			},
			jsBuilt: {
				src: ['<%= project.src %>/dev/js/external.js', '<%= project.src %>/dev/js/ie10-viewport-bug-workaround.js', '<%= project.src %>/dev/js/main.js'],
				dest: '<%= project.src %>/dev/js/built.js'
			},
			css: {
				src: ['<%= project.src %>/dev/css/bootstrap.min.css', '<%= project.src %>/dev/css/style.css'],
				dest: '<%= project.src %>/dev/css/built.css'
			} 
		},
		cssmin: {
		  combine: {
			files: {
			  '<%= project.src %>/dist/css/built.min.css': ['<%= project.src %>/dev/css/built.css']
			}
		  }
		},
		uglify: {
			options: {
			  compress: {
				drop_console: true
			  }
			},
			js: {
				files: {
					'<%= project.src %>/dist/js/built.min.js': ['<%= project.src %>/dev/js/built.js']
				}
			}
		},
		imagemin: {
			png: {
			  options: {
				optimizationLevel: 7
			  },
			  files: [
				{
				  // Set to true to enable the following options…
				  expand: true,
				  // cwd is 'current working directory'
				  cwd: '<%= project.src %>/dev/img/',
				  src: ['**/*.png'],
				  // Could also match cwd line above. i.e. project-directory/img/
				  dest: '<%= project.src %>/dist/img/',
				  ext: '.png'
				}
			  ]
			},
			jpg: {
				options: {
					progressive: true
				},
			  files: [
					{
						// Set to true to enable the following options…
						expand: true,
						// cwd is 'current working directory'
						cwd: '<%= project.src %>/dev/img/',
						src: ['**/*.jpg'],
						// Could also match cwd. i.e. project-directory/img/
						dest: '<%= project.src %>/dist/img/',
						ext: '.jpg'
					}
				]
			}
		},

		/**
		* Sass
		*/
		sass: {
		  dev: {
			options: {
			  style: '',
			  banner: '<%= tag.banner %>',
			  compass: true
			},
			files: {
			  '<%= project.src %>/dev/css/style.css': '<%= project.css %>'
			}
		  },
		  devIe: {
			options: {
			  style: '',
			  banner: '<%= tag.banner %>',
			  compass: true
			},
			files: {
			  '<%= projectIe.src %>/dev/css/ie.css': '<%= projectIe.css %>'
			}
		  }
		},

		/**
		* Watch
		*/
		watch: {
		  sass: {
			files: '<%= project.src %>/dev/scss/{,*/}*.{scss,sass}',
			tasks: ['sass:dev', 'sass:devIe', 'concat:jsBuilt', 'concat:css', 'cssmin']
		  }
		}

	}); 
	/**
	 * Load Grunt plugins
	 */
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	/**
	* Default task
	* Run `grunt` on the command line
	*/
	grunt.registerTask('default', [
	  'sass:dev',
	  'sass:devIe',
	  'concat:css', 
	  'concat:jsExternal', 
	  'concat:jsBuilt', 
	  'uglify:js',
	  'cssmin',
	  'watch'
	]);
	
};
