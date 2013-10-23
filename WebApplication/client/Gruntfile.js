module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-stylus");

    grunt.initConfig({
        pkg    : grunt.file.readJSON("package.json"),
        concat : {
            options: {
                separator: "\n",
                process : true
            },
            dist   : {
                files: [
                    {
                        src : [
                            "js/common/**/*.js",
                            "js/app.js",
                            "js/app/**/*.js"
                        ],
                        dest: "build/<%= pkg.name %>.js"
                    }
                ]
            }
        },
        uglify : {
            options: {
                banner: "/*! <%= pkg.name %>  <%= pkg.version %> - <%= grunt.template.today(\"dd-mm - yyyy\") %> */\n"
            },
            dist   : {
                files: {
                    "build/<%= pkg.name %>.min.js": ["<%= concat.dist.files[0].dest %>"]
                }
            }
        },
        jasmine: {
            src    : [
                "js/vendor/**/*.js",
                "js/app.js",
                "js/common/**/*.js",
                "js/app/**/*.js",

                //testing mocks
                "test/mocks/*.js",
                "test/vendor/**/*.js"
            ],
            options: {
                specs: "test/**/*.spec.js"
            }
        },
        jshint : {
            files  : [
                "gruntfile.js",
                "js/common/**/*.js",
                "js/app.js",
                "js/app/**/*.js",
                "test/*.js"
            ],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console : true,
                    module  : true,
                    document: true,
                    angular : true
                }
            }
        },
        stylus : {
            compile: {
                paths : ["resources/stylus"],
                files : {
                    "resources/css/app.css" : "resources/stylus/app.styl"
                }
            }
        },
        watch  : {
            css: {
                files: "resources/stylus/*.styl",
                tasks: ["stylus"]
            },
            scripts : {
                files: "js/app/**/*.js",
                tasks: ["jasmine", "concat", "uglify"]
            }
        }
    });

    grunt.registerTask("default", ["jshint", "concat", "uglify", "stylus"]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("all", ["jshint", "jasmine", "concat", "uglify", "stylus"]);
};