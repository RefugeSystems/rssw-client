/**
 * 
 * 
 * 
 * Note: Do not add a removeObject.
 * Instead Re-compute modifier instead of attempting a negative.
 * Things like "gender" don't directly undo without the overhead of tracking.
 * 
 * @class RSCalculator
 * @constructor
 * @module Common
 */
var RSCalculator = (function() {
	var rolled = {
		"armor": true,
		"maxHealth": true,
		"health": true,
		// Stat Rolls
		"strength": true,
		"dexterity": true,
		"constitution": true,
		"intelligence": true,
		"wisdom": true,
		"charisma": true,
		"initiative": true,
		"attack": true,
		"acrobatics": true,
		"animalhandling": true,
		"arcana": true,
		"atheletics": true,
		"concentration": true,
		"deception": true,
		"history": true,
		"insight": true,
		"intimidation": true,
		"investigation": true,
		"medicine": true,
		"nature": true,
		"perception": true,
		"performance": true,
		"persuasion": true,
		"religion": true,
		"slightofhand": true,
		"stealth": true,
		"itemDamage": true,
		"survival": true,
		"heaviness": true,
		"movement": true,
		
		// Physical Damage
		"bludgeoning": true,
		"piercing": true,
		"crushing": true,
		"slashing": true,
		
		// Magical Damage
		"lightning": true,
		"necrotic": true,
		"psychic": true,
		"radiant": true,
		"thunder": true,
		"poison": true,
		"acid": true,
		"cold": true,
		"heal": true,
		"fire": true,
		"force": true,
		
		// Hit
		"spellAttack": true,
		"spellDC": true,
		"hitMain": true,
		"hitOff": true,
		
		// Item Stats,
		"itemSpellDCStat": false,
		"itemSpellAttack": true,
		"itemSpellDC": true,
		"itemDCStat": false,
		"itemDC": true,
		
		// Spell Memory/Slots
		"class:battlemage": true,
		"class:wizard": true,
		"class:barbarian": true,
		"class:bard": true,
		"class:cleric": true,
		"class:rogue": true,
		"class:ranger": true,

		"class:paladin": true,
		"class:sorcerer": true,
		"class:monk": true,
		"class:druid": true,
		"class:warlock": true,
		"class:fighter": true,
		
		"cantrip": true
	};
	
	var skipped = {
		"id": true,
		"_id": true,
		"_world": true,
		"description": true,
		"notes": true
	};
	
	var appended = {
		"description": false
	};
	
	var translateModifiers = function(modifiers, world) {
		return resolveWorldReferences("modifier", modifiers, world);
	};
	
	var resolveWorldReferences = function(noun, ids, world) {
		world = world || this.world;
		return ids.map(function(id) {
			if(!world.objects[noun][id]) {
				rsSystem.log.warn("Missing " + noun + " Requested: ", id);
				return {
					"name": "Unknown[" + id + "]",
					"id": id
				};
			} else {
				return world.objects[noun][id];
			}
		});
	};
	
	var calculateThrow = function(score) {
		return parseInt(Math.floor(score/2) - 5);
	};
	
	/**
	 * 
	 * @method isModifierActive
	 * @private
	 * @param {AQCharacter} target Creature to check against
	 * @param {AQModifier} modifier The modifier to check
	 * @param {Number} attuned On 0, undefined, null, or false, we don't care. On 1, the modifier needs
	 * 		attuning but is not attuned to target, on 2 needs attuning and is attuned to the target, on 3
	 * 		we are checking for a world master.
	 */
	var isModifierActive = function(target, modifier, attuned, debug) {
//		return true;
		if(!modifier) {
			return true;
		}

		if(rsSystem.debugging || debug) {
			console.log("Modifier Active? [" + modifier.id + ":" + modifier.magical + "@" + attuned + "]: ", modifier);
		}
		
		if(!target) {// Basically to support display cases where we don't want to enforce conditions
			if(attuned === 3 || !attuned) {
				return true;
			} else {
				return false;
			}
		}
		
		var x, buffer;
		if(modifier.condition) {
			if(modifier.condition.equipment) {
				buffer = Object.keys(modifier.condition.equipment);
				for(x=0; x<buffer.length; x++) {
					if(modifier.condition.equipment[buffer[x]] !== !!target.equipment[buffer[x]]) {
						return false;
					}
				}
			}
			
			if(modifier.condition.target) {
				return false; // This condition currently ignored. If required, compute by hand
			}
			
			if(modifier.condition.ranged && !target.modifications.range) {
				return false;
			}
		}
		
		if(modifier.magical && (attuned === 0 || attuned === 1)) {
			return false;
		}
		
		return true;
	};
	
	var spellDC = function(character, spell) {
		var dc = 8 + character.proficiency + calculateThrow((character.sheet?character.sheet:character)[spell.castWith || character.castWith || "intelligence"]);
		if(character.sheet && character.sheet.spellDC) {
			dc += character.sheet.spellDC;
		}
		return dc;
	};
	
	/**
	 * 
	 * @method addModifiers
	 * @static
	 * @private
	 * @param {AQCharacter | NPC} character
	 * @param {Modifier} from
	 * @param {Modifier} to
	 * @param {String} [key]
	 * @param {Number} [attuned] On 0, undefined, null, or false, we don't care. On 1, the modifier needs
	 * 		attuning but is not attuned to target, on 2 needs attuning and is attuned to the target, on 3
	 * 		we are checking for a world master.
	 * @param {Boolean} [debug]
	 * @return {Modifier} The "to" modifier is returned.
	 */
	var addModifiers = function(character, from, to, key, attuned, debug) {
		if(!key && !isModifierActive(character, from, attuned, debug)) {
			return to;
		}
		
		if(from && key) {
			if(!to[key]) {
				if(from[key] instanceof Array) {
					to[key] = [];
				} else {
					to[key] = {};
				}
			}
			
			from = from[key];
			to = to[key];
		}
		
		if(from) {
			var x, buffer;
			buffer = Object.keys(from);
			if(debug) {
				console.log("Keys[" + from.id + "]: ", buffer);
			}
			for(x=0; x<buffer.length; x++) {
				if(from[buffer[x]] && !skipped[buffer[x]]) {
					if(debug && buffer[x] === "spellDC" && (to[buffer[x]] || from[buffer[x]])) {
						console.log("To: ", to, "From: ", from);
					}
					if(buffer[x] === "health") {
						if(to[buffer[x]]) {
							to[buffer[x]] += " + " + from[buffer[x]];
						} else {
							to[buffer[x]] = from[buffer[x]];
						}
					} else if(from[buffer[x]] instanceof Array) {
						to[buffer[x]] = to[buffer[x]] || [];
						try {
							to[buffer[x]].push.apply(to[buffer[x]], from[buffer[x]]);
						} catch(exception) {
//							console.log("From[" + buffer[x] + "]: ", from);
//							console.log("To[" + buffer[x] + "]: ", to);
							throw exception;
						}
					} else if(from[buffer[x]] instanceof Object) {
						addModifiers(character, from, to, buffer[x], attuned);
					} else if(rolled[buffer[x]] || (buffer[0] === "c" && buffer[1] === "l" && buffer[4] === "s" && buffer[5] === ":" && buffer.length > 6)) { // Adding up rolls
						if(to[buffer[x]]) {
							to[buffer[x]] += " + " + from[buffer[x]];
						} else {
							to[buffer[x]] = from[buffer[x]];
						}
					} else if(appended[buffer[x]]) { // Append Texts
						if(!to[buffer[x]]) {
							to[buffer[x]] = from[buffer[x]];
						} else {
							to[buffer[x]] += "\n\n" + from[buffer[x]];
						}
					} else if(typeof from[buffer[x]] === "number") {
						to[buffer[x]] = calculateDiceRoll(to[buffer[x]] || 0, character);
						to[buffer[x]] += calculateDiceRoll(from[buffer[x]], character);
					} else {
						to[buffer[x]] = from[buffer[x]];
					}
				}
			}
		}
		
		return to;
	};
	
	/**
	 * 
	 * @method calculateModifiers
	 * @private
	 * @param {AQCharacter} character
	 * @param {Array} modifiers
	 * @param {Modifier} [base]
	 * @param {Number} [attuned]
	 */
	// TODO: Accept additional arguments as modifiers to include
	var calculateModifiers = function(character, modifiers, base, attuned, debug) {
		var x,
			modified = {},
			built = {},		// for dynamic computations
			reference = {};	// for flat adds and such
		
		attuned = attuned || 0;
		for(x=0; x<modifiers.length; x++) {
			if(modifiers[x] && (!modifiers[x].requirement || !character || character.meetsRequirement(modifiers[x]))) {
				if(debug) {
					console.log("Computing Modifier[" + modifiers[x].id + "] for Character[" + (character?character.id:"None") + "]: ", modifiers[x]);
				}
				addModifiers(character, modifiers[x], modified, undefined, attuned, debug);
				if(debug) {
					console.log("Computed Modifier[" + modifiers[x].id + "] for Character[" + (character?character.id:"None") + "]: " + JSON.stringify(modified, null, 4));
				}
			} else {
				if(debug) {
					console.warn("Skipping Modifier[" + modifiers[x].id + "] for Character[" + (character?character.id:"None") + "]: ", modifiers[x]);
				}
			}
		}
		if(base) {
			addModifiers(character, base, modified, undefined, attuned, debug);
		}
		return modified;
	};

	var rollMap = [
		["str", "strength"],
		["dex", "dexterity"],
		["con", "constitution"],
		["int", "intelligence"],
		["wis", "wisdom"],
		["cha", "charisma"]
	];
	var rollLevelMap = [
		["level","self"],
		["barbarian","class:barbarian"],
		["bard","class:bard"],
		["cleric","class:cleric"],
		["rogue","class:rogue"],
		["ranger","class:ranger"],
		["paladin", "class:paladin"],
		["sorcerer", "class:sorcerer"],
		["monk", "class:monk"],
		["druid", "class:druid"],
		["warlock", "class:warlock"],
		["fighter", "class:fighter"],
		["wizard","class:wizard"]
	];
	var rollDirectMap = [
		["pro", "proficiency"],
		["movement", "movement"],
		["health", "health"],
		["HP", "health"],
		["maxHealth", "maxHealth"],
		["maxHP", "maxHealth"],
		["armor", "armor"],
		["ac", "armor"]
	];
	
	var diceReductionRegEx = /\+?([0-9a-z\.]+|\([0-9+-\/\*\(\)a-z\.]+)(d[0-9]+)/g;
	var calculateSecurityRegEx = /^[<>a-zA-Z0-9\(\)+-\/\*]*$/;
	
	var calculate = function(expression) {
		if(expression && expression[0] === "+") { // Other operators would expressly be an issue 
			expression = expression.substring(1);
		}
		
		if(expression && expression.length < 150 && calculateSecurityRegEx.test(expression)) {
			try {
				return eval(expression);
			} catch(ignored) {
				return expression;
			}
		} else {
			return expression;
		}
	};
	
	var diceOrder = [
		"d4",
		"d6",
		"d8",
		"d10",
		"d12",
		"d20",
		"d100"
	];
	
	var diceRoll = function(dice) {
		var roll = parseInt(parseInt(dice.substring(1)) * Math.random()) + 1;
		return roll;
	};
	
	/**
	 * Parses a string expression (e.g "con + 1d8") into an object for calculation or
	 * display.
	 * @method parseDiceRoll
	 * @private
	 * @param {String} expression
	 * @param {AQCharacter} [source] Drives raw arguments for stats such as "str" and "wis".
	 * @param {AQCharacter} [target] Drives 'target; arguments for stats such as "target.str"
	 * 		and "target.wis".
	 */
	var parseDiceRoll = function(expression, source, target) {
		var x, sCasting, tCasting, regex, buffer = [], dice = {};
		if(!expression) {
			return dice;
		} else {
			expression = expression.toString();
		}

		if(source) {
			sCasting = source.castWith || "int";
			sCasting = sCasting.substring(0, 3);
		} else {
			sCasting = "int";
		}
		if(target) {
			tCasting = target.castWith || "int";
			tCasting = sCasting.substring(0, 3);
		} else {
			tCasting = "int";
		}
		
		if(target && target.castWith && expression.indexOf("target.cast") !== -1) {
			regex = new RegExp("target.cast", "g");
			expression = expression.replace(regex, tCasting);
		}
		
		if(source && source.castWith && expression.indexOf("cast") !== -1) {
			regex = new RegExp("cast", "g");
			expression = expression.replace(regex, sCasting);
		}
		
		if(target) {
			for(x=0; x<rollLevelMap.length; x++) {
				regex = new RegExp("target\\." + rollLevelMap[x][0], "g");
				expression = expression.replace(regex, target.level[rollLevelMap[x][1]] || 0);
			}
			for(x=0; x<rollMap.length; x++) {
				regex = new RegExp("target\\." + rollMap[x][0], "g");
				expression = expression.replace(regex, parseInt(Math.floor(((target.sheet?target.sheet:target)[rollMap[x][1]] || 0)/2) - 5));
			}
			for(x=0; x<rollDirectMap.length; x++) {
				regex = new RegExp("target\\." + rollDirectMap[x][0], "g");
				expression = expression.replace(regex, parseInt( (target.sheet?target.sheet:target)[rollDirectMap[x][1]] ) );
			}
		}
		if(source) {
			for(x=0; x<rollLevelMap.length; x++) {
				regex = new RegExp(rollLevelMap[x][0], "g");
				expression = expression.replace(regex, source.level[rollLevelMap[x][1]] || 0);
			}
			for(x=0; x<rollMap.length; x++) {
				regex = new RegExp(rollMap[x][0], "g");
				expression = expression.replace(regex, parseInt(Math.floor(((source.sheet?source.sheet:source)[rollMap[x][1]] || 0)/2) - 5));
			}
			for(x=0; x<rollDirectMap.length; x++) {
				regex = new RegExp(rollDirectMap[x][0], "g");
				expression = expression.replace(regex, parseInt( (source.sheet?source.sheet:source)[rollDirectMap[x][1]] ) );
			}
		}
		expression = expression.replace(/ /g, "");
		x = diceReductionRegEx.exec(expression);
		while(x !== null) {
			buffer.push(x[0]);
			dice[x[2]] = dice[x[2]]?dice[x[2]] + "+" + x[1]:x[1];
			x = diceReductionRegEx.exec(expression);
		}
		for(x=0; x<buffer.length; x++) {
			expression = expression.replace(buffer[x], "");
		}
		dice.null = expression;
//		console.log("Dice Expression: " + JSON.stringify(dice, null, 4));
	//	for(x=0; x<diceOrder.length; x++) {
	//		if(dice[diceOrder[x]]) {
	//			dice[diceOrder[x]] = parseInt(calculate(dice[diceOrder[x]]));
	//		}
	//	}
		return dice;
	};
	
	var rawDiceRoll = function(expression, source, target) {
		var x, dice, add;
		dice = parseDiceRoll(expression, source, target);
		expression = calculate(dice.null);
		for(x=0; x<diceOrder.length; x++) {
			if(dice[diceOrder[x]]) {
				add = parseInt(calculate(dice[diceOrder[x]]));
				if(isNaN(add)) {
					add = "(" + dice[diceOrder[x]] + ")" + diceOrder[x];
				} else {
					add = add + diceOrder[x];
				}
				if(expression) {
					expression += " + " + add;
				} else {
					expression = add;
				}
			}
		}
		return expression;
	};
	
	var reduceDiceRoll = function(expression, source, target) {
		var x, buffer, dice;
		dice = parseDiceRoll(expression, source, target);
		expression = calculate(dice.null);
		for(x=0; x<diceOrder.length; x++) {
			if(dice[diceOrder[x]]) {
				if(expression) {
					expression += " + " + (isNaN(buffer = parseInt(calculate(dice[diceOrder[x]])))?dice[diceOrder[x]]:buffer) + diceOrder[x];
				} else {
					expression = (isNaN(buffer = parseInt(calculate(dice[diceOrder[x]])))?dice[diceOrder[x]]:buffer) + diceOrder[x];
				}
			}
		}
		return expression;
	};
	
	var calculateDiceRoll = function(expression, source, target) {
		var d, x, roll, dice;
		dice = parseDiceRoll(expression, source, target);
		roll = parseInt(calculate(dice.null)) || 0;
		for(d=0; d<diceOrder.length; d++) {
			dice[diceOrder[d]] = parseInt(calculate(dice[diceOrder[d]]));
			for(x=0; x<dice[diceOrder[d]] && !isNaN(dice[diceOrder[d]]); x++) {
				roll += diceRoll(diceOrder[d]);
			}
		}
		return parseInt(roll);
	};
	
	rsSystem.component("RSCalculator", {
		"inherit": true,
		"props": [],
		"mounted": function() {
		},
		"data": function() {
			var data = {};
			data.slotRef = AQCharacter.slotRef;
			return data;
		},
		"methods": {
			/**
			 * 
			 * @method translateModifiers
			 * @param {Array | String} modifiers Array of modifier IDs
			 * @param {AQWorld} [world] Defaults to "this.world" which works well when used as a mixin
			 * @return {Array | Modifier}
			 */
			"translateModifiers": translateModifiers,
			/**
			 * 
			 * @method resolveWorldReferences
			 * @param {String} noun The name of the nouns to resolve
			 * @param {Array | String} objects Array of object IDs
			 * @param {AQWorld} [world] Defaults to "this.world" which works well when used as a mixin
			 * @return {Array | Object} Array of the IDs resolved to objects
			 */
			"resolveWorldReferences": resolveWorldReferences,
			/**
			 * 
			 * @method calculateModifiers
			 * @param {AQCharacter} character The character receiving the modifications. Used to check if specific
			 * 		modifiers are considered active. Pass false to force all true for display conditions.
			 * @param {Array} modifiers The array of modifiers to process into a computed modifier.
			 * @param {Modifier} [base]
			 * @param {Number} [attuned] 
			 */
			"calculateModifiers": calculateModifiers,
			/**
			 * 
			 * @method calculateDiceRoll
			 * @param {String} expression
			 * @param {AQCharacter} [source] Drives raw arguments for stats such as "str" and "wis".
			 * @param {AQCharacter} [target] Drives 'target; arguments for stats such as "target.str"
			 * 		and "target.wis".
			 */
			"calculateDiceRoll": calculateDiceRoll,
			/**
			 * 
			 * @method reduceDiceRoll
			 * @param {String} expression
			 * @param {AQCharacter} [source] Drives raw arguments for stats such as "str" and "wis".
			 * @param {AQCharacter} [target] Drives 'target; arguments for stats such as "target.str"
			 * 		and "target.wis".
			 */
			"reduceDiceRoll": reduceDiceRoll,
			/**
			 * 
			 * @method calculateThrow
			 * @param {Number} score
			 */
			"calculateThrow": calculateThrow,
			/**
			 * 
			 * @method calculateSpellDC
			 * @param {AQCharacter} character
			 * @param {AQSpell} spell
			 * @return {Number} SpellDC for that character
			 */
			"calculateSpellDC": spellDC,
			/**
			 * 
			 * @method sum
			 * @param {Array} source Array of integers to sum
			 * @return {Number} The sum of the array
			 */
			"sum": function(source) {
				var sum = 0;
				for(var x=0; x<source.length; x++) {
					sum += parseInt(source[x]);
				}
				return sum;
			}
		}
	});
	
	var calculator = {};
	
	/**
	 * 
	 * @method translateModifiers
	 * @param {Character | NPC} modified The character receiving the modifications. Used to check if specific
	 * 		modifiers are considered active. 
	 * @param {Array | Modifier} modifiers The array of modifiers to process into a computed modifier.
	 */
	calculator.translateModifiers =  translateModifiers;
	/**
	 * 
	 * @method resolve
	 * @param {String} noun The name of the nouns to resolve
	 * @param {Array | String} objects Array of object IDs
	 * @param {AQWorld} world 
	 * @return {Array | Object} Array of the IDs resolved to objects
	 */
	calculator.resolve =  resolveWorldReferences;
	/**
	 * 
	 * @method modifiers
	 * @param {Character | NPC} [modified] The character receiving the modifications. Used to check if specific
	 * 		modifiers are considered active. Pass false to force all true for display conditions. 
	 * @param {Array | Modifier} modifiers The array of modifiers to process into a computed modifier.
	 */
	calculator.modifiers = calculateModifiers;
	/**
	 * 
	 * @method diceRoll
	 * @param {String} expression
	 * @param {Character | NPC | Monster} [source] Drives raw arguments for stats such as "str" and "wis".
	 * @param {Character | NPC | Monster} [target] Drives 'target; arguments for stats such as "target.str"
	 * 		and "target.wis".
	 */
	calculator.diceRoll = calculateDiceRoll;
	/**
	 * 
	 * @method calculateThrow
	 * @param {Number} score
	 */
	calculator.calculateThrow = calculateThrow;
	/**
	 * 
	 * @method reduceDiceRoll
	 * @param {String} expression
	 * @param {Character | NPC | Monster} [source] Drives raw arguments for stats such as "str" and "wis".
	 * @param {Character | NPC | Monster} [target] Drives 'target; arguments for stats such as "target.str"
	 * 		and "target.wis".
	 */
	calculator.reduceDiceRoll = reduceDiceRoll;
	
	/**
	 * 
	 * @method addObject
	 * @deprecated Miss-Named
	 * @param {AQCharacter | NPC} character
	 * @param {Modifier} from
	 * @param {Modifier} to
	 * @param {String} [key]
	 */
	calculator.addObject = addModifiers;
	/**
	 * 
	 * @method addModifiers
	 * @param {AQCharacter | NPC} character
	 * @param {Modifier} from
	 * @param {Modifier} to
	 * @param {String} [key]
	 */
	calculator.addModifiers = addModifiers;
	/**
	 * 
	 * @method spellDC
	 * @param {AQCharacter} character
	 * @param {AQSpell} spell
	 * @return {Number} SpellDC for that character
	 */
	calculator.spellDC = spellDC;
})();
