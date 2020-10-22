
/**
 *
 *
 * @class RSSWJournalView
 * @constructor
 * @module Pages
 */
rsSystem.component("rsswJournalView", {
	"inherit": true,
	"mixins": [
		rsSystem.components.RSComponentUtility,
		rsSystem.components.RSCore
	],
	"data": function() {
		var data = {};

		data.related = [];

		data.known = new SearchIndex();
		data.activeEntity = null;
		data.entityList = [];
		data.entities = {};
		data.entries = [];
		data.shown = [];
		data.root = {};
		data.root.selected = [];

		data.field = {};
		data.field.label = "Filter by Knowns";
		data.field.property = "selected";
		data.field.source_index = data.known;
		data.field.type = "multireference";
		data.field.optionLabel = "name";
		data.field.optionValue = "id";
		data.field.autocomplete = true;
		data.field.uniqueness = true;

		return data;
	},
	"mounted": function() {
		rsSystem.register(this);
		this.update();
	},
	"methods": {
		"filterEntries": function() {
			var buffer,
				entry,
				x;

			this.shown.splice(0);
			for(x=0; x<this.entries.length; x++) {
				entry = this.entries[x];
				if((!this.root.selected.length || (entry.related && entry.related.length && this.root.selected.difference(entry.related).length === 0)) &&
						(!this.activeEntity || entry.editor === this.activeEntity)) {
					this.shown.push(entry);
				}
			}
		},
		"openEntry": function(entry) {
			this.showInfo(entry, this.activeEntity?this.entities[this.activeEntity]:undefined);
		},
		"focusEntity": function(entity) {
			console.log("Focus: ", entity);
			if(this.activeEntity !== entity.id) {
				Vue.set(this, "activeEntity", entity.id);
			} else {
				Vue.set(this, "activeEntity", null);
			}
			this.filterEntries();
		},
		"update": function() {
			var track = {},
				buffer,
				e,
				x;

			for(x=0; x<this.entityList.length; x++) {
				Vue.delete(this.entities, this.entityList[x]);
			}
			this.entityList.splice(0);
			for(x=0; x<this.universe.indexes.entity.listing.length; x++) {
				if(this.universe.indexes.entity.listing[x] && this.universe.indexes.entity.listing[x].owners && this.universe.indexes.entity.listing[x].owners.indexOf(this.player.id) !== -1) {
					Vue.set(this.entities, this.universe.indexes.entity.listing[x].id, this.universe.indexes.entity.listing[x]);
					this.entityList.push(this.universe.indexes.entity.listing[x]);
				}
			}

			this.known.clearIndex();
			for(x=0; x<this.entityList.length; x++) {
				// this.known.indexItem(this.entityList[x]);
				for(e=0; e<this.entityList[x]._knownKeys.length; e++) {
					buffer = this.universe.index.index[this.entityList[x]._knownKeys[e]];
					if(buffer && !buffer.obscured && !track[buffer.id]) {
						this.known.indexItem(buffer);
						track[buffer.id] = true;
					}
				}
			}

			this.entries.splice(0);
			for(x=0; x<this.universe.indexes.journal.listing.length; x++) {
				if(this.universe.indexes.journal.listing[x] && this.entities[this.universe.indexes.journal.listing[x].editor]) {
					this.entries.push(this.universe.indexes.journal.listing[x]);
				}
			}

			this.known.listing.sort(this.sortData);
			this.entityList.sort(this.sortData);
			this.entries.sort(this.sortData);

			this.filterEntries();
		}
	},
	"template": Vue.templified("components/rssw/journal/view.html")
});
