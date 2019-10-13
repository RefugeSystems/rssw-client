rsSystem.component("RSSWStats", {
	"inherit": true,
	"data": function() {
		var data = {};
		
		data.entityStats = {
			// Character
			"brawn": {
				"name": "Brawn",
				"info": "Similar to strength",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			"agility": {
				"name": "Agility",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			"intellect": {
				"name": "Intellect",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			"cunning": {
				"name": "Cunning",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			"willpower": {
				"name": "Willpower",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			"pressence": {
				"name": "Pressence",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			},
			
			// Ships
			"attack": {
				"name": "Attack",
				"info": "Similar to strength",
				"class": "rs-red",
				"icon": "fas fa-flame rot135"
			},
			"maneuverability": {
				"name": "Maneuverability",
				"info": "Similar to strength",
				"class": "rs-green",
				"icon": "fad fa-long-arrow-alt-right"
			},
			"hull": {
				"name": "Hull",
				"info": "Similar to strength",
				"class": "rs-yellow",
				"icon": "fas fa-th"
			},
			"shield": {
				"name": "Shield",
				"info": "Similar to strength",
				"class": "rs-blue",
				"icon": "fal fa-futbol rot45"
			}
		};

		data.characterStats = ["brawn", "agility", "intellect", "cunning", "willpower", "pressence"];
		data.shipStats = ["attack", "maneuverability", "hull", "shield"];
		
		return data;
	},
	"methods": {
	}
});