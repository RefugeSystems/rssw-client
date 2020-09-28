/**
 *
 * @class RSShopControls
 * @constructor
 */
rsSystem.component("RSShopControls", {
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

		return data;
	},
	"mounted": function() {

	},
	"methods": {
		"buyItem": function(shop, item) {

		},
		"sellItem": function(shop, item) {

		},
		"copyItem": function(item, gen) {
			if(this.player.master) {
				var copy = {},
					buffer,
					x;

				copy.id = item.id + ":" + gen + ":" + Date.now();
				copy.parent = item.id;
				copy._class = "item";
				copy._type = "item";

				if(item.randomize_name) {
					copy.name = "";
					if(item.randomize_name_dataset && (buffer = this.universe.indexes.dataset.index[item.randomize_name_dataset])) {
						buffer = new NameGenerator(buffer.set);
					}
					if(item.randomize_name_prefix) {
						copy.name += item.randomize_name_prefix + " ";
					}
					if(buffer) {
						copy.name += buffer.corpus[Random.integer(buffer.corpus.length)].capitalize();
						for(x=1; x<item.randomize_name; x++) {
							if(item.randomize_name_spacing) {
								copy.name += " ";
							}
							copy.name += buffer.corpus[Random.integer(buffer.corpus.length)].capitalize();
						}
					}
					if(item.randomize_name_suffix) {
						copy.name += " " + item.randomize_name_suffix;
					}
				}

				this.universe.send("modify:item", copy);
				return copy.id;
			}
			return null;
		},
		/**
		 *
		 *
		 * TODO: Consider moving into server for smoother item copy
		 * TODO: Rework distribution calculation for standard distribution around mean
		 * @method restockShop
		 * @param {RSEntity} shop [description]
		 */
		"restockShop": function(shop) {
			if(this.player.master) {
				var stop = shop.restock_max,
					additions = [],
					available = [],
					rarities = {},
					flip = true,
					runs = 0,
					gen = 0,
					
					invspread,
					buffer,
					count,
					delta,
					func,
					mark,
					mean,
					high,
					low,
					min,
					max,
					x;

				invspread = 1/shop.restock_spread;
				
				for(x=0; x<this.universe.indexes.item.listing.length; x++) {
					buffer = this.universe.indexes.item.listing[x];
					if( buffer.template && (!buffer.restricted || shop.restock_restricted) &&
							(!shop.rarity_min || shop.rarity_min <= buffer.rarity) &&
							(!shop.rarity_max || buffer.rarity <= shop.rarity_max) &&
							(!shop.soldtypes || shop.soldtypes.hasCommon(buffer.type)) ) {
						if(!rarities[buffer.rarity]) {
							rarities[buffer.rarity] = [];
						}
						rarities[buffer.rarity].push(buffer);
					}
				}

				mean = shop.rarity_mean || shop.rarity_min || 0;
				mark = mean;
				mean = mean * shop.rarity_spread;
				high = mark;
				low = mark;
				runs = 0;

				while(additions.length < stop && runs < stop) {
					count = shop.restockFunction(mark); // Random.integer(shop.restock_base - 2 * (Math.abs(mark - mean)));
					for(x=0; x<count; x++) {
						if(rarities[mark]) {
							buffer = this.copyItem(rarities[mark][Random.integer(rarities[mark].length)], gen++);
							additions.push(buffer);
						}
					}

					if(flip) {
						high = high + 1;
						if(high > shop.rarity_max) {
							high = shop.rarity_mean || shop.rarity_max || 0;
						}
						mark = high;
					} else {
						low = low -1;
						if(low < shop.rarity_min) {
							low = shop.rarity_mean || shop.rarity_min || 0;
						}
						mark = low;
					}
					flip = !flip;
					runs++;
				}

				if(shop.restock_clear) {
					this.universe.send("modify:" + shop._class, {
						"id": shop.id,
						"_class": shop._class || shop._type,
						"_type": shop._class || shop._type,
						"item": additions
					});
				} else {
					this.universe.send("modify:" + shop._class + ":detail:additive", {
						"id": shop.id,
						"_class": shop._class || shop._type,
						"_type": shop._class || shop._type,
						"+delta": {
							"item": additions
						}
					});
				}
			}
		}
	}
});
