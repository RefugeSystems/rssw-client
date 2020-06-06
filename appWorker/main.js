/**
 * 
 * @class RSSWXServiceWorker
 * @constructor
 * @see https://github.com/GoogleChromeLabs/airhorn/blob/master/app/sw.js
 */
var version = "0.0.1",
	cacheID = "rsswx_" + version,
	cacheOptions = {
		"ignoreSearch": true
	};

self.addEventListener("install", function(event) {
	var result = caches.open(cacheID)
		.then(function(cache) {
			return cache.addAll([
				"./",
				"./index.html",
				"./main.css",
				"./fonts/starwars-glyphicons.css",
				"./fonts/xwing-miniatures.css",
				"./fonts/rpg-awesome.css",
				"./webfonts/all.css",
				"./fonts/rsswx.css",
				"./external.js",
				"./main.js"
			])
			.then(function() {
				self.skipWaiting();
			})
			.catch(function(error) {
				console.error("Install Fault: ", error);
			});
		});
	
	event.waitUntil(result);
});

self.addEventListener("fetch", function(event) {
	var result = caches.open(cacheID)
		.then(function(cached) {
			return cached.match(event.request, cacheOptions)
		})
		.then(function(response) {
			return response || fetch(event.request);
		})
		.catch(function(error) {
			console.error("Fetch Fault: ", error);
		});
	
	event.respondWith(result);
});
