

/**
 * 
 * @class RSShowdown
 * @constructor
 * @module Common
 * @see Showdown: https://www.npmjs.com/package/showdown
 * @see Markdown: https://www.markdownguide.org/
 */
(function() {
	var converter = new showdown.Converter();

	var marking = {
		"start": "${",
		"end": "}$"
	};
	
	var formatMarkdown = function(sourceText, universe, character) {
		var properties = {},
			tracking,
			element,
			target,
			value,
			index,
			mark,
			end,
			x;

		index = sourceText.indexOf(marking.start);
		while(index !== -1 && (end = sourceText.indexOf(marking.end, index)) !== -1 && index + 3 < end) {
			tracking = sourceText.substring(index, end + 2);
			target = sourceText.substring(index + 2, end);
			
			mark = target.indexOf(",");
			if(mark === -1) {
				value = target;
			} else {
				value = target.split(",");
				switch(value.length) {
					default:
					case 3:
						properties.id = value[2];
					case 2:
						properties.classes = value[1];
					case 1:
						value = value[0];
				}
			}
			
			if(value) {
				
				if(value[0] === "=") {
					// Calculate
					value = value.substring(1);
					// TODO: Calculate Value with Calculator
					
					element = $("<span class=\"calculated-result rendered-value \">" + value + "</span>");
					
				} else {
					// Linked
					mark = universe.index.index[value];
					if(mark) {
						element = $("<a class=\"rendered-value\" data-id=\"" + (properties.id || mark.id) + "\">" + value + "</a>");
					} else {
						element = $("<span class=\"calculated-result rendered-value not-found\">" + value + "[Not Found]</span>");
					}
				}
				
				if(properties.classes) {
					element.css(properties.classes);
				}
				
				sourceText = sourceText.replace(tracking, element[0].outerHTML);
			}
			
			index = sourceText.indexOf(marking.start, index + 1);
		}
		
		return sourceText;
	};
	
	rsSystem.component("RSShowdown", {
		"inherit": true,
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"methods": {
			"rsshowdown": function(sourceText, entity) {
				return converter.makeHtml(formatMarkdown(sourceText, this.universe, entity));
			}
		}
	});
})();
