/**
 *
 * @class RSAction
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSAction extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._targeted = [];
	}

	fire(origin, source, target) {
		var response,
			x;

		if(this.response && this.response.length) {
			for(x=0; x<this.response.length; x++) {
				response = RSAction.response.index[this.response[x]];
				if(response) {
					response.reaction(origin, source, target);
				}
			}
		}
	}

	filterTargets(targets, base) {
		var response,
			x;

		if(this.response && this.response.length) {
			for(x=0; x<this.response.length; x++) {
				response = RSAction.response.index[this.response[x]];
				if(response && response.filter) {
					targets = targets.filter(response.filter(this, base));
				}
			}
		}

		return targets;
	}

	recalculateHook() {
		var response,
			x;

		this._targeted.splice(0);
		if(this.response && RSAction.response) {
			for(x=0; x<this.response.length; x++) {
				response = RSAction.response.index[this.response[x]];
				if(response && response.target) {
					this._targeted.push.apply(this._targeted, response.target);
				}
			}
		}

		if(this._targeted.length) {
			this.targets = this._targeted.join(", ");
		}
	}
}

/* *
RSAction.response = new SearchIndex();

RSAction.response.indexItem({
	"id": "Draw",
	"function": function(origin, source, target) {

	}
});

RSAction.response.indexItem({
	"id": "Recharge",
	"target": ["item"],
	"function": function(origin, source, target) {
		if(origin && source && target && target.charged === false) {
			origin.universe.send("action:recharge", {
				"origin": origin.id,
				"source": source.id,
				"target": target.id
			});
		}
	}
});
/* */
setTimeout(function() {
	RSAction.response = new SearchIndex();

	RSAction.response.indexItem({
		"name": "Test",
		"id": "Test",
		"target": ["item"],
		"reaction": function(origin, source, target) {
			console.log("Action Test Sending: ", origin, source, target);
			if(origin && source && target) {
				origin.universe.promisedSend("action:test", {
					"origin": origin.id || origin,
					"source": source.id || source,
					"target": target.id || target
				})
				.then(function(res) {
					console.log("Action Test Response: ", res);
				})
				.catch(function(err) {
					console.warn("Action Test Failure: ", err);
				});
			}
		}
	});

	RSAction.response.indexItem({
		"name": "Draw",
		"id": "Draw",
		"reaction": function(origin, source) {
			if(origin && source) {
				origin.universe.send("action:draw", {
					"origin": origin.id || origin,
					"source": source.id || source
				});
			}
		}
	});

	RSAction.response.indexItem({
		"name": "Recharge",
		"id": "Recharge",
		"target": ["item"],
		"reaction": function(origin, source, target) {
			if(origin && source && target) {
				origin.universe.send("action:recharge", {
					"origin": origin.id || origin,
					"source": source.id || source,
					"target": target.id || target
				});
			}
		},
		"filter": function(record, base) {
			return function(entry) {
				var result = true;

				if(!entry || entry.charged === true || entry.charged === undefined || entry.charged === null) {
					return false;
				}

				if(record) {
					if(result && record.cancontain && record.cancontain.length) {
						result = record.cancontain.hasCommon(entry.type);
					}
					if(result && record.notcontain && record.notcontain.length) {
						result = !record.notcontain.hasCommon(entry.type);
					}
				}
				if(base) {
					if(result && base.cancontain && base.cancontain.length) {
						result = base.cancontain.hasCommon(entry.type);
					}
					if(result && base.notcontain && base.notcontain.length) {
						result = !base.notcontain.hasCommon(entry.type);
					}
				}

				return result;
			};
		}
	});

	RSAction.response.listing.sortBy("name");
}, 0);
/* */
