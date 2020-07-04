
/**
 * 
 * 
 * @class rsswParty
 * @constructor
 * @module Components
 */
(function() {
	
	var storageKey = "partystoragekey:";
	
	rsSystem.component("rsswParty", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSComponentUtility,
			rsSystem.components.RSShowdown,
			rsSystem.components.RSCore
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"record": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;

			data.xps = [-5];
			for(x=0; x<=35; x++) {
				data.xps.push(x);
			}

			data.storageKeyID = storageKey + this.record.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"hideMembers": false
			});
			
			data.members = [];
			data.grantXP = 0;
			
			return data;
		},
		"watch": {
			"record": function(incoming, outgoing) {
				outgoing.$off("modified", this.update);
				incoming.$on("modified", this.update);
			},
			"state": {
				"deep": true,
				"handler": function() {
					this.saveStorage(this.storageKeyID, this.state);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			this.record.$on("modified", this.update);
			this.update();
		},
		"methods": {
			"toggleMembers": function() {
				Vue.set(this.state, "hideMembers", !this.state.hideMembers);
			},
			"giveXP": function(amount) {
				var x;
				for(x=0; x<this.members.length; x++) {
					console.log("Give XP[" + amount + "]: " + this.members[x].id);
					this.members[x].commit({
						"xp": this.members[x].xp + parseInt(amount)
					});
				}
				Vue.set(this, "grantXP", 0);
			},
			"update": function() {
				console.log("Party Update: ", this.record);
				var buffer,
					x;
				
				this.members.splice(0);
				if(this.record.entity) {
					for(x=0; x<this.record.entity.length; x++) {
						buffer = this.universe.indexes.entity.index[this.record.entity[x]];
						if(buffer) {
							this.members.push(buffer);
						} else {
							console.warn("Skipped Party[" + this.record.id + "] Member Record[" + x + "] For Non-Existance: " + this.record.entity[x]);
						}
					}
				}
				
				this.members.sort(this.sortData);
			}
		},
		"beforeDestroy": function() {
			this.record.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/party.html")
	});
})();