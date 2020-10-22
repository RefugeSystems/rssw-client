/**
 * 
 * @class RSLocale
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSLocale extends RSObject {
	constructor(details, universe) {
		super(details, universe);
		this._alterationLookup = {};
	}
	
	recalculateHook() {
		var x;

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
