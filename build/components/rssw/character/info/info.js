
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
	"mounted": function() {
		this.character.$on("modified", this.update);
		rsSystem.register(this);
		this.update();
	},
	"data": function() {
		var data = {};
		data.race = null;
		data.specializations = [];
		data.careers = [];
		
		return data;
	},
	"methods": {
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
		"update": function() {
			var buffer,
				x;
			
			Vue.set(this, "race", this.universe.nouns.race[this.character.race]);
			this.specializations.splice(0);
			this.careers.splice(0);
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
