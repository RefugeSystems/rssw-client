
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
		            "declaration": "rsswCharacterInfo",
		            "sid": "entity:info:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswCharacterBoard",
		            "sid": "entity:board:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswCharacterStats",
		            "sid": "entity:stats:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswDiceBin",
		            "sid": "entity:dice:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswEntityWeapons",
		            "sid": "entity:weapons:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswEntityEquipment",
		            "sid": "entity:equip:" + this.entity.id,
		            "enabled": true,
		            "state": {
		            	"mode": "long"
		            }
				});
				this.widgets.push({
		            "declaration": "rsswCharacterSkills",
		            "sid": "entity:skills:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
		            "declaration": "rsswEntityKnowledge",
		            "sid": "entity:knowledge:" + this.entity.id,
		            "enabled": true
				});
				this.widgets.push({
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
