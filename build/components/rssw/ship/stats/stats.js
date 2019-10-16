
/**
 * 
 * 
 * @class rsswShipStats
 * @constructor
 * @module Components
 */
rsSystem.component("rsswShipStats", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSSWStats,
		rsSystem.components.RSCore
	],
	"props": {
		"ship": {
			"required": true,
			"type": Object
		}
	},
	"data": function() {
		var data = {};

		data.points = 0;
		data.mounted = {};
		data.abilities = [];
		data.ability = null;
		data.pilot = null;
		
		return data;
	},
	"mounted": function() {
		this.ship.$on("modified", this.update);
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"update": function() {
			var points = this.ship.points || 0,
				buffer,
				x;
			
			buffer = Object.keys(this.mounted);
			for(x=0; x< buffer.length; x++) {
				Vue.delete(this.mounted, buffer[x]);
			}
			
			buffer = this.universe.nouns.entity[this.ship.pilot];
			if(buffer) {
				if(this.pilot) {
					if(this.pilot.id !== buffer.id) {
						this.pilot.$off("modified", this.update);
						buffer.$on("modified", this.update);
						Vue.set(this, "pilot", buffer);
					}
				} else {
					buffer.$on("modified", this.update);
					Vue.set(this, "pilot", buffer);
				}
			} else if(this.pilot) {
				this.pilot.$off("modified", this.update);
			}
			
			if(this.pilot) {
				Vue.set(this, "ability", this.universe.nouns.ability[this.pilot.active_ship_ability]);
			} else if(this.ability) {
				Vue.set(this, "ability", null);
			}
			
			this.abilities.splice(0);
			for(x=0; this.ship.ability && x<this.ship.ability.length; x++) {
				buffer = this.universe.nouns.ability[this.ship.ability[x]];
				if(buffer) {
					this.abilities.push(buffer);
				} else {
					console.warn("Unidentified Ability: " + this.ship.ability[x]);
				}
			}
			for(x=0; this.pilot && this.pilot.ship_abilities && x<this.pilot.ship_abilities.length; x++) {
				buffer = this.universe.nouns.ability[this.pilot.ship_abilities[x]];
				if(buffer) {
					this.abilities.push(buffer);
				} else {
					console.warn("Unidentified Ability: " + this.pilot.ship_abilities[x]);
				}
			}
			
			for(x=0; this.ship.slot && x<this.ship.slot.length; x++) {
				buffer = this.ship["slot_" + this.ship.slot[x]];
				if(buffer) {
					Vue.set(this.mounted, this.ship.slot[x], buffer);
				}
			}
			
			this.$forceUpdate();
		}
	},
	"beforeDestroy": function() {
		if(this.pilot) {
			this.pilot.$off("modified", this.update);
		}
		this.ship.$off("modified", this.update);
	},
	"template": Vue.templified("components/rssw/ship/stats.html")
});
