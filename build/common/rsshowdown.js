

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

	var mdWorldLink = new RegExp(":::/", "ig");
	
	var formatDnDMark = function(character, mark) {
		
	};
	
	var formatMarkdown = function(character, world, sourceText) {
		var tracking,
			element,
			target,
			value,
			index,
			mark,
			keys,
			end,
			x;
		
		sourceText = sourceText.replace(mdWorldLink, location.protocol + "//" + location.host + "/#/worlds/aq/" + world.id + "/");
		index = sourceText.indexOf(marking.start);
		while(index !== -1 && (end = sourceText.indexOf(marking.end, index)) !== -1 && index + 3 < end) {
			tracking = sourceText.substring(index, end + 2);
			try {
				target = sourceText.substring(index + 1, end + 1);
				mark = JSON.parse(target);
				
				element = $("<span/>");
				
				keys = Object.keys(mark);
				for(x=0; x<keys.length; x++) {
					switch(keys[x]) {
						case "class":
							element.addClass(mark[keys[x]]);
							break;
						case "content":
						case "text":
						case "value":
							element.html(mark[keys[x]]);
							break;
						case "roll":
							if(mark.repeat) {
								value = $("<span/>");
								value.html(mark[keys[x]] + " ( ");
								element.append(value);
								
								value = $("<span/>");
								value.addClass(mark.repeat);
								value.html(RSCalculator.reduceDiceRoll(mark[keys[x]], character));
								element.append(value);
								
								value = $("<span> )</span>");
								element.append(value);
							} else {
								element.html(RSCalculator.reduceDiceRoll(mark[keys[x]], character));
							}
							break;
					}
				}
				
				if(mark.pre) {
					sourceText = sourceText.replace(tracking, element[0].innerHTML);
				} else {
					sourceText = sourceText.replace(tracking, element[0].outerHTML);
				}
				
			} catch(ignore) { // TODO: Parse to warning later
				target = sourceText.substring(index + 2, end);
				value = target.indexOf(",");
				if(value === -1) {
					mark = RSCalculator.reduceDiceRoll(target, character);
					if(mark !== undefined && mark !== null) {
						sourceText = sourceText.replace(tracking, mark);
					}
				} else {
					target = target.split(",");
					mark = RSCalculator.reduceDiceRoll(target[0].trim(), character);
					if(mark !== undefined && mark !== null) {
						element = $("<span style=\"color:" + target[1] + "\">" + mark + "</span>");
						sourceText = sourceText.replace(tracking, element[0].outerHTML);
					}
				}
			}
			
			index = sourceText.indexOf(marking.start, index + 1);
		}
		
		return sourceText;
	};
	
	rsSystem.component("RSShowdown", {
		"inherit": true,
		"props": {
			"character": {
				"required": true,
				"type": Object
			},
			"world": {
				"required": true,
				"type": Object
			}
		},
		"methods": {
			"rsshowdown": function(sourceText) {
				return converter.makeHtml(formatMarkdown(this.character, this.world, sourceText));
			}
		}
	});
})();
