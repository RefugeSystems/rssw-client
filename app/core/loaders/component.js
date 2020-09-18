
rsSystem.components = {};
rsSystem.component_classifications = {};
rsSystem.component = function(name, definition, classification) {
	if(!definition.watch) {
		definition.watch = {};
	}
	if(!definition.watch.state) {
		definition.watch.state = {
			"deep": true,
			"handler": function() {
				if(this.storageKeyID && this.state && typeof(this.saveStorage) === "function") {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		};
	}

	rsSystem.components[name] = Vue.component(name, definition);

};
