
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
//		console.log("Received Expression: ", expression, source, base, target);
		if(!source) {
			return expression;
		} else if(!expression) {
//			console.trace("Expressionless Calculation? ", expression, source, base, target);
			return expression;
		}
		
		var processed = expression,
			variables;
		
		while(variables = this.variableExpression.exec(expression)) {
//			console.log("Var Calculation: ", expression, variables);
			if(variables.length === 3 && variables[2] !== undefined && variables[2] !== null) {
				switch(variables[1]) {
					case "character":
					case "entity":
					case "source":
						if(source) {
							processed = processed.replace(variables[0], parseInt(source[variables[2]]) || 0);
						} else {
							console.warn("Unable to calculate with 'source' as it was omitted: " + expression, source, base, target);
						}
						break;
					case "target":
						if(target) {
							processed = processed.replace(variables[0], parseInt(target[variables[2]]) || 0);
						} else {
							console.warn("Unable to calculate with 'target' as it was omitted: " + expression, source, base, target);
						}
						break;
					case "base":
						if(base) {
							processed = processed.replace(variables[0], parseInt(base[variables[2]]) || 0);
						} else {
							console.warn("Unable to calculate with 'base' as it was omitted: " + expression, source, base, target);
						}
						break;
					default:
						console.warn("Calculator - Unknown variable root", expression, variables);
				}
			} else {
				processed = processed.replace(variables[0], parseInt(source[variables[1]]) || 0);
			}
		}
		
		expression = processed;

		if(expression && expression.length < 150 && this.securityExpression.test(expression)) {
			try {
//				console.warn("Calculated: " + expression, variables);
				return eval(expression);
			} catch(ignored) {
				console.error("Exception[" + source.id + "]: " + expression + "\n", ignored);
				return expression;
			}
		} else {
			return expression;
		}
	}
}
