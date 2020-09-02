
/**
 * 
 * 
 * @class RSSWMasterPage
 * @constructor
 * @module Pages
 */
(function() {
	var storageKey = "_rssw_masterscreenComponentKey";

	var rollProperties = [{
		"icon": "ra ra-bomb-explosion",
		"property": "success",
		"label": "Success"
	}, {
		"icon": "fad fa-jedi",
		"property": "advantage",
		"label": "Advantage"
	}, {
		"icon": "xwm xwing-miniatures-font-epic",
		"property": "triumph",
		"label": "Triumph"
	}, {
		"icon": "fal fa-triangle rot180",
		"property": "failure",
		"label": "Failure"
	}, {
		"icon": "rsswx rsswx-threat",
		"property": "threat",
		"label": "Threat"
	}, {
		"icon": "rsswx rsswx-despair",
		"property": "despair",
		"label": "Despair"
	}, {
		"icon": "fad fa-circle rs-white rs-secondary-black",
		"property": "light",
		"label": "Light"
	}, {
		"icon": "fad fa-circle rs-black rs-secondary-white",
		"property": "dark",
		"label": "Dark"
	}];
	
	var sortEntities = function(a, b) {
		if(a.classification < b.classification) {
			return -1;
		} else if(a.classification > b.classification) {
			return 1;
		} else if(a.name < b.name) {
			return -1;
		} else if(a.name > b.name) {
			return 1;
		} else {
			return 0;
		}
	};
	
	var sortSessions = function(a, b) {
		if(a.id < b.id) {
			return 1;
		} else if(a.id > b.id) {
			return -1;
		} else {
			return 0;
		}
	};

	rsSystem.component("RSSWMasterPage", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"data": function() {
			var data = {},
				entities,
				entity,
				x;

			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"historyLength": 10,
				"search": ""
			});
			
			data.lockMakeNew = false;
			data.knowledges = [];
			data.sessions = [];
			data.skills = [];
			data.items = [];
			
			data.currentSession = null;
			data.nextSession = null;
			data.trackSession = null;
			
			data.rollProperties = rollProperties;
			data.universeEntities = [];
			data.maxLength = 20;
			data.history = [];
			data.rolling = {};
			data.updated = "";
			
			data.difficulty = {};
			data.difficulty.Blank = {"difficulty":0};
			data.difficulty.Easy = {"difficulty":1};
			data.difficulty.Average = {"difficulty":2};
			data.difficulty.Hard = {"difficulty":3};
			data.difficulty.Daunting = {"difficulty":4};
			data.difficulty.Formidable = {"difficulty":5};
			data.difficulty.Challenge = {"challenge":1};
			data.difficulty.Setback = {"setback":1};
			
			data.difficulties = Object.keys(data.difficulty);
			data.count = {};
			for(x=0; x<data.difficulties.length; x++) {
				data.count[data.difficulties[x]] = 0;
			}
			
			return data;
		},
		"mounted": function() {
			rsSystem.register(this);
			this.universe.$on("universe:modified", this.update);
			this.update();
		},
		"methods": {
			"filteredEntity": function(entity) {
				if(entity.template || entity.inactive) {
					return false;
				}
				
				return !this.state.search ||
					(entity._search && entity._search.indexOf(this.state.search) !== -1) ||
					entity.id.indexOf(this.state.search) !== -1 ||
					entity.name.indexOf(this.state.search) !== -1 ||
					(entity.description && entity.description.indexOf(this.state.search) !== -1);
			},
			"filteredSkill": function(skill) {
				return !this.state.skill_search || (skill._search && skill._search.indexOf(this.state.skill_search.toLowerCase() !== -1));
			},
			"setSession": function(session) {
				if(this.universe.indexes.setting.index["setting:current:session"]) {
					this.universe.indexes.setting.index["setting:current:session"].commit({
						"value": session
					});
				}
			},
			"makeNextSession": function() {
				var session = {
					"_type": "session",
					"name": "" + this.nextSession,
					"id": "" + this.nextSession,
					"date": Date.now()
				};
				while(session.id.length < 5) {
					session.id = "0" + session.id;
				}
				session.id = "session:" + session.id;
				this.universe.send("modify:session", session);
				Vue.set(this, "lockMakeNew", true);
				setTimeout(() => {
					if(this.universe.indexes.setting.index["setting:current:session"]) {
						this.universe.indexes.setting.index["setting:current:session"].commit({
							"value": session.id
						});
					}
					Vue.set(this, "lockMakeNew", false);
				}, 1000);
			},
			"clearRolling": function(object) {
				var keys = Object.keys(object),
					x;
				
				this.history.unshift(JSON.parse(JSON.stringify(object)));
				if(this.state.historyLength < this.history.length) {
					this.history.splice(this.state.historyLength);
				}
				for(x=0; x<keys.length; x++) {
					Vue.delete(object, keys[x]);
				}
			},
			"dismissRolled": function(object) {
				var index = this.history.indexOf(object);
				if(index !== -1) {
					this.history.splice(index, 1);
				}
			},
			"clearRolls": function(step) {
				if(step) {
					this.clearRolling();
				}
				this.history.splice(0);
			},
			"clearRolls": function() {
				this.history.splice(0);
			},
			"rollDifficulty": function(difficulty) {
				var expression = this.difficulty[difficulty],
					result,
					keys,
					x;
				
//				console.log("Roll[" + isNaN(expression.difficulty) + "]: ", expression.difficulty);
				if(!isNaN(expression.difficulty)) {
					this.clearRolling(this.rolling);
					for(x=0; x<this.difficulties.length; x++) {
						Vue.set(this.count, this.difficulties[x], 0);
					}
				}
				Vue.set(this.count, difficulty, this.count[difficulty] + 1);
				result = Dice.calculateDiceRoll(expression);
				keys = Object.keys(result);
				for(x=0; x<keys.length; x++) {
					if(result[keys[x]]) {
						if(this.rolling[keys[x]]) {
							Vue.set(this.rolling, keys[x], this.rolling[keys[x]] + result[keys[x]]);
						} else {
							Vue.set(this.rolling, keys[x], result[keys[x]]);
						}
					}
				}
			},
			/**
			 * 
			 * @method update
			 */
			"update": function() {
				var next = 0,
					session,
					buffer,
					x;
				
				if(this.universe.indexes.setting.index["setting:current:session"]) {
					Vue.set(this, "currentSession", this.universe.indexes.session.index[this.universe.indexes.setting.index["setting:current:session"].value]);
					Vue.set(this, "trackSession", this.currentSession.id);
				}
				
				for(x=0; x<this.universe.indexes.session.listing.length; x++) {
					session = this.universe.indexes.session.listing[x];
					if(session && session._coreData.name && session._coreData.name == (buffer = parseInt(session._coreData.name))) {
						if(buffer > next) {
							next = buffer;
						}
					}
				}
				
				this.skills.splice(0);
				for(x=0; x<this.universe.indexes.skill.listing.length; x++) {
					buffer = this.universe.indexes.skill.listing[x];
					if(buffer && !buffer.hidden && !buffer.obscured) {
						this.skills.push(buffer);
					}
				}
				this.skills.sort(this.sortData);
				
				this.items.splice(0);
				for(x=0; x<this.universe.indexes.item.listing.length; x++) {
					buffer = this.universe.indexes.item.listing[x];
					if(buffer && (buffer.template || buffer.screen)) {
						this.items.push(buffer);
					}
				}
				this.items.sort(this.sortData);

				this.universeEntities.splice(0);
				for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
					buffer = this.universe.indexes.entity.listing[x];
					if(buffer && !buffer.template) {
						this.universeEntities.push(buffer);
					}
				}
				this.universeEntities.sort(this.sortData);
//				this.universeEntities.sort(sortEntities);

				this.sessions.splice(0);
				for(x=0; x<this.universe.indexes.session.listing.length; x++) {
					buffer = this.universe.indexes.session.listing[x];
					if(buffer) {
						this.sessions.push(buffer);
					}
				}
				this.sessions.sort(sortSessions);

				this.knowledges.splice(0);
				for(x=0; x<this.universe.indexes.knowledge.listing.length; x++) {
					buffer = this.universe.indexes.knowledge.listing[x];
					if(buffer && buffer.screen) {
						this.knowledges.push(buffer);
					}
				}
				this.knowledges.sort(this.sortData);
				
				Vue.set(this, "nextSession", next + 1);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("pages/rssw/master.html")
	});
})();
