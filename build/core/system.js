
/**
 * 
 * @class rsSystem
 * @constructor
 * @module Core
 * @static
 */
rsSystem.components = {};

/**
 * 
 * @property loading
 * @type Object
 */
rsSystem.loading = {};
rsSystem.loading.process = [];
rsSystem.loading.components = {};
rsSystem.loading.cLookup = [];
rsSystem.loading.cAlign = [];
rsSystem.loading.cScan = [];
rsSystem.loading.destroyed = [];
rsSystem.loading._tracking = 200;

/**
 * 
 * @method register
 * @param {VueComponent} component
 */
rsSystem.register = function(component) {
//	rsSystem.log.debug("Registering Component: ", component);
	var element = component.$el,
		scan = $(component.$el);
	rsSystem.loading.components[component.$options._componentTag] = rsSystem.loading.components[component.$options._componentTag] || [];
	rsSystem.loading.components[component.$options._componentTag].push(component);
	rsSystem.loading.cLookup.push(element);
	rsSystem.loading.cAlign.push(component);
	rsSystem.loading.cScan.push(scan);
	component.$once("hook:beforeDestroy", function() {
		rsSystem.loading.destroyed.unshift(component);
		rsSystem.loading.components[component.$options._componentTag].purge(component);
		rsSystem.loading.cLookup.purge(element);
		rsSystem.loading.cAlign.purge(component);
		rsSystem.loading.cScan.purge(scan);

		if(rsSystem.loading.destroyed.length > rsSystem.loading._tracking) {
			rsSystem.loading.destroyed.splice(rsSystem.loading._tracking);
		}
	});
};

/**
 * For debugging purposes only.
 * 
 * Returns the "this" for the corresponding element.
 * @method lookup
 * @param {DomElement} element
 * @return {VueComponent}
 */
rsSystem.lookup = function(element) {
	element = element || $0;
	var index, scan;
	
	if(!element) {
		throw new Error("No element selected");
	}
	
	// Surface Level Scan
	index = rsSystem.loading.cLookup.indexOf(element);
	if(index !== -1) {
		return rsSystem.loading.cAlign[index];
	}
	
	// Scan Parents
	while(element = element.parentElement) {
		index = rsSystem.loading.cLookup.indexOf(element);
		if(index !== -1) {
			return rsSystem.loading.cAlign[index];
		}
	}
	
	throw new Error("VueComponent not found.");
};

rsSystem.settings = {};
rsSystem.settings.logging = {};
rsSystem.settings.logging.default = false;
rsSystem.settings.logging.trace = false;
rsSystem.settings.logging.debug = false;
rsSystem.settings.logging.info = false;
rsSystem.settings.logging.warn = false;
rsSystem.settings.logging.error = true;
rsSystem.settings.logging.fatal = true;

rsSystem.console = {};
rsSystem.console.log = function(...args) {
	if(rsSystem.settings.logging.default) {
		console.log.apply(console.log, args);
	}
};

rsSystem.log = {};

rsSystem.log.debug = function(...args) {
	if(rsSystem.settings.logging.debug) {
		console.debug.apply(console.debug, args);
	}
};
rsSystem.log.trace = function(...args) {
	if(rsSystem.settings.logging.trace) {
		console.trace.apply(console.trace, args);
	}
};
rsSystem.log.info = function(...args) {
	if(rsSystem.settings.logging.info) {
		console.info.apply(console.info, args);
	}
};
rsSystem.log.warn = function(...args) {
	if(rsSystem.settings.logging.warn) {
		console.warn.apply(console.warn, args);
	}
};
rsSystem.log.error = function(...args) {
	if(rsSystem.settings.logging.error) {
		console.error.apply(console.error, args);
	}
};
rsSystem.log.fatal = function(...args) {
	var x, anchor = $(document).find("#error-anchor");
	for(x=0; x<args.length; x++) {
		args[x] = JSON.stringify(args[x]);
	}
	anchor.append("<p>" + args.join("</p><p>") + "</p>");
	anchor.append("<button onclick='window.location.reload()'>Refresh</button>");
	anchor.append("<button onclick='rsSystem.dismissError()'>Dismiss</button>");
	
	if(rsSystem.settings.reporting && rsSystem.settings.reporting.error) {
		var body, request = new XMLHttpRequest();
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = function() {
			console.log("Ready State: " + this.readyState);
		};
		
		body = {};
		body.reporting = args;
		body = JSON.stringify(body);
		
		request.open("POST", rsSystem.settings.reporting.error, body);
		request.send(body);
	}
	
	console.error.apply(console.error, args);
};

rsSystem.dismissError = function() {
	var anchor = $(document).find("#error-anchor");
	anchor.empty();
};

