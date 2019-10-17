
/**
 * 
 * 
 * @class rsswCharacterInfo
 * @constructor
 * @module Components
 */
rsSystem.component("rsswCharacterInfo", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSSWStats,
		rsSystem.components.RSCore
	],
	"props": {
		"character": {
			"required": true,
			"type": Object
		}
	},
	"data": function() {
		var data = {};
		data.race = null;
		data.specializations = [];
		data.careers = [];
		data.experience = 0;
		data.description = "";
		data.calculating = false;
		
		return data;
	},
	"mounted": function() {
		this.character.$on("modified", this.update);
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"updateCharacter": function() {
			if(!this.calculating) {
				Vue.set(this, "calculating", true);
				this.character.recalculateProperties();
				setTimeout(() => {
					Vue.set(this, "calculating", false);
				}, 1000);
			}
		},
		"getSex": function() {
			if(this.character.sex) {
				var index = this.character.sex.indexOf(":");
				if(index === -1) {
					return this.character.sex;
				}
				return this.character.sex.substring(index + 1);
			}
			return "";
		},
		"changed": function(property, value) {
			var change = {};
			change[property] = value;
			this.character.commit(change);
		},
		"update": function() {
			var buffer,
				x;
			
			Vue.set(this, "race", this.universe.nouns.race[this.character.race]);
			this.specializations.splice(0);
			this.careers.splice(0);
			
			if(this.experience !== this.character.xp) {
				Vue.set(this, "experience", this.character.xp);
			}
			if(this.description !== this.character.description) {
				Vue.set(this, "description", this.character.description);
			}
			
			if(this.character.archetype) {
				for(x=0; x<this.character.archetype.length; x++) {
					buffer = this.universe.nouns.archetype[this.character.archetype[x]];
					if(buffer) {
						switch(buffer.classification) {
							case "secondary":
								this.specializations.push(buffer);
								break;
							case "primary":
								this.careers.push(buffer);
								break;
						}
					}
				}
			}
		}
	},
	"beforeDestroy": function() {
		this.character.$off("modified", this.update);
	},
	"template": Vue.templified("components/rssw/character/info.html")
});
