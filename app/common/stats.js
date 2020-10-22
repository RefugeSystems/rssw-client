/**
 * Mixin for getting the stat listing for the RSSWx system.
 * @class RSSWStats
 * @constructor
 */
rsSystem.component("RSSWStats", {
	"inherit": true,
	"data": function() {
		var data = {},
			buffer,
			keys,
			x;
		
		data.entityStats = {};
		data.entityStats.character = {
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
				"name": "Presence",
				"info": "",
				"class": "rs-red",
				"icon": "fas fa-fist-raised"
			}
		};
		data.entityStats.ship = {
			"attack": {
				"name": "Attack",
				"info": "Similar to strength",
				"class": "rs-red",
				"icon": "fas fa-flame rot315"
			},
			"evasion": {
				"name": "Evasion",
				"info": "Nimbleness of the ship. Allows it to dodge incoming fire.",
				"class": "rs-green",
				"icon": "fad fa-chevron-double-right"
			},
			"hull": {
				"name": "Hull",
				"info": "Similar to strength",
				"class": "rs-yellow",
				"icon": "fas fa-th"
			},
			"shield": {
				"name": "Shield",
				"info": "A ship's ability to absorb incoming damage before its hull begins to take damage",
				"class": "rs-blue",
				"icon": "fal fa-futbol"
			}
		};
		data.entityStats.flight = {
			"manuevers": {
				"name": "Maneuvers",
				"section": "piloting",
				"info": "Control of your ship",
				"icon": "fad fa-random",
				"base": "agility"
			},
			"pilotingplanetary": {
				"name": "Planetary",
				"section": "piloting",
				"info": "",
				"icon": "fas fa-fighter-jet",
				"base": "cunning"
			},
			"sensors": {
				"name": "Sensors",
				"section": "piloting",
				"info": "Reading and controling a ship's sensor array",
				"icon": "fas fa-signal-stream",
				"base": "intellect"
			},
			"tracking": {
				"name": "Tracking",
				"section": "piloting",
				"info": "Follow a target",
				"icon": "ra ra-targeted",
				"base": "willpower"
			},
			"hacking": {
				"name": "Hacking",
				"section": "piloting",
				"info": "Remotely access another ship by force",
				"icon": "fad fa-router",
				"base": "intellect"
			}
		};
		data.entityStats.skill = {
			"astrogation": {
				"name": "Astrogation",
				"section": "general",
				"info": "Course plotting.",
				"icon": "fas fa-route",
				"base": "intellect"
			},
			"computers": {
				"section": "general",
				"info": "",
				"icon": "fas fa-phone-laptop",
				"base": "intellect"
			},
			"mechanics": {
				"section": "general",
				"info": "",
				"icon": "fas fa-wrench",
				"base": "intellect"
			},
			"medicine": {
				"section": "general",
				"info": "",
				"icon": "fas fa-pills",
				"base": "intellect"
			},
			"coreworlds": {
				"name": "Core Worlds",
				"section": "knowledge",
				"info": "",
				"icon": "fas fa-globe",
				"base": "intellect"
			},
			"education": {
				"section": "knowledge",
				"info": "",
				"icon": "fas fa-graduation-cap",
				"base": "intellect"
			},
			"lore": {
				"section": "knowledge",
				"info": "",
				"icon": "fas fa-journal-whills",
				"base": "intellect"
			},
			"outerrim": {
				"name": "Outer Rim",
				"section": "knowledge",
				"info": "",
				"icon": "fal fa-planet-ringed",
				"base": "intellect"
			},
			"underworld": {
				"section": "knowledge",
				"info": "",
				"icon": "fas fa-dungeon",
				"base": "intellect"
			},
			"xenology": {
				"section": "knowledge",
				"info": "",
				"icon": "fas fa-user-alien",
				"base": "intellect"
			},
			"athletics": {
				"name": "Athletics",
				"section": "general",
				"info": "Your innate abilities toward feats of body endurance and control.",
				"icon": "fas fa-running",
				"base": "brawn"
			},
			"resilience": {
				"section": "general",
				"info": "",
				"icon": "fas fa-shield",
				"base": "brawn"
			},
			"brawl": {
				"section": "combat",
				"info": "",
				"icon": "fas fa-fist-raised",
				"base": "brawn"
			},
			"melee": {
				"section": "combat",
				"info": "",
				"icon": "fas fa-running",
				"base": "brawn"
			},
			"charm": {
				"name": "Charm",
				"section": "general",
				"info": "",
				"icon": "fas fa-grin-hearts",
				"base": "pressence"
			},
			"cool": {
				"section": "general",
				"info": "",
				"icon": "fal fa-snowflake",
				"base": "pressence"
			},
			"leadership": {
				"section": "general",
				"info": "",
				"icon": "fas fa-users-crown",
				"base": "pressence"
			},
			"negotiation": {
				"section": "general",
				"info": "",
				"icon": "fas fa-comments-dollar",
				"base": "pressence"
			},
			"coordination": {
				"section": "general",
				"info": "",
				"icon": "fal fa-balance-scale",
				"base": "agility"
			},
			"stealth": {
				"section": "general",
				"info": "",
				"icon": "fas fa-eye-slash",
				"base": "agility"
			},
			"gunnery": {
				"section": "combat",
				"info": "",
				"icon": "fas fa-bow-arrow",
				"base": "agility"
			},
			"rangedweaponlight": {
				"name": "Ranged (Light)",
				"section": "combat",
				"info": "",
				"icon": "fas fa-horizontal-rule",
				"base": "agility"
			},
			"rangedweaponheavy": {
				"name": "Ranged (Heavy)",
				"section": "combat",
				"info": "",
				"icon": "fad fa-barcode-scan",
				"base": "agility"
			},
			"deception": {
				"section": "general",
				"info": "",
				"icon": "fas fa-user-secret",
				"base": "cunning"
			},
			"perception": {
				"section": "general",
				"info": "",
				"icon": "fas fa-eye",
				"base": "cunning"
			},
			"skulduggery": {
				"section": "general",
				"info": "",
				"icon": "fad fa-briefcase",
				"base": "cunning"
			},
			"streetwise": {
				"section": "general",
				"info": "",
				"icon": "fas fa-road",
				"base": "cunning"
			},
			"survival": {
				"section": "general",
				"info": "",
				"icon": "fas fa-campground",
				"base": "cunning"
			},
			"coercion": {
				"section": "general",
				"info": "",
				"icon": "fas fa-comment-slash",
				"base": "willpower"
			},
			"discipline": {
				"section": "general",
				"info": "",
				"icon": "fas fa-alarm-exclamation",
				"base": "willpower"
			},
			"vigilance": {
				"section": "general",
				"info": "",
				"icon": "fas fa-street-view",
				"base": "willpower"
			},
			"planetary": {
				"name": "Planetary Knowledge",
				"section": "knowledge",
				"info": "General knowledge of planets. Can not be leveled manually.",
				"controlled": true,
				"icon": "fad fa-planet-ringed",
				"base": "intellect"
			}
		};
		
		Object.assign(data.entityStats.skill, data.entityStats.flight);
		Object.assign(data.entityStats, data.entityStats.character);
		Object.assign(data.entityStats, data.entityStats.skill);
		Object.assign(data.entityStats, data.entityStats.ship);
		
		keys = Object.keys(data.entityStats);
		for(x=0; x<keys.length; x++) {
			if(keys[x] !== "character" && keys[x] !== "ship" && keys[x] !== "skill") {
				if(!data.entityStats[keys[x]].name) {
					data.entityStats[keys[x]].name = keys[x].capitalize();
				}
				data.entityStats[keys[x]].propertyKey = "skill_" + keys[x];
				data.entityStats[keys[x]].enhancementKey = "skill_enhanced_" + keys[x];
				data.entityStats[keys[x]].bonusKey = "skill_bonuses_" + keys[x];
				data.entityStats[keys[x]].id = keys[x];
			}
		}

		data.characterStats = ["brawn", "agility", "intellect", "cunning", "willpower", "pressence"];
		data.characterStatsListing = [];
		for(x=0; x<data.characterStats.length; x++) {
			data.characterStatsListing.push(data.entityStats[data.characterStats[x]]);
		}
		
		data.shipStats = ["attack", "evasion", "hull", "shield"];
		data.skillStats = Object.keys(data.entityStats.skill).sort();
		data.skillStatsListing = [];
		data.listAllStats = data.characterStats.concat(data.shipStats).concat(data.skillStats);
		data.skillStatsSections = {};
		for(x=0; x<data.skillStats.length; x++) {
			buffer = data.entityStats[data.skillStats[x]];
			if(buffer) {
				if(buffer.section && !data.skillStatsSections[buffer.section]) {
					data.skillStatsSections[buffer.section] = [];
				}
				data.skillStatsSections[buffer.section].push(data.entityStats[data.skillStats[x]]);
				data.skillStatsListing.push(buffer);
			} else {
				console.error("Unaligned Skill/Stat Key: " + data.skillStats[x]);
			}
		}
		data.skillStatsSectionsListing = Object.keys(data.skillStatsSections);
		data.shipStatList = [];
		for(x=0;x<data.shipStats.length;x++) {
			data.shipStatList.push(data.entityStats[data.shipStats[x]]);
		}

		keys = Object.keys(data.entityStats);
		for(x=0; x<keys.length; x++) {
			data.entityStats[keys[x]]._search = data.entityStats[keys[x]]._search || "";
			if(data.entityStats[keys[x]].id) {
				data.entityStats[keys[x]]._search += data.entityStats[keys[x]].id.toLowerCase();
			}
			if(data.entityStats[keys[x]].name) {
				data.entityStats[keys[x]]._search += data.entityStats[keys[x]].name.toLowerCase();
			}
			if(data.entityStats[keys[x]].info) {
				data.entityStats[keys[x]]._search += data.entityStats[keys[x]].info.toLowerCase();
			}
			if(data.entityStats[keys[x]].base) {
				data.entityStats[keys[x]]._search += data.entityStats[keys[x]].base.toLowerCase();
			}
		}
		
		return data;
	},
	"methods": {
	}
});