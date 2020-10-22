/**
 *
 * Used to track Game Sessions.
 * @class RSSession
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSSession extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
		if(isNaN(this.destiny_light)) {
			this.destiny_light = 0;
		}
		if(isNaN(this.destiny_dark)) {
			this.destiny_dark = 0;
		}
		if(isNaN(this.active_players)) {
			this.active_players = 0;
		}
	}

	get name() {
		return "Session " + this._coreData.name;
	}

	recalculateHook() {
		this.countPlayers();
	}

	countPlayers() {
		var players = 0,
			x;

		for(x=0; x<this.universe.indexes.player.listing.length; x++) {
		    if(this.universe.indexes.player.listing[x].connections > 0) {
		        players++;
		    }
		}

		if(players !== this.active_players) {
			this.active_players = players;
		}
	}

	rollDestiny() {
		var players = 0,
			light = 0,
			dark = 0,
			roll,
			x;

		if(this.active_players === 0) {
			this.countPlayers();
		}

		// Remove Master
		players = this.active_players - 1;

		for(x=0; x<players; x++) {
			roll = Dice.calculateDiceRoll("1f");
			if(roll.light > 0) {
				light += roll.light;
			}
			if(roll.dark > 0) {
				dark += roll.dark;
			}
		}

		this.commit({
			"destiny_starting": light + " Light, " + dark + " Dark",
			"destiny_light": light,
			"destiny_dark": dark
		});
	}
}
