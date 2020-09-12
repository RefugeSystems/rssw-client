/**
 * 
 * @class RSMasterControls
 * @constructor
 */
rsSystem.component("RSMasterControls", {
	"inherit": true,
	"mixins": [
	],
	"props": {
		"player": {
			"required": true,
			"type": Object
		},
		"universe": {
			"required": true,
			"type": Object
		}
	},
	"data": function() {
		var data = {};

		data.nameGenerators = {};
		
		return data;
	},
	"mounted": function() {

	},
	"methods": {
		"startCombat": function() {
			
		},
		"addRecordToCombat": function(record) {
			
		},
		"removeRecordToCombat": function(record) {
			
		},
		"stopCombat": function() {
			
		},
		"deleteRecord": function(record) {
			if(record && record._class && record.id) {
				this.universe.send("delete:" + record._class, record);
			}
		},
		"log": function(message) {
			console.log("Log: ", message);
		},
		"copyItemToEntity": function(itemID, entityID) {
			if(this.player.master) {
				var sending = {};
				sending.target = entityID;
				sending.item = itemID;
				this.universe.send("give:item", sending);
			}
		},
		"getNameGenerator": function(race) {
			var generator = null,
				data,
				x;
			
			if(race && this.universe.indexes.race.index[race] && this.universe.indexes.race.index[race].dataset) {
				if(!this.nameGenerators[race]) {
					data = "";
					for(x=0; x<this.universe.indexes.race.index[race].dataset.length; x++) {
						if(this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]]) {
							data += " " + this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]].set;
						}
					}
					generator = new NameGenerator(data);
					Vue.set(this.nameGenerators, race, generator);
				} else {
					generator = this.nameGenerators[race];
				}
//				return this.nameGenerators[race];
			} else if(this.universe.defaultDataset) {
				if(!this.nameGenerators._default) {
					if(!this.universe.defaultDataset.set) {
						console.warn("Update: ", this.universe.defaultDataset);
						this.universe.defaultDataset.recalculateProperties();
					}
					generator = new NameGenerator(this.universe.defaultDataset.set);
					Vue.set(this.nameGenerators, "_default", generator);
				} else {
					generator = this.nameGenerators._default;
				}
			}
			
			return generator;
		},
		"generateName": function(record) {
			var result = "",
				buffer,
				x;
			
			if(record.randomize_name) {
				if(record.randomize_name_dataset && (buffer = this.universe.indexes.dataset.index[record.randomize_name_dataset])) {
					buffer = new NameGenerator(buffer.set);
				} else if(record.race) {
					buffer = this.getNameGenerator(record.race);
				}
				if(record.randomize_name_prefix) {
					result += record.randomize_name_prefix;
					if(record.randomize_name_spacing) {
						result += " ";
					}
				}
				if(buffer) {
					result += buffer.corpus[Random.integer(buffer.corpus.length)].capitalize();
					for(x=1; x<record.randomize_name; x++) {
						if(record.randomize_name_spacing) {
							result += " ";
						}
						result += buffer.corpus[Random.integer(buffer.corpus.length)].capitalize();
					}
				}
				if(record.randomize_name_suffix) {
					result += " " + record.randomize_name_suffix;
				}
				
				return result;
			} else {
				return record.name;
			}
		},
		"spawnEntity": function(spawn, targetID) {
			if(spawn && this.player.master && spawn.template && spawn._class === "entity") {
				var sending = {};
				
				sending.parent = spawn.id;
				sending.name = this.generateName(spawn);
				if(sending.name === spawn.name) {
					sending.name += " (New)";
				}
				sending.id = spawn.id + ":" + Date.now();
				sending._class = "entity";
				sending._type = "entity";
				if(targetID) {
					if(this.universe.indexes.player.index[targetID]) {
						sending.owners = [this.target];
					} else if(targetID && this.universe.indexes.entity.index[targetID]) {
						sending.inside = targetID;
					}
				}

				this.universe.send("modify:entity", sending);
			}
		}
	}
}); 