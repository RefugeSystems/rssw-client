/**
 *
 * @class RSParty
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 * @param {Object} universe
 */
class RSParty extends RSObject {
	constructor(details, universe) {
		super(details, universe);
	}

	recalculateHook() {
		var speed = 0,
			entity,
			x;

		try {
			if(this.entity && this.entity.length) {
				entity = this.universe.indexes.entity.index[this.entity[0]];
				speed = entity.speed || 0;
				for(x=1; x<this.entity.length; x++) {
					entity = this.universe.indexes.entity.index[this.entity[x]];
					if(!isNaN(entity.speed) && entity.speed < speed) {
						speed = entity.speed || 0;
					}
				}
			}
		} catch(exception) {
			rsSystem.log.warn("Failed to calculate party[" + this.id + "] speed: ", exception);
		}

		this.speed = speed;
	}

	setLocation(location) {
		var update = {},
			hold,
			x;

		update.location = location;

		this.commit(update);

		for(x=0; this.entity && x < this.entity.length; x++) {
			hold = this.universe.indexes.entity.index[this.entity[x]];
			if(hold) {
				hold.commit(update);
			}
		}
	}

	removeMember(member) {
		this.universe.send("modify:entity:detail:subtractive", {
			"id": this.id,
			"_type": "party",
			"delta": {
				"entity": member
			}
		});
	}

	addMember(member) {
		this.universe.send("modify:entity:detail:additive", {
			"id": this.id,
			"_type": "party",
			"delta": {
				"entity": member
			}
		});
	}

	giveCredits(credits) {
		var update = {},
			x;

		if(this.entity) {
			update.delta = {};
			update.delta.credits = credits;
			update._type = "entity";
			for(x=0; x<this.entity.length; x++) {
				update.id = this.entity[x];
				this.universe.send("modify:entity:detail:additive", update);
			}
		}
	}
}
