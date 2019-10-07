var Templify = {};
Templify.install = function(Vue, options) {
	options = options || {};
	options.name = options.name || "templified";
	Vue[options.name] = function(name) {
		switch(name) {
			case "components/connect.html": return "<div class=\"rs-component connect-component\">\r\n\t<form onsubmit=\"return false;\">\r\n\t\t<div class=\"heading\">\r\n\t\t\t<span class=\"heading-icon\"></span>\r\n\t\t\t<span>Login</span>\r\n\t\t</div>\r\n\t\t<div class=\"fields\">\r\n\t\t\t<label class=\"full\">\r\n\t\t\t\t<span class=\"field-text\">Username</span>\r\n\t\t\t\t<input type=\"text\" v-model=\"store.username\" />\r\n\t\t\t</label>\r\n\t\t\t<label class=\"full\">\r\n\t\t\t\t<span class=\"field-text\">Address</span>\r\n\t\t\t\t<input type=\"text\" v-model=\"store.address\" />\r\n\t\t\t</label>\r\n\t\t\t<div class=\"actions\">\r\n\t\t\t\t<button class=\"primary-action\" v-on:click=\"connect()\">\r\n\t\t\t\t\t<span class=\"action-icon fas fa-sign-in\"></span>\r\n\t\t\t\t\t<span class=\"action-text\">Connect</span>\r\n\t\t\t\t</button>\r\n\t\t\t\t<button class=\"toggle-action\" v-on:click=\"store.secure = !store.secure\">\r\n\t\t\t\t\tSecure?\r\n\t\t\t\t\t<span class=\"far\" :class=\"store.secure?'fa-check-square':'fa-square'\"></span>\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</form>\r\n</div>";
			case "components/gyroscope.html": return "";
			case "components/info.html": return "";
			case "components/nouns.html": return "<div class=\"rs-component component-nouns\">\r\n\t<div class=\"selection\">\r\n\t\t<label class=\"\">\r\n\t\t\tNoun:\r\n\t\t\t<select v-model=\"state.current\">\r\n\t\t\t\t<option v-for=\"type in nouns\" :value=\"type\">{{type}}</option>\r\n\t\t\t</select>\r\n\t\t</label>\r\n\t</div>\r\n\t\r\n\t<div class=\"sourcing\">\r\n\t\t<label class=\"\">\r\n\t\t\tCopy:\r\n\t\t\t<select v-model=\"copy\">\r\n\t\t\t\t<option v-for=\"(object, id) in universe.nouns[state.current]\" :value=\"id\">{{id}}</option>\r\n\t\t\t</select>\r\n\t\t</label>\r\n\t</div>\r\n\t\r\n\t<div class=\"building\">\r\n\t\t<textarea v-model=\"rawValue\">\r\n\t\t</textarea>\r\n\t</div>\r\n\t\r\n\t<div class=\"actions\">\r\n\t\t<button class=\"primary-action\" v-on:click=\"modify()\" :disabled=\"!isValid\">\r\n\t\t\t<span class=\"action-icon fas fa-cloud-upload\"></span>\r\n\t\t\t<span class=\"action-text\">Upload</span>\r\n\t\t</button>\r\n\t</div>\r\n</div>";
			case "components/table.html": return "";
			case "pages/about.html": return "<div class=\"rs-page page-about\">\r\n\t<h1>About</h1>\r\n\r\n</div>\r\n";
			case "pages/home.html": return "<div class=\"rs-page page-home\">\r\n\t<div class=\"login prompt\" v-if=\"state === 0\">\r\n\t\t<div class=\"boxed\">\r\n\t\t\t<div class=\"message\" v-if=\"message\">{{message}}</div>\r\n\t\t\t<rs-connect v-on:connect=\"connect\"></rs-connect>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"login waiting\" v-if=\"0 < state && state < 10\">\r\n\t\t<div class=\"titling\">\r\n\t\t\t<span v-if=\"state === 1\">Connecting</span>\r\n\t\t\t<span v-if=\"state === 2\">Loading</span>\r\n\t\t</div>\r\n\t\t<div class=\"status\">\r\n\t\t\t<span class=\"far fa-spinner fa-pulse\"></span>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"active\" v-if=\"state === 10\">\r\n\t\t<router-view :universe=\"universe\" :player=\"player\"></router-view>\r\n\t</div>\r\n</div>\r\n";
			case "pages/main.html": return "<div class=\"\">\r\n</div>\r\n";
			case "pages/noun/controls.html": return "<div class=\"rs-page page-noun_controls\">\r\n\t<h1>Nouns</h1>\r\n\t<rs-nouns :universe=\"universe\" :player=\"player\"></rs-nouns>\r\n</div>\r\n";
			case "pages/test.html": return "<div class=\"test\">\r\n\tThis is a test.\r\n</div>\r\n";
			default: return null;
		}
	};
};
Vue.use(Templify);