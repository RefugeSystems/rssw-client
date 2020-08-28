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
			console.log("Check Locale Init: ", this.path, " > ", this._pastPath);
			if(this.path && this.path.length && (!this.values || this._pastPath != this.path)) {
				console.log("Init Locale: ", this.path);
				this._pastPath = this.path;
				this.values = this.path.split(";");
				console.log("> Init Locale Paths: ", this.values);
				if(this.values && this.values.length) {
					for(x=0; x<this.values.length; x++) {
						this.values[x] = this.values[x].split(",");
						this.values[x][0] = parseFloat(this.values[x][0].trim()) || 0;
						this.values[x][1] = parseFloat(this.values[x][1].trim()) || 0;
						this.values[x][0] /= 100;
						this.values[x][1] /= 100;
					}
					console.log("> Init Locale Values: ", this.values);
				}
			}
		} catch(exception) {
			this.path_exception = exception;
		}
	}
}
