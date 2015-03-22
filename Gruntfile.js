module.exports = function(grunt) {
	"use strict";
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		htmlhint: {
			build: {
				options: {
					'tag-pair' : true,
					'tagname-lowercase' : true,
					'attr-lowercase' : true,
					'attr-value-double-quotes' : false,
					'doctype-first' : true,
					'spec-char-escape' : true,
					'id-unique' : true,
					'head-script-disabled' : true,
					'style-disabled' : true
				},
				src : ['index.html']
			}
		},
		jshint: {
			build: {
				src: ['js/**/*.js']
			}
		},
		uglify: {
			build: {
				files: {
					'build/js/base.min.js': ['assets/js/base.js']
				}
			}
		},
		cssc: {
			build: {
				options: {
					consolidateViaDeclarations: true,
					consolidateViaSelectors: true,
					consolidateMediaQueries: true,
				},
				files: {
					'build/css/master.css': 'build/css/master.css'
				}
			}
		},
		cssmin: {
			build: {
				src: 'build/css/master.css',
				dest: 'build/css/master.css'
			}
		},
		sass: {
			build: {
				files: {
					'build/css/master.css': 'assets/sass/master.scss'
				}
			}
		},
		watch: {
			html: {
				files: ['index.html'],
				tasks: ['htmlhint']
			},
			js: {
				files: ['assets/js/base.js'],
				tasks: ['uglify']
			},
			css: {
				files: ['assets/sass/**/*.scss'],
				tasks: ['buildcss']
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('buildcss', ['sass', 'cssc', 'cssmin']);
};