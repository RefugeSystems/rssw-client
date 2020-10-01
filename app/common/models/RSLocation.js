/**
 * Representation for locations
 * @class RSEntity
 * @extends RSLocation
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSLocation extends RSObject {
	constructor(details, universe) {
		super(details, universe);

		if(this.type && !(this.type instanceof Array)) {
			this.type = [this.type];
		}

		this._childLocations = [];
		if(!this.coordinates) {
			this.coordinates = [];
		}
		if(details.showing) {
			this.showing = details.showing;
		}
	}

	appendPath(x, y) {
		if(this._shadow.path === undefined) {
			this._shadow.path = "";
		}
		if(this._shadow.path) {
			this._shadow.path += " ;" + x + "," + y;
		} else {
			this._shadow.path = x + "," + y;
		}
		this.commit({
			"path": this._shadow.path
		});
	}

	loadDeltaHook(details) {
		if(details.showing) {
			this.showing = details.showing;
		}
	}

	recalculateHook() {
		var scanning = [this.id],
			searchString = "",
			target,
			next,
			x,
			y;

		this._childLocations.splice(0);
		if(this.location) { // Exclude Top Level Location
			for(y=0; y<scanning.length; y++) {
				target = scanning[y];
				for(x=0; x<this.universe.indexes.location.listing.length; x++) {
					next = this.universe.indexes.location.listing[x];
					if(next && next.location === target) {
						this._childLocations.push(next);
						searchString += next._search;
						scanning.push(next.id);
					}
				}
			}
			this._search += " ||| " + searchString;

			next = this.universe.indexes.location.index[this.location];
			if(next) {
				this._search += " ||| " + next.name;
			}
		}

		this.thickness = parseFloat(this.thickness) || 2;
		this.opacity = parseFloat(this.opacity) || .05;

		try {
			if(this.path && this.path.length && (!this.values || this._pastPath != this.path)) {
				this._pastPath = this.path;
				this.values = this.path.split(";");
				if(this.values && this.values.length) {
					for(x=0; x<this.values.length; x++) {
						this.values[x] = this.values[x].split(",");
						this.values[x][0] = parseFloat(this.values[x][0]) || 0;
						this.values[x][1] = parseFloat(this.values[x][1]) || 0;
						this.values[x][0] /= 100;
						this.values[x][1] /= 100;
					}
				}
			}

			if(this.x || this.y) {
				this._x = (parseFloat(this.x) || 0)/100;
				this._y = (parseFloat(this.y) || 0)/100;
			}
		} catch(exception) {
			console.error("Locale[" + this.id + "] Exception: ", exception);
			this.exception = exception.message;
		}
	}
}
