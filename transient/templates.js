var Templify = {};
Templify.install = function(Vue, options) {
	options = options || {};
	options.name = options.name || "templified";
	Vue[options.name] = function(name) {
		switch(name) {
			case "components/connect.html": return "";
			case "components/gyroscope.html": return "";
			case "components/info.html": return "";
			case "components/table.html": return "";
			case "pages/about.html": return "<div class=\"rs-page page-about\">\r\n\t<h1>About</h1>\r\n\r\n</div>\r\n";
			case "pages/home.html": return "<div class=\"rs-page page-home\">\r\n\t<h1>Home</h1>\r\n\r\n</div>\r\n";
			case "pages/main.html": return "<div class=\"\">\r\n</div>\r\n";
			case "pages/test.html": return "<div class=\"test\">\r\n\tThis is a test.\r\n</div>\r\n";
			default: return null;
		}
	};
};
Vue.use(Templify);