
var fs, config, applications, buildBeta, deployBeta, buildApp;
fs = require("fs");

var UglifyJS = require("uglify-es");

var pkg = JSON.parse(fs.readFileSync("./package.json"));
var footer = "\r\nwindow.version = \"V" + pkg.version + "\";";
buildBeta = [];
buildApp = [];
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
				"camelcase": 2,
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
			"envs": ["browser", "node", "jasmine"],
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
				
				"AQCharacter",
				"AQPlayer",
				"AQWorlds",
				"AQWorld"
			]
		},
		"target": ["site/components/**/control*.js",
			"site/components/**/main.js",
			"site/components/**/scripts.js",
			"site/components/**/startup.js",
			"site/components/**/module*.js",
			"site/components/**/directive*.js",
			"site/components/**/service*.js",
			"site/components/**/factory*.js",
			"site/components/**/widget*.js",
			"site/loading.js",
			"site/main.js",

			"site-beta/components/**/control*.js",
			"site-beta/components/**/main.js",
			"site-beta/components/**/scripts.js",
			"site-beta/components/**/startup.js",
			"site-beta/components/**/module*.js",
			"site-beta/components/**/directive*.js",
			"site-beta/components/**/service*.js",
			"site-beta/components/**/factory*.js",
			"site-beta/components/**/widget*.js",
			"site-beta/subcomponents/**/*.js",
			"site-beta/assembly/**/*.js",
			"site-beta/page/**/*.js",
			"site-beta/app/**/*.js",
			"spec/beta/**/*.js",

			"spec/beta/**/*.js",
			"spec/app/**/*.js"
		],
		"beta": [
			"site-beta/components/**/*.js",
			"site-beta/subcomponents/**/*.js",
			"site-beta/assembly/**/*.js",
			"site-beta/common/**/*.js",
			"site-beta/page/**/*.js",
			"site-beta/app/**/*.js",
			"spec/beta/**/*.js"
		],
		"app": [
			"site/components/**/control*.js",
			"site/components/**/main.js",
			"site/components/**/scripts.js",
			"site/components/**/startup.js",
			"site/components/**/module*.js",
			"site/components/**/directive*.js",
			"site/components/**/service*.js",
			"site/components/**/factory*.js",
			"site/components/**/widget*.js",
			"site/loading.js",
			"site/main.js",
			"spec/app/**/*.js"
		]
	},
	"connect": {
		"server": {
			"options": {
				"port": 3082,
				"base": "app/assets/",
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
		"docsUI": {
			"path": "http://127.0.0.1:5001/"
		},
		"docsServer": {
			"path": "http://127.0.0.1:5002/"
		},
		"karma": {
			"path": "http://127.0.0.1:5060/"
		}
	},
	"watch": {
//		"options": {
//			"livereload": {
//				"host": "localhost",
//				"port": 3083
//			},
//			"livereloadOnError": false
//		},
		"build": {
			"files": ["site/*/**/*.js", "site/*/**/*.html", "site/**/*.css"],
			"tasks": ["prep"]
		},
		"beta": {
			"options": {
				"livereload": {
					"host": "0.0.0.0",
					"port": 3083
				},
				"livereloadOnError": false
			},
			"files": [
				"Gruntfile.js",
				"site-beta/*/**/*.html",
				"site-beta/*/**/*.less",
				"site-beta/*/**/*.css",
				"site-beta/app/**/*.js",
				"site-beta/applications/*/**/*.js",
				"site-beta/assembly/**/*.js",
				"site-beta/common/**/*.js",
				"site-beta/components/**/*.js",
				"site-beta/subcomponents/**/*.js",
				"site-beta/index.html",
				"styles/**/*.css",
				"spec/**/*.js"
			],
			"tasks": buildBeta
		},
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
				"site/*/**/*.html",
				"site/*/**/*.less",
				"site/*/**/*.css",
				"site/*/**/*.js",
				"site/index.html",
				"site/loading.js",
				"site/main.js",
				"styles/**/*.css",
				"spec/**/*.js"
			],
			"tasks": ["build-app"]
		},
		"docs-beta": {
			"files": [
				"Gruntfile.js",
				"site-beta/*/**/*.less",
				"site-beta/*/**/*.css",
				"site-beta/*/**/*.js",
				"site-beta/index.html",
				"site-beta/loading.js",
				"site-beta/main.js",
				"styles/**/*.css",
				"spec/**/*.js"
			],
			"tasks": ["yuidoc:beta"]
		},
		"docs": {
			"files": [
				"Gruntfile.js",
				"site/*/**/*.less",
				"site/*/**/*.css",
				"site/*/**/*.js",
				"site/index.html",
				"site/loading.js",
				"site/main.js",
				"styles/**/*.css",
				"spec/**/*.js"
			],
			"tasks": ["yuidoc:app"]
		}
	},
	"concat": {
		"scripts": {
			"src": ["site/components/**/control*.js",
				"site/components/**/main*.js",
				"site/components/**/scripts*.js",
				"site/components/**/startup*.js",
				"site/components/**/module*.js",
				"site/components/**/widget*.js",
				"site/components/**/directive*.js",
				"site/components/**/service*.js",
				"site/components/**/factory*.js"],
			"dest": "site/scripts.js"
		},
		"dep": {
			"src": ["site/scripts/*.js",
				"site/scripts/highcharts/highcharts.js",
				"site/scripts/cytoscape/cytoscape.min.js",
				"site/scripts/cytoscape/cola.js"
			],
			"dest": "site/dep.js"
		},
		"core": {
			"src": ["site/scripts/systems/*.js", "site/scripts/core/*.js"],
			"dest": "site/main.js"
		},
		"css": {
			"src": ["site/components/**/*.css", "site/styles/**/*.css"],
			"dest": "site/styles.css"
		},
		"cytoscape": {
			"options": {
				"process": function (src, file) {
					return src.replace(/sourceMappingURL=[a-zA-Z0-9\.-_]+/, "");
				}
			},
			"src": [
				"node_modules/cytoscape/dist/cytoscape.js",
				"node_modules/cytoscape-cola/cola.js",
				"node_modules/cytoscape-cola/cytoscape-cola.js",
			],
			"dest": "build/cytoscape.js"
		},
		"betaLess": {
			"src": [
				"site-beta/styles/*.less",
				"site-beta/components/**/*.less",
				"site-beta/app/**/*.less",
				"site-beta/assembly/**/*.less",
				"site-beta/subcomponents/**/*.less"
			],
			"dest": "site-beta/app.less"
		},
		"betaCSS": {
			"src": [
				"site-beta/components/**/*.css",
				"build/less.css"
			],
			"dest": "site-beta/app.css"
		},
		"betaApp": {
			"options": {
				"sourceMap": true,
				"footer": footer,
			},
			"src": [
				"node_modules/hammerjs/hammer.js",
				"node_modules/showdown/dist/showdown.min.js",
				"node_modules/vue/dist/vue.js",
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/vue2-touch-events/index.js",
				"node_modules/vue-router/dist/vue-router.js",
				"node_modules/vue-resource/dist/vue-resource.js",

				"build/templates.js",
				"build/cytoscape.js",
				"site-beta/app/prefix.js",
				"site-beta/common/*.js",
				"site-beta/common/*/*.js",
				"site-beta/common/*/*/**/*.js",
				"site-beta/components/*.js",
				"site-beta/components/*/*.js",
				"site-beta/components/*/*/**/*.js",
				"site-beta/subcomponents/*.js",
				"site-beta/subcomponents/*/*.js",
				"site-beta/subcomponents/*/*/**/*.js",
				"site-beta/app/main.js",
				"site-beta/app/lib/*.js",
				"site-beta/app/lib/*/*.js",
				"site-beta/app/lib/*/*/**/*.js",
				"site-beta/app/end.js"
			],
			"dest": "site-beta/app.js"
		},
		"betaAssembly": {
			"options": {
				"sourceMap": true
			},
			"src": [
				"site-beta/assembly/main.js",
				"site-beta/assembly/lib/**/*.js",
				"site-beta/assembly/end.js"
			],
			"dest": "site-beta/loading.js"
		},
		"appV2prep": {
			"options": {
				"sourceMap": false,
				"footer": footer,
			},
			"src": [
				"build/templates.js",
				"build/cytoscape.js",
				"site-beta/app/prefix.js",
				"site-beta/common/*.js",
				"site-beta/common/*/*.js",
				"site-beta/common/*/*/**/*.js",
				"site-beta/components/*.js",
				"site-beta/components/*/*.js",
				"site-beta/components/*/*/**/*.js",
				"site-beta/subcomponents/*.js",
				"site-beta/subcomponents/*/*.js",
				"site-beta/subcomponents/*/*/**/*.js",
				"site-beta/app/main.js",
				"site-beta/app/lib/*.js",
				"site-beta/app/lib/*/*.js",
				"site-beta/app/lib/*/*/**/*.js",
				"site-beta/app/end.js"
			],
			"dest": "site-beta/app.min.js"
		},
		"appV2": {
			"options": {
				"sourceMap": false
			},
			"src": [
				"node_modules/showdown/dist/showdown.min.js",
				"node_modules/hammerjs/hammer.js",
				"node_modules/vue/dist/vue.min.js",
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/vue2-touch-events/index.js",
				"node_modules/vue-router/dist/vue-router.min.js",
				"node_modules/vue-resource/dist/vue-resource.min.js",
				"site-beta/app.min.js"
			],
			"dest": "site-beta/app.js"
		},
		"appCSS": {
			"src": [
				"site/components/**/*.css",
				"build/less.css"
			],
			"dest": "site/app.css"
		},
		"appJS": {
			"options": {
				"sourceMap": true,
				"footer": footer,
			},
			"src": [
				"node_modules/hammerjs/hammer.js",
				"node_modules/vue/dist/vue.js",
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/vue2-touch-events/index.js",

				"build/templates.js",
				"build/cytoscape.js",
				"site/main.js",
				"site/components/**/*.js"
			],
			"dest": "site/app.js"
		}
	},
	"less": {
		"build": {
			"files": {
				"site/less.css": [
					"site/styles/*.less",
					"site/components/**/*.less"
				]
			}
		},
		"_beta": {
			"files": {
				"build/less.css": [
					"site-beta/styles/*.less",
					"site-beta/components/**/*.less",
					"site-beta/app/**/*.less",
					"site-beta/assembly/**/*.less",
					"site-beta/subcomponents/**/*.less"
				]
			}
		},
		"beta": {
			"files": {
				"build/less.css": [
					"site-beta/app.less"
				]
			}
		},
		"app": {
			"files": {
				"build/less.css": [
					"site/styles/*.less",
					"site/components/**/*.less"
				]
			}
		}
	},
	"ngAnnotate": {
		"options": {
			"singleQuotes": false,
		},
		"app": {
			"files": {
				"site/scripts.preped.js": ["site/scripts.js"],
				"site/main.preped.js": ["site/main.js"]
			}
		},
	},
	"clean": {
		"prepared": ["site/scripts.js", "site/main.js", "site/dep.js"],
		"complete": ["site/scripts.min.js", "site/main.min.js", "site/dep.min.js", "site/scripts.preped.js", "site/main.preped.js", "site/dep.preped.js"]
	},
	"copy": {
		"dep": {
			"expand": false,
			"src": "site/dep.min.js",
			"dest": "site/dep.js"
		},
		"main": {
			"expand": false,
			"src": "site/main.min.js",
			"dest": "site/main.js"
		},
		"script": {
			"expand": false,
			"src": "site/scripts.min.js",
			"dest": "site/scripts.js"
		}
	},
	"karma": {
		"options": {
			"frameworks": ["jasmine"],
			"junitReporter": {
				"outputDir": "./reports/", // results will be saved as $outputDir/$browserName.xml
				"outputFile": undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
				"suite": "", // suite will become the package name attribute in xml testsuite element
				"useBrowserName": true, // add browser name to report and classes names
				"nameFormatter": undefined, // function (browser, result) to customize the name attribute in xml testcase element
				"classNameFormatter": undefined, // function (browser, result) to customize the classname attribute in xml testcase element
				"properties": {}
				// key value pair of properties to add to the <properties> section of the report
			},
			"htmlReporter": {
				"outputFile": "reports/general.html"
			},
			"htmlLiveReporter": {
				"colorScheme": "jasmine", // light 'jasmine' or dark 'earthborn' scheme
				"defaultTab": "summary", // 'summary' or 'failures': a tab to start with
				// only show one suite and fail log at a time, with keyboard navigation
				"focusMode": true,
			},
			"specReporter": {
				"maxLogLines": 1, // limit number of lines logged per test
				"suppressErrorSummary": true, // do not print error summary
				"suppressFailed": false, // do not print information about failed tests
				"suppressPassed": false, // do not print information about passed tests
				"suppressSkipped": true, // do not print information about skipped tests
				"showSpecTiming": false // print the time elapsed for each spec
			},
			"files": [
				"spec/support/**/*.js",
				"node_modules/showdown/dist/showdown.min.js",
				"node_modules/vue/dist/vue.js",
				"node_modules/jquery/dist/jquery.js",
				"node_modules/vue-router/dist/vue-router.js",
				"node_modules/vue2-touch-events/index.js",
				"node_modules/cytoscape/dist/cytoscape.js",
				"node_modules/cytoscape-cola/cola.js",
				"node_modules/cytoscape-cola/cytoscape-cola.js",
				"build/templates.js",
				
				"site-beta/assembly/main.js",
				"site-beta/assembly/lib/**/*.js",
				"site-beta/assembly/end.js",

				"site-beta/app/prefix.js",
				"site-beta/common/*.js",
				"site-beta/common/*/*.js",
				"site-beta/common/*/*/**/*.js",
				"site-beta/components/*.js",
				"site-beta/components/*/*.js",
				"site-beta/components/*/*/**/*.js",
				"site-beta/subcomponents/*.js",
				"site-beta/subcomponents/*/*.js",
				"site-beta/subcomponents/*/*/**/*.js",
				"site-beta/app/main.js",
				"site-beta/app/lib/*.js",
				"site-beta/app/lib/*/*.js",
				"site-beta/app/lib/*/*/**/*.js",
				"site-beta/app/end.js",
				
				"spec/beta/**/*-spec.js"
			]
			/*logLevel: "debug",*/
		},
		"beta": {
			"singleRun": false,
			"reporters": ["live-html"],
			"browsers": [/*Pending PhantomJS V2.5: "PhantomJS", */"Firefox", "Chrome"]
		},
		"dev": {
			"singleRun": false,
			"reporters": ["live-html"],
			"browsers": [/*Pending PhantomJS V2.5: "PhantomJS", */"Firefox", "Chrome"]
		},
		"jenkins": {
			"singleRun": true,
			"browsers": [/*Pending PhantomJS V2.5: "PhantomJS"*/],
			"reporters": ["spec"]
		}
	},
	"exec": {
		"docs": {
			"cmd": function () {
				return "yuidoc --server 5030 ./site/scripts/core/ ./site/scripts/systems/ ./site/components/";
			}
		}
	},
	"templify": {
		"options": {
			"autoAffix": true,
		},
		"beta": {
			"templates": [{
					"path": "site-beta/**/*.html",
					"rewrite": function (name) {
						return name.replace(/^.*site-beta[\/\\]components[\/\\]/, "").replace(/^.*site-beta[\/\\]/, "").replace(/_/g, "/");
					}
				}
			],
			"suffixes": [".html"],
			"mode": "vue",
			"output": "./build/templates.js"
		},
		"app": {
			"templates": [{
					"path": "site/**/*.html",
					"rewrite": function (name) {
						return name.replace(/^.*site[\/\\]components[\/\\]/, "page/").replace(/^.*site[\/\\]/, "page/").replace(/_/g, "/");
					}
				}
			],
			"suffixes": [".html"],
			"mode": "vue",
			"output": "./build/templates.js"
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
					"./site/scripts/core/",
					"./site/scripts/systems/",
					"./site/components/"
				]
			}
		},
		"beta": {
			"name": "<%= pkg.name %>",
			"description": "<%= pkg.description %>",
			"version": "<%= pkg.version %>",
			"url": "<%= pkg.homepage %>",
			"options": {
				"outdir": "./docs-beta",
				"paths": [
					"./site-beta/app/",
					"./site-beta/assembly/",
					"./site-beta/common/",
					"./site-beta/subcomponents/",
					"./site-beta/components/"
				]
			}
		},
		"app": {
			"name": "<%= pkg.name %>",
			"description": "<%= pkg.description %>",
			"version": "<%= pkg.version %>",
			"url": "<%= pkg.homepage %>",
			"options": {
				"outdir": "./docs",
				"paths": [
					"./site/components/"
				]
			}
		}
	},
	"concurrent": {
		"development": {
			"tasks": [
				["open:docs", "exec:docs"],
				["open:karma", "karma:dev"],
				["eslint", "concat", "ngAnnotate", "connect", "open:dev", "watch"],
			],
			"options": {
				"logConcurrentOutput": true
			}
		},
		"beta": {
			"tasks": [
				["document-beta"],
				["testing-beta"],
				["general-beta"]
			],
			"options": {
				"logConcurrentOutput": true
			}
		},
		"app": {
			"tasks": [
				["document"],
				["testing"],
				["general"]
			],
			"options": {
				"logConcurrentOutput": true
			}
		}
	}
};

// This is due to a bug in overridability of Karma file listing (See: https://github.com/karma-runner/grunt-karma/issues/21). Possibly fixed by updates but solved for this case
//if(process.argv.indexOf("beta") === -1 && process.argv.indexOf("testing-beta") === -1 && process.argv.indexOf("app") === -1) {
//	config.karma.options.files = [
//		"node_modules/angular/angular.js",
//		"node_modules/angular-mocks/angular-mocks.js",
//		"node_modules/angular-sanitize/angular-sanitize.js",
//		"node_modules/ng-dialog/js/ngDialog.js",
//		"node_modules/angular-utils-pagination/dirPagination.js",
//		"node_modules/jquery/dist/jquery.js",
//		"client/scripts/core.js",
//		"client/scripts/*/*.js",
//		"suites/helpers/**/*.js",
//		"suites/client/**/*.js"
//	];
//} else {
//	config.karma.options.files = [
//		"node_modules/vue/dist/vue.min.js",
//		"node_modules/jquery/dist/jquery.min.js",
//		"node_modules/vue2-touch-events/index.js",
//		"node_modules/cytoscape/dist/cytoscape.js",
//		"node_modules/cytoscape-cola/cola.js",
//		"node_modules/cytoscape-cola/cytoscape-cola.js",
//		"site-beta/loading.js",
//		"site-beta/main.js",
//		"site-beta/components/**/*.js",
//		"spec/support/**/*-spec.js",
//		"spec/beta/**/*-spec.js"
//	];
//}

applications = fs.readdirSync("site-beta/applications/");
buildBeta.push.apply(buildBeta, ["eslint:beta", "templify:beta", "concat:cytoscape", "concat:betaLess", "less:beta", "concat:betaCSS", "concat:betaApp", "concat:betaAssembly"]);
buildApp.push.apply(buildApp, ["eslint:beta", "templify:beta", /*"karma:jenkins", */"concat:cytoscape", "concat:betaLess", "less:beta", "concat:betaCSS", "concat:appV2prep", "concat:betaAssembly"]);

applications.forEach(function(app) {
	if(app.indexOf(".js") === -1) {
		config.concat[app] = {
			"options": {
				"sourceMap": false,
				"footer": footer,
			},
			"src": [
				"site-beta/applications/" + app + "/*/*/**/*.js",
				"site-beta/applications/" + app + "/*/*.js",
				"site-beta/applications/" + app + "/*.js"
			],
			"dest": "site-beta/applications/" + app + ".js"
		};
		buildBeta.push("concat:" + app);
		buildApp.push("concat:" + app);
	}
});

//buildApp.push("uglify:appV2");
buildApp.push("concat:appV2");

module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-jasmine-nodejs");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-ng-annotate");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("gruntify-eslint");
	grunt.loadNpmTasks("grunt-karma");

	var buffer = Object.assign({}, config);
	console.log("Config:", buildBeta);
	grunt.initConfig(buffer);
	grunt.registerTask("uglify:appV2", function() {
		var app = fs.readFileSync("site-beta/app.min.js");
		app = UglifyJS.minify(app);
		require("util").log(app);
		if(app.error) {
			require("util").log(app.error.stack);
			throw app.error;
		}
		fs.writeFileSync("site-beta/app.min.js", app.code);
	});
	
	grunt.registerTask("beta", ["concurrent:beta"]);
	grunt.registerTask("app", ["concurrent:app"]);

	grunt.registerTask("document-beta", ["yuidoc:beta", "watch:docs-beta"]);
	grunt.registerTask("testing-beta", ["templify:beta", "open:karma", "karma:beta"]);
	grunt.registerTask("general-beta", ["build-beta", "connect:beta", "open:app", "watch:beta"]);
	grunt.registerTask("build-beta", buildBeta);
	grunt.registerTask("deploy-beta", buildBeta);
	// No go until PhantomJS supports ES6, which will be V2.5; https://github.com/ariya/phantomjs/issues/14506
	// grunt.registerTask("deploy-beta", ["eslint:beta", "karma:jenkins", "templify:beta", "concat:cytoscape", "concat:betaLess", "less:beta", "concat:betaCSS", "concat:betaApp", "concat:betaAssembly"]);
	grunt.registerTask("build-appV2", buildApp);
	grunt.registerTask("deploy-appV2", buildApp);
	
	grunt.registerTask("document", ["yuidoc:app", "watch:docs-app"]);
	grunt.registerTask("testing", ["templify:app", "open:karma", "karma:app"]);
	grunt.registerTask("general", ["build-app", "connect:app", "open:app", "watch:app"]);
	grunt.registerTask("build-app", ["eslint:app", "templify:app", "concat:cytoscape", "less:app", "concat:appCSS", "concat:appJS"]);
	
	grunt.registerTask("spec:unit", ["karma:jenkins"]);
	grunt.registerTask("spec", ["eslint", "spec:unit", "yuidoc:compile"]);
	grunt.registerTask("lint", ["eslint"]);
	grunt.registerTask("docs", ["yuidoc:compile"]);
	grunt.registerTask("prep", ["eslint", "concat", "ngAnnotate"]);
	grunt.registerTask("mini", ["concat", "ngAnnotate", "uglify", "clean:prepared", "copy:dep", "copy:main", "copy:script", "clean:complete"]);
	grunt.registerTask("deploy", ["lint", "spec:jenkins", "mini", "docs"]);
	grunt.registerTask("default", ["concurrent:development"]);
};
