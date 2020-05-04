
rsSystem.components = {};
rsSystem.component_classifications = {};
rsSystem.component = function(name, definition, classification) {
	rsSystem.components[name] = Vue.component(name, definition);
	
};
