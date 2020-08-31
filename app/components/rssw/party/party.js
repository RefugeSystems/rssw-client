
/**
 * 
 * 
 * @class rsswParty
 * @constructor
 * @module Components
 */
(function() {
	
	var storageKey = "partystoragekey:",
		credits = [],
		xps = [],
		i,
		j,
		k;

	credits = [-100000, -90000, -80000, -70000, -60000, -50000, -40000, -30000, -20000, -10000, -9000, -8000, -7000, -6000, -5000, -4000, -3000, -2000, -1000, -900, -800, -700, -600, -500, -450, -400, -350, -300, -250, -200, -150, -100, -90, -80, -70, -60, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, -4, -3, -2, -1, 0];
	for(i=credits.length-2; i>=0; i--) {
		credits.push(-1 * credits[i]);
	}

	xps = [-5];
	for(i=0; i<=35; i++) {
		xps.push(i);
	}
	
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
			},
			"entities": {
				"type": Array,
				"default": function() {
					var list = [].concat(this.universe.indexes.entity.listing);
					list.sort(this.sortData);
					return list;
				}
			}
		},
		"data": function() {
			var data = {},
				x;

			data.credits = credits;
			data.xps = xps;

			data.storageKeyID = storageKey + this.record.id;
			data.state = this.loadStorage(data.storageKeyID, {
				"hideMembers": false
			});
			
			data.newOrder = null;
			data.move_location = "";
			data.addingMember = "";
			data.location = null;
			data.members = [];
			data.grantCredit = 0;
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
			"displayOption": function(option) {
				return !option.template && !option.inactive && (!this.record.entity || this.record.entity.indexOf(option.id) === -1); 
			},
			"setLocation": function() {
				this.record.setLocation(this.move_location);
				Vue.set(this, "move_location", "");
			},
			"changeOrder": function(order) {
				this.record.commit({
					"order": order
				});
			},
			"giveCredits": function(credits) {
				var update = {},
					x;
				
				if(this.record.entity) {
					update.delta = {};
					update.delta.credits = credits;
					update._type = "entity";
					for(x=0; x<this.record.entity.length; x++) {
						update.id = this.record.entity[x];
						this.universe.send("modify:entity:detail:additive", update);
					}
				}

				Vue.set(this, "grantCredit", 0);
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
			"removeMember": function(member) {
				this.record.removeMember(member);
			},
			"addMember": function(member) {
				this.record.addMember(member);
				Vue.set(this, "addingMember", 0);
			},
			"update": function() {
//				console.log("Party Update: ", this.record);
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
				
				Vue.set(this, "location", this.universe.indexes.location.index[this.record.location]);
				Vue.set(this, "newOrder", this.record.order);
			}
		},
		"beforeDestroy": function() {
			this.record.$off("modified", this.update);
		},
		"template": Vue.templified("components/rssw/party.html")
	});
})();