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
		data.spawned = 0;

		return data;
	},
	"mounted": function() {

	},
	"methods": {
		"generateEvent": function(category) {
			if(this.player.master) {
				var sending = {};

				sending._class = "event";
				sending._type = "event";
				sending.name = category.capitalize() + " (New)";
				sending.id = "event:" + category + ":" + Date.now();
				sending.date = Date.now();
				sending.category = category;
				sending.active = true;
				sending.screen = true;
				sending.master_note = "Generated " + category + " event.\n\n";
				sending.state = {
				};
				sending.order = {};
				sending.dice = {
					"expression": "",
					"history": []
				};
				switch(category) {
					case "combat":
						sending.icon = "fas fa-swords";
						break;
					case "story":
						sending.icon = "far fa-book-open";
						break;
					default:
						sending.icon = "fas fa-newspaper";
				}

				this.universe.send("modify:event", sending);
			}
		},
		"startNewCombat": function() {
			var sending = {};

			sending._class = "event";
			sending._type = "event";
			sending.name = "Combat (New)";
			sending.id = "event:combat:" + Date.now();
			sending.date = Date.now();
			sending.category = "combat";
			sending.active = true;
			sending.screen = true;
			sending.state = {};
			sending.order = {};
			sending.dice = {};
			sending.master_note = "Generated combat event from master screen.\n\n";

			this.universe.send("modify:event", sending);
		},
		"addRecordToCombat": function(record) {

		},
		"removeRecordToCombat": function(record) {

		},
		"stopCombat": function(event) {

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
		"spawnItem": function(spawn) {
			if(spawn && this.player.master && spawn.template && spawn._class === "item") {
				var sending = {},
					buffer,
					item,
					x;

				sending.parent = spawn.id;
				sending.name = spawn.name;
				// sending.name = this.generateName(spawn);
				// if(sending.name === spawn.name) {
				// 	sending.name += " (New)";
				// }
				sending.id = spawn.id + ":" + (this.spawned++) + ":" + Date.now();
				sending._class = "item";
				sending._type = "item";

				this.universe.send("modify:item", sending);
				return sending.id;
			}
			return null;
		},
		"spawnEntity": function(spawn, targetID) {
			if(spawn && this.player.master && spawn.template && spawn._class === "entity") {
				var sending = {},
					map = {},
					buffer,
					types,
					slots,
					item,
					x,
					y,
					z;

				sending.parent = spawn.id;
				sending.name = this.generateName(spawn);
				if(sending.name === spawn.name) {
					sending.name += " (New)";
				}
				sending.id = spawn.id + ":" + (this.spawned++) + ":" + Date.now();
				sending._class = "entity";
				sending._type = "entity";
				if(targetID) {
					if(this.universe.indexes.player.index[targetID]) {
						sending.owners = [this.target];
					} else if(targetID && this.universe.indexes.entity.index[targetID]) {
						sending.inside = targetID;
					}
				}

				if(spawn.item) {
					sending.item = [];
					for(x=0; x<spawn.item.length; x++) {
						buffer = this.universe.indexes.item.index[spawn.item[x]];
						if(buffer && buffer.template) {
							buffer = this.spawnItem(buffer);
							if(buffer) {
								map[spawn.item[x]] = buffer;
								sending.item.push(buffer);
							}
						} else {
							sending.item.push(spawn.item[x]);
						}
					}
				}

				if(spawn.equipped) {
					sending.equipped = {};
					types = Object.keys(spawn.equipped);
					for(x=0; x<types.length; x++) {
						sending.equipped[types[x]] = {};
						slots = Object.keys(spawn.equipped[types[x]]);
						for(y=0; y<slots.length; y++) {
							sending.equipped[types[x]][slots[y]] = [];
							for(z=0; z<spawn.equipped[types[x]][slots[y]].length; z++) {
								sending.equipped[types[x]][slots[y]].push(map[spawn.equipped[types[x]][slots[y]][z]] || spawn.equipped[types[x]][slots[y]]);
							}
						}
					}
				}

				this.universe.send("modify:entity", sending);
			}
		}
	}
});
