
/**
 * 
 * 
 * @class rsswEntityJournal
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_journalComponentKey";
	
	rsSystem.component("rsswEntityDescription", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSSWStats,
			rsSystem.components.RSCore
		],
		"props": {
			"entity": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			
			data.storageKeyID = storageKey + this.entity.id;
	
			data.mdDescription = null;
			data.description = "";
			data.state = this.loadStorage(data.storageKeyID, {
				"viewing": false
			});
			
			
			return data;
		},
		"watch": {
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
		
			this.$el.onclick = (event) => {
				var follow = event.srcElement.attributes.getNamedItem("data-id");
				if(follow && (follow = this.universe.index.index[follow.value]) && this.isOwner(follow)) {
					rsSystem.EventBus.$emit("display-info", follow);
				}
			};

			this.entity.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"toggleDescription": function() {
				if(this.state.viewing) {
					Vue.set(this.state, "viewing", false);
				} else {
					Vue.set(this, "mdDescription", this.rsshowdown(this.entity.description, this.entity));
					Vue.set(this.state, "viewing", true);
				}
			},
			"changed": function(property, value) {
				var change = {};
				change[property] = value;
				this.entity.commit(change);
			},
			"update": function() {
				if(this.entity.description) {
					Vue.set(this, "mdDescription", this.rsshowdown(this.entity.description, this.entity));
				}
				if(this.entity.description != this.description) {
					Vue.set(this, "description", this.entity.description);
				}
			}
		},
		"beforeDestroy": function() {
			this.entity.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/character/description.html")
	});
})();