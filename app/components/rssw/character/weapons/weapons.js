
/**
 *
 *
 * @class rsswEntityWeapons
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_weaponsComponentKey:";

	var rangeType = "itemtype:rangedweapon",
		meleeType = "itemtype:meleeweapon";

	var rangeBands = [
		"engaged",
		"short",
		"medium",
		"long",
		"extreme"
	];

	var rangeBandDifficulty = {
		"engaged": {
			"difficulty": 1,
			"challenge": 0,
			"setback": 0
		},
		"short": {
			"difficulty": 1,
			"challenge": 0,
			"setback": 0
		},
		"medium": {
			"difficulty": 2,
			"challenge": 0,
			"setback": 0
		},
		"long": {
			"difficulty": 3,
			"challenge": 0,
			"setback": 0
		},
		"extreme": {
			"difficulty": 4,
			"challenge": 0,
			"setback": 0
		}
	};

	rsSystem.component("rsswEntityWeapons", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			},
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;

			data.storageKeyID = storageKey + this.entity.id;

			data.mdDescription = null;
			data.description = "";
			data.state = this.loadStorage(data.storageKeyID, {
				"viewing": false
			});

			data.isRanged = {};
			data.rangeBonus = 0;
			data.rangeBands = rangeBands;
			data.adjustments = {};
			data.equipped = [];
			data.items = [];

			for(x=0; x<rangeBands.length; x++) {
				data.adjustments[rangeBands[x]] = {};
			}

			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);

			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value]) && this.isOwner(follow)) {
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			this.entity.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"rollDice": function(item) {
				console.log("Roll Item Dice: ", item);
			},
			"getAttackDice": function(item) {
				var pool = this.getSkillRoll(item.skill_check);

				// TODO: Compute?

				return this.renderRoll(pool);
			},
			"getWeaponDamage": function(item) {
				var damage;
				if(item.damage) {
					damage = this.universe.calculateExpression(item.damage, item, this.entity);
				} else {
					damage = 0;
				}
				return damage;
			},
			"getRangeBandDifficultyRoll": function(item, band) {
				var pool = Object.assign({}, rangeBandDifficulty[band]),
					x,
					y;

				if(this.adjustments[band]) {
					for(x=0; x<this.diceTypes.length; x++) {
						if(this.adjustments[band][this.diceTypes[x]]) {
							pool[this.diceTypes[x]] = (pool[this.diceTypes[x]] || 0) + this.adjustments[band][this.diceTypes[x]];
						}
					}
				}

				// TODO: Compute?
				if(band !== "engaged" && (!item.itemtype || !item.itemtype.length || item.itemtype.indexOf(rangeType) === -1)) {
					return [];
				}

				switch(band) {
					case "engaged":
						if(item.itemtype && item.itemtype.length && item.itemtype.indexOf(rangeType) !== -1) {
							pool.difficulty = (pool.difficulty || 0) + 2;
						}
						break;
				}

				return pool;
			},
			"getRangeBandDifficulty": function(item, band) {
				return this.renderRoll(this.getRangeBandDifficultyRoll(item, band));
			},
			"getItemIcon": function(item) {
				var icon = item.icon;
				if(this.entity._relatedErrors[item.id]) {
					icon += " rs-light-red";
				}
				return icon;
			},
			"update": function() {
				var mapped = {},
					buffer,
					item,
					keys,
					slot,
					i,
					x;

				for(x=0; x<this.items.length; x++) {
					this.items[x].$off("modified", this.update);
				}

				this.equipped.splice(0);
				this.items.splice(0);

				if(this.entity.equipped && this.entity.equipped.item) {
					keys = Object.keys(this.entity.equipped.item);

					for(x=0; x<keys.length; x++) {
						slot = this.universe.indexes.slot.lookup[keys[x]];
						if(slot && slot.combat_slot && this.entity.equipped.item[slot.id] && this.entity.equipped.item[slot.id].length) {
							for(i=0; i<this.entity.equipped.item[slot.id].length; i++) {
								item = this.universe.indexes.item.lookup[this.entity.equipped.item[slot.id][i]];
								if(item && !mapped[item.id]) {
									item.$on("modified", this.update);
									this.equipped.push(item);
									if(item.itemtype) {
										this.isRanged[item.id] = item.itemtype.indexOf(rangeType) !== -1;
									} else {
										this.isRanged[item.id] = false;
									}
									mapped[item.id] = true;
								} else {
									console.warn("Unknown Item? " + keys[x], this.entity.equipped.item[slot.id][i], item, this.entity);
								}
							}
						} else {
							console.warn("Unknown or Non-Combat Equipment Slot? " + keys[x], slot, this.entity);
						}
					}
				}

				if(this.entity.item && this.entity.item.length) {
					for(x=0; x<this.entity.item.length; x++) {
						item = this.universe.indexes.item.lookup[this.entity.item[x]];
						if(item && item.damage && !mapped[item.id]) {
							item.$on("modified", this.update);
							this.items.push(item);
							if(item.itemtype) {
								this.isRanged[item.id] = item.itemtype.indexOf(rangeType) !== -1;
							} else {
								this.isRanged[item.id] = false;
							}
						}
					}
				}

				for(x=0; x<rangeBands.length; x++) {
					for(i=0; i<this.diceTypes.length; i++) {
						Vue.delete(this.adjustments[rangeBands[x]], this.diceTypes[i]);
					}
					for(i=0; i<this.diceTypes.length; i++) {
						Vue.set(this.adjustments[rangeBands[x]], this.diceTypes[i], this.entity["range_" + rangeBands[x] + "_" + this.diceTypes[i]]);
					}
				}

				this.rangeBonus = this.entity.range || 0;
			}
		},
		"beforeDestroy": function() {
			this.entity.$off("modified", this.update);
			for(var x=0; x<this.items.length; x++) {
				this.items[x].$off("modified", this.update);
			}
		},
		"template": Vue.templified("components/rssw/character/weapons.html")
	});
})();