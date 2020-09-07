
var fs = require("fs");
var pkg = JSON.parse(fs.readFileSync("./package.json"));

var seek = /^.*app[\/\\](components|pages|common)[\/\\]/;

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
				"no-unused-vars": [1, {
						"varsIgnorePattern": "^(_|[A-Z])",
						"args": "after-used"
					}
				],
				"block-scoped-var": 2,
				"no-undef": 2,
				"semi": 2,
				"max-depth": [1, {
						"max": 10
					}
				]
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
				"NameGenerator",
				"EventEmitter",
				"SearchIndex",
				"filterXSS",
				"Component",
				"Invasion",
				"Anomaly",
				"Random",
				"Dice",
				"_p",

				"RSModifierAttributes",
				"UserInformation",
				"RSModifierStats",
				"RSCalculator",
				"RSArchetype",
				"RSCondition",
				"RSInventory",
				"RSKnowledge",
				"RSStreamURL",
				"RSItemType",
				"RSPlaylist",
				"RSLogLevel",
				"RSLocation",
				"RSUniverse",
				"RSModifier",
				"RSAbility",
				"RSJournal",
				"RSSetting",
				"RSHistory",
				"RSDataset",
				"RSLoadout",
				"RSSession",
				"RSPlayer",
				"RSObject",
				"RSEffect",
				"RSEntity",
				"RSLocale",
				"RSPlanet",
				"RSWidget",
				"RSEvent",
				"RSImage",
				"RSParty",
				"RSSkill",
				"RSNote",
				"RSBook",
				"RSItem",
				"RSRace",
				"RSRoom",
				"RSSlot",
				"RSType",
				"RSLog",
				"RSSex"
			]
		},
		"app": [
			"spec/app/**/*.js",
			"appWorker/**/*.js",
			"appWorker/*.js",
			"app/**/*.js",
			"app/*.js"
		]
	},
	"connect": {
		"app": {
			"options": {
				"port": 3082,
				"base": "deploy/",
				"hostname": "*",
				"livereload": 3083,
				"middleware": function(connect, options, middlewares) {
					middlewares.unshift(function(req, res, next) {
						res.setHeader("Access-Control-Allow-Origin", "*");
						res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * 'self' data: blob: https:;");
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
				"appWorker/**/*.js",
				"app/manifest.json",
				"app/**/*.less",
				"app/**/*.json",
				"app/**/*.html",
				"app/**/*.css",
				"app/**/*.js",
				"spec/**/*.js"
			],
			"tasks": ["development"]
		},
		"docs": {
			"files": [
				"app/**/*.js"
			],
			"tasks": ["yuidoc:app"]
		}
	},
	"concat": {
		// These files corrupt the sourcemap for main for whatever reason so they handled separately
		"worker": {
			"options": {
				"sourceMap": false
			},
			"src": [
				"appWorker/**/*.js",
				"appWorker/*.js"
			],
			"dest": "deploy/worker.js"
		},
		"externals": {
			"options": {
				"sourceMap": true
			},
			"src": [
				"external/cytoscape.js",
				"external/cola.js",
				"external/cytoscape-cola.js"
			],
			"dest": "deploy/externals.js"
		},
		"app": {
			"options": {
				"footer": "\nrsSystem.version=\"" + pkg.version + "\"",
				"sourceMap": true
			},
			"src": [
				"node_modules/xss/dist/xss.min.js",
				"node_modules/hammerjs/hammer.js",
				"node_modules/showdown/dist/showdown.min.js",
				"node_modules/vue/dist/vue.js",
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/vue-router/dist/vue-router.js",

				"transient/templates.js",
				"app/library/*.js",
				"app/library/*/**/*.js",

				"app/core/*.js",
				"app/core/*/**/*.js",
				
				"app/common/*.js",
				"app/common/*/**/*.js",
				
				"app/components/*.js",
				"app/components/*/**/*.js",

				"app/subcomponents/*.js",
				"app/subcomponents/*/**/*.js",

				"app/pages/*.js",
				"app/pages/*/**/*.js",

				"app/main/*/**/*.js",
				"app/main/*.js"
			],
			"dest": "deploy/main.js"
		},
		"less": {
			"src": [
				"app/styles/*.less",
				"app/styles/*/**/*.less",
				"app/pages/**/*.less",
				"app/common/**/*.less",
				"app/components/**/*.less"
			],
			"dest": "deploy/app.less"
		}
	},
	"uglify": {
		"options": {
			"sourceMap": true
		},
		"app": {
			"options": {
				"footer": "\nrsSystem.version = \"" + pkg.version + "\"",
				"reserved": ["rsSystem"]
			},
			"files": {
				"deploy/main.js": [
					"node_modules/xss/dist/xss.min.js",
					"node_modules/hammerjs/hammer.js",
					"node_modules/showdown/dist/showdown.min.js",
					"node_modules/vue/dist/vue.js",
					"node_modules/jquery/dist/jquery.min.js",
					"node_modules/vue-router/dist/vue-router.js",

					"transient/templates.js",
					"app/library/*.js",
					"app/library/*/**/*.js",

					"app/core/*.js",
					"app/core/*/**/*.js",
					
					"app/common/*.js",
					"app/common/*/**/*.js",
					
					"app/components/*.js",
					"app/components/*/**/*.js",

					"app/subcomponents/*.js",
					"app/subcomponents/*/**/*.js",

					"app/pages/*.js",
					"app/pages/*/**/*.js",

					"app/main/*/**/*.js",
					"app/main/*.js"
				]
			}
		},
		"externals": {
			"files": {
				"deploy/externals.js": [
					"external/cytoscape.js",
					"external/cola.js",
					"external/cytoscape-cola.js"
				]
			}
		},
		"worker": {
			"files": {
				"deploy/worker.js": [
					"appWorker/**/*.js",
					"appWorker/*.js"
				]
			}
		}
	},
	"less": {
		"app": {
			"files": {
				"deploy/main.css": [
					"deploy/app.less"
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
					"path": "app/**/*.html",
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
					"./app/"
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

	grunt.registerTask("build", ["eslint", "templify:app","uglify:worker","uglify:externals","uglify:app","concat:less","less:app"]);
	grunt.registerTask("development", ["eslint", "templify:app","concat:worker","concat:externals","concat:app","concat:less","less:app"]);
	grunt.registerTask("default", ["development","concat:worker","concat:externals","connect:app","open:app", "watch:app"]);
};
