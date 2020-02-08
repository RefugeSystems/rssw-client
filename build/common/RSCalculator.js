
/*
 * Device | Character | Item - Level locking for display calculated vs display formula
 * Info display events support objects that specify record & entity to support calculated displays
 * 		Feed entity from source click
 * Fix null reference possibilities in the Information Panel
 */

/**
 * 
 * @class RSCalculator
 * @constructor
 * @param {RSUniverse} universe 
 */
class RSCalculator {
	constructor(universe) {
		this.variableExpression = new RegExp("([a-z_]+)\.?([a-z_]+)?", "g");
		this.securityExpression = /^[<>a-zA-Z0-9\(\)+-\/\* ]*$/;
		this.universe = universe;
	}

	/**
	 * 
	 * @method display
	 * @param {String} expression 
	 * @param {RSObject} [source] 
	 * @param {Object} [base] 
	 * @param {Object} [target] 
	 * @return {Number} 
	 */
	display(expression, source, base, target) {
		
	}
	
	/**
	 * 
	 * @method process
	 * @param {String} expression 
	 * @param {RSObject} source 
	 * @param {Object} [base] 
	 * @param {Object} [target] 
	 * @return {Number} 
	 */
	process(expression, source, base, target) {
		if(!source) {
			return expression;
		}
		
		var variables;
		
		while(variables = this.variableExpression.exec(expression)) {
			if(variables.length === 3 && variables[2] !== undefined && variables[2] !== null) {
				console.log("Var Calculation: ", variables);
				switch(variables[1]) {
					case "character":
					case "entity":
					case "source":
						expression = expression.replace(variables[0], parseInt(source[variables[2]]) || 0);
						break;
					case "target":
						expression = expression.replace(variables[0], parseInt(target[variables[2]]) || 0);
						break;;
					case "base":
						expression = expression.replace(variables[0], parseInt(base[variables[2]]) || 0);
						break;
					default:
						console.warn("Calculator - Unknown variable root", variables);
				}
			} else {
				expression = expression.replace(variables[0], parseInt(source[variables[1]]) || 0);
			}
		}

		if(expression && expression.length < 150 && this.securityExpression.test(expression)) {
			try {
//				console.warn("Calculated: " + expression, variables);
				return eval(expression);
			} catch(ignored) {
				console.error("Exception: ", ignored);
				return expression;
			}
		} else {
			return expression;
		}
	}
}
