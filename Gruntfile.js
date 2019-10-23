
var fs = require("fs");
var pkg = JSON.parse(fs.readFileSync("./package.json"));

var seek = /^.*build[\/\\](components|pages)[\/\\]/;

var config = {
	"pkg": pkg,
	"eslint": {
		"options": {
			/* http://eslint.org/docs/rules/ */
			"rules": {
				"eqeqeq": 0,
				"curly": [2, "all"],
				"no-undef": 2,
				"semi": 2,
				"indent": [2, "tab", {
						"ignoreComments": true,
						"MemberExpression": 0,
						"SwitchCase": 1
					}
				],
				"comma-dangle": 2,
				"quotes": [2, "double"],
				"no-unused-vars": [2, {
						"varsIgnorePattern": "^_?ignore"
					}
				],
				"block-scoped-var": 2,
				"no-undef": 2,
				"semi": 2,
				"max-depth": [1, {
						"max": 10
					}
				],
				"no-unused-vars": 1
			},
			"terminateOnCallback": false,
			"callback": function (response) {
				if (response.errorCount) {
					var result,
					message;
					for (result = response.results.length - 1; result !== -1; --result) {
						if (!response.results[result].errorCount) {
							response.results.splice(result, 1);
						} else {
							for (message = response.results[result].messages.length - 1; message !== -1; --message) {
								if (response.results[result].messages[message].severity !== 2) {
									response.results[result].messages.splice(message, 1);
								}
							}
						}
					}
				}
				return response;
			},
			"envs": ["browser", "jasmine", "es6"],
			"globals": [
				"DocumentTouch",
				"XMLHttpRequest",
				"sessionStorage",
				"localStorage",
				"_gazeVersion",
				"FileReader",
				"cytoscape",
				"location",
				"document",
				"angular",
				"Promise",
				"Hammer",
				"Image",
				"global",
				"window",
				"inject",
				"Gaze",
				"cola",
				"atob",
				"btoa",
				"VueRouter",
				"Vue",
				"d3",
				"window",
				"location",
				"localStorage",
				"sessionStorage",
				"DEFAULTS",
				"ERROR_Codes",
				"Highcharts",
				"showdown",
				"$0",
				"$",

				"rsSystem",
				"Random",
				"Component",
				"NameGenerator",
				"SearchIndex",
				"EventEmitter",
				"Invasion",
				"Anomaly",
				"_p",

				"RSModifierAttributes",
				"UserInformation",
				"RSModifierStats",
				"RSCalculator",
				"RSCondition",
				"RSArchetype",
				"RSInventory",
				"RSKnowledge",
				"RSLogLevel",
				"RSLocation",
				"RSUniverse",
				"RSModifier",
				"RSAbility",
				"RSHistory",
				"RSLoadout",
				"RSPlayer",
				"RSObject",
				"RSEffect",
				"RSEntity",
				"RSPlanet",
				"RSParty",
				"RSSkill",
				"RSNote",
				"RSBook",
				"RSItem",
				"RSRace",
				"RSLog"
			]
		},
		"app": [
			"spec/app/**/*.js",
			"build/**/*.js",
			"build/*.js"
		]
	},
	"connect": {
		"app": {
			"options": {
				"port": 3082,
				"base": "app/",
				"hostname": "*",
				"livereload": 3083,
				"middleware": function(connect, options, middlewares) {
					middlewares.unshift(function(req, res, next) {
						res.setHeader("Access-Control-Allow-Origin", "*");
						res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval';");
						next();
					});
					return middlewares;
				}
			}
		}
	},
	"open": {
		"app": {
			"path": "http://127.0.0.1:3082/"
		},
		"karma": {
			"path": "http://127.0.0.1:5060/"
		}
	},
	"watch": {
		"app": {
			"options": {
				"livereload": {
					"host": "0.0.0.0",
					"port": 3083
				},
				"livereloadOnError": false
			},
			"files": [
				"Gruntfile.js",
				"app/manifest.json",
				"build/**/*.less",
				"build/**/*.json",
				"build/**/*.html",
				"build/**/*.css",
				"build/**/*.js",
				"spec/**/*.js"
			],
			"tasks": ["build"]
		},
		"docs": {
			"files": [
				"build/**/*.js"
			],
			"tasks": ["yuidoc:app"]
		}
	},
	"concat": {
		"app": {
			"options": {
				"sourceMap": true
			},
			"src": [
				"node_modules/hammerjs/hammer.js",
				"node_modules/showdown/dist/showdown.min.js",
				"node_modules/vue/dist/vue.js",
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/vue-router/dist/vue-router.js",
				
				"node_modules/cytoscape/dist/cytoscape.js",
				"node_modules/cytoscape-cola/cola.js",
				"node_modules/cytoscape-cola/cytoscape-cola.js",

				"transient/templates.js",
				"build/library/*.js",
				"build/library/*/**/*.js",

				"build/core/*.js",
				"build/core/*/**/*.js",
				
				"build/common/*.js",
				"build/common/*/**/*.js",
				
				"build/components/*.js",
				"build/components/*/**/*.js",

				"build/subcomponents/*.js",
				"build/subcomponents/*/**/*.js",

				"build/pages/*.js",
				"build/pages/*/**/*.js",

				"build/main/*/**/*.js",
				"build/main/*.js"
			],
			"dest": "app/main.js"
		},
		"less": {
			"src": [
				"build/styles/*.less",
				"build/styles/*/**/*.less",
				"build/pages/**/*.less",
				"build/components/**/*.less"
			],
			"dest": "build/app.less"
		}
	},
	"less": {
		"app": {
			"files": {
				"app/main.css": [
					"build/app.less"
				]
			}
		}
	},
	"templify": {
		"options": {
			"autoAffix": true,
		},
		"app": {
			"templates": [{
					"path": "build/**/*.html",
					"rewrite": function (name) {
						var ex = seek.exec(name);
						if(ex) {
							var st = name.replace(ex[0], ""),
								i = st.lastIndexOf("/"),
								d = st.lastIndexOf(".");
							if(i !== -1) {
								st = "/" + st.substring(0, i) + st.substring(d);
							} else {
								st = "/" + st;
							}
							st = ex[1] + st;
							return st.replace(/_/g, "/");
						} else {
							return name;
						}
						
						/*
						return name.replace(/^.*build[\/\\]components[\/\\]/, "component/")
								.replace(/^.*build[\/\\]pages[\/\\]/, "page/")
								.replace(/_/g, "/");
								*/
					}
				}
			],
			"suffixes": [".html"],
			"mode": "vue",
			"output": "./transient/templates.js"
		}
	},
	"yuidoc": {
		"compile": {
			"name": "<%= pkg.name %>",
			"description": "<%= pkg.description %>",
			"version": "<%= pkg.version %>",
			"url": "<%= pkg.homepage %>",
			"options": {
				"outdir": "./docs",
				"paths": [
					"./build/"
				]
			}
		}
	}
};

module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);

	grunt.loadNpmTasks("grunt-contrib-templify");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("gruntify-eslint");

	grunt.initConfig(config);

	grunt.registerTask("build", ["eslint", "templify:app","concat:app","concat:less","less:app"]);
	grunt.registerTask("default", ["build","connect:app","open:app", "watch:app"]);
};
