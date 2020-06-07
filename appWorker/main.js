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
//				"/projects/rsswx/app/",
//				"/projects/rsswx/app/index.html",
//				"/projects/rsswx/app/main.css",
//				"/projects/rsswx/app/fonts/starwars-glyphicons.css",
//				"/projects/rsswx/app/fonts/xwing-miniatures.css",
//				"/projects/rsswx/app/fonts/rpg-awesome.css",
//				"/projects/rsswx/app/webfonts/all.css",
//				"/projects/rsswx/app/fonts/rsswx.css",
//				"/projects/rsswx/app/externals.js",
//				"/projects/rsswx/app/main.js"
				"./",
				"./index.html",
				"./main.css",
				"./fonts/starwars-glyphicons.css",
				"./fonts/xwing-miniatures.css",
				"./fonts/rpg-awesome.css",
				"./webfonts/all.css",
				"./fonts/rsswx.css",
				"./externals.js",
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

self.addEventListener("push", function(event) {
	console.log("[Service Worker] Push Received.");
	console.log("[Service Worker] Push had this data: ", event);

	var title = "RSSWx";
	var options = {
		"body": "Notification",
		"icon": "images/rook.green.png",
		"badge": "images/rook.blue.png"
	};

	event.waitUntil(self.registration.showNotification(title, options));
});