
/**
 * 
 * 
 * @class RSSWCharacter
 * @constructor
 * @module Pages
 */
rsSystem.component("RSSWCharacter", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};

		data.additional_characters = [];
		data.entity = null;
		data.widgets = [];
		
		return data;
	},
	"watch": {
		"$route.params.oid": function(oid) {
			this.entity.$off("modified", this.update);
			Vue.set(this, "entity", this.universe.nouns.entity[this.$route.params.oid]);
			this.entity.$on("modified", this.update);
		}
	},
	"mounted": function() {
		if(this.$route.params.oid) {
			Vue.set(this, "entity", this.universe.nouns.entity[this.$route.params.oid]);
			this.entity.$on("modified", this.update);
		}
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"update": function() {
			var characters,
				entity,
				prep = [],
				x;

			if(this.$route.query.characters) {
				characters = this.$route.query.characters.split(",");
				for(x=0; x<characters.length; x++) {
					entity = this.universe.indexes.entity.lookup[characters[x]];
					if(entity && entity.classification === "character" && this.isOwner(entity)) {
						prep.push(entity);
					}
				}
			}

			if(prep.length !== this.additional_characters.length) {
				this.additional_characters.splice(0);
				for(x=0; x<prep.length; x++) {
					this.additional_characters.push(prep[x]);
				}
			}
			
			this.widgets.splice(0);
			if(this.entity) {
				if(this.entity.widgets) {
					this.widgets.push.apply(this.widgets, this.entity.widgets);
				}

				switch(this.entity.classification) {
					case "base":
					case "building":
					case "ship":
						this.widgets.push({
				            "declaration": "rsswEntityInside",
				            "sid": "entity:inside:" + this.entity.id,
				            "enabled": true
						});
						break;
				}

				this.widgets.push({
					"title": "Character",
		            "declaration": "rsswCharacterInfo",
		            "sid": "entity:info:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Description",
		            "declaration": "rsswEntityDescription",
		            "sid": "entity:description:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Journal",
		            "declaration": "rsswEntityJournal",
		            "sid": "entity:journal:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Vitals",
		            "declaration": "rsswCharacterBoard",
		            "sid": "entity:board:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Stats",
		            "declaration": "rsswCharacterStats",
		            "sid": "entity:stats:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Dice",
		            "declaration": "rsswDiceBin",
		            "sid": "entity:dice:" + this.entity.id,
		            "enabled": true,
		            "defaults": {
		            	"entityRollListener": true,
		            	"test": true
		            },
		            "configurations": [{
		        		"label": "Show Name",
		        		"property": "showName",
		        		"type": "checkbox"
		            }, {
		        		"label": "Hide Lables",
		        		"property": "hideLabels",
		        		"type": "checkbox"
		            }, {
		        		"label": "Hide Expression",
		        		"property": "hideExpressions",
		        		"type": "checkbox"
		            }, {
		        		"label": "Sticky",
		        		"property": "sticky_widget",
		        		"type": "checkbox"
		            }, {
		        		"label": "Entity Roller",
		        		"property": "entityRollListener",
		        		"type": "checkbox"
		            }, {
		        		"label": "Test",
		        		"property": "test",
		        		"type": "checkbox"
		            }]
				});
				this.widgets.push({
					"title": "Weapons",
		            "declaration": "rsswEntityWeapons",
		            "sid": "entity:weapons:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "Equipment",
		            "declaration": "rsswEntityEquipment",
		            "sid": "entity:equip:" + this.entity.id,
		            "enabled": true,
		            "state": {
		            	"mode": "long"
		            }
				});
				this.widgets.push({
					"title": "Skills",
		            "declaration": "rsswCharacterSkills",
		            "sid": "entity:skills:" + this.entity.id,
		            "enabled": true,
		            "defaults": {
		            	"emitSkillRoll": true,
		            	"infoSkill": true
		            },
		            "configurations": [{
		        		"label": "Hide Filter",
		        		"property": "hideFilter",
		        		"type": "checkbox"
		            }, {
		        		"label": "Hide Names",
		        		"property": "hideNames",
		        		"type": "checkbox"
		            }, {
		        		"label": "Hide Leveling",
		        		"property": "hideLeveling",
		        		"type": "checkbox"
		            }, {
		        		"label": "Open Info",
		        		"property": "infoSkill",
		        		"type": "checkbox"
		            }, {
		        		"label": "Roll on Click",
		        		"property": "rollSkill",
		        		"type": "checkbox"
		            }, {
		        		"label": "Send Roll",
		        		"property": "emitSkillRoll",
		        		"type": "checkbox"
		            }]
				});
				this.widgets.push({
					"title": "Knowledge",
		            "declaration": "rsswEntityKnowledge",
		            "sid": "entity:knowledge:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
					"title": "History",
		            "declaration": "rsswEntityHistory",
		            "sid": "entity:history:" + this.entity.id,
		            "enabled": true
				});
			}
		}
	},
	"beforeDestroy": function() {
		this.entity.$off("modified", this.update);
	},
	"template": Vue.templified("pages/rssw/character.html")
});
