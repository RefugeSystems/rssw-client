
rsSystem.component = {};
rsSystem.component = function(name, definition) {
	rsSystem.components[name] = Vue.component(name, definition);
};
