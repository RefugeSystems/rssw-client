
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
			// TOFIX: This causes missing prop errors due to player coming from computed.
			// This will be resolved by moving this page to a "proper" instance of assembled components rather than it acting like a component
			rsSystem.components.RSMasterControls,
			rsSystem.components.RSCore
		],
		"data": function() {
			var data = {},
				x;

			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"historyLength": 10,
				"search": ""
			});
			if(!data.state.searching) {
				data.state.searching = {};
			}
			
			data.lockMakeNew = false;
			data.active_events = [];
			data.knowledges = [];
			data.sessions = [];
			data.events = [];
			data.skills = [];
			data.items = [];
			
			data.currentSession = null;
			data.trackSession = null;
			data.nextSession = null;
			
			data.rollProperties = rollProperties;
			data.rollReceiveFlag = false;
			data.universeEntities = [];
			data.eventCategory = "";
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
			"createEvent": function(category) {
				Vue.set(this, "eventCategory", "");
				this.generateEvent(category);
			},
			"receiveRoll": function(result) {
				console.log("Receiving Roll: ", result);
				var keys = Object.keys(result),
					x;
				
				Vue.set(this, "rollReceiveFlag", true);
				this.clearRolling(this.rolling);
				for(x=0; x<this.difficulties.length; x++) {
					Vue.set(this.count, this.difficulties[x], 0);
				}
				
				for(x=0; x<keys.length; x++) {
					if(result[keys[x]]) {
						Vue.set(this.rolling, keys[x], result[keys[x]]);
					}
				}
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
				if(!isNaN(expression.difficulty) && !this.rollReceiveFlag) {
					this.clearRolling(this.rolling);
					for(x=0; x<this.difficulties.length; x++) {
						Vue.set(this.count, this.difficulties[x], 0);
					}
				}
				if(this.rollReceiveFlag) {
					Vue.set(this, "rollReceiveFlag", false);
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
			
			"isVisible": function(record, search) {
				if(!search) {
					return true;
				}
				
				if(!record._search) {
					return false;
				}
				
				search = search.toLowerCase();
				return record._search.indexOf(search) !== -1;
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
					if(this.currentSession) {
						Vue.set(this, "trackSession", this.currentSession.id);
					}
				}

				this.sessions.splice(0);
				for(x=0; x<this.universe.indexes.session.listing.length; x++) {
					session = this.universe.indexes.session.listing[x];
					if(session) {
						this.sessions.push(session);
						if(session._coreData.name && session._coreData.name == (buffer = parseInt(session._coreData.name)) && buffer > next) {
							next = buffer;
						}
					}
				}
				this.sessions.sort(sortSessions);
				
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
					if(buffer && (buffer.owner || (buffer.owners && buffer.owners.length) || buffer.screen)) {
						this.universeEntities.push(buffer);
					}
				}
				this.universeEntities.sort(this.sortData);
//				this.universeEntities.sort(sortEntities);

				this.knowledges.splice(0);
				for(x=0; x<this.universe.indexes.knowledge.listing.length; x++) {
					buffer = this.universe.indexes.knowledge.listing[x];
					if(buffer && buffer.screen) {
						this.knowledges.push(buffer);
					}
				}
				this.knowledges.sort(this.sortData);
				
				this.active_events.splice(0);
				this.events.splice(0);
				for(x=0; x<this.universe.indexes.event.listing.length; x++) {
					if(this.universe.indexes.event.listing[x].active) {
						this.active_events.push(this.universe.indexes.event.listing[x]);
					} else if(this.universe.indexes.event.listing[x].screen) {
						this.events.push(this.universe.indexes.event.listing[x]);
					}
				}
				
				Vue.set(this, "nextSession", next + 1);
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("pages/rssw/master.html")
	});
})();
