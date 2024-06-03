Ext.define("MrG.cmp.ctrl.TagPanelC", {
	extend: 'MrG.base.ctrl.BasePanelC',
	init: function () {
		this.callParent(arguments);

	
	},
	
	setDataStore: function (store) {
		this.dataStore = store;
		this.set("dataStore", store)
		this.dataStore.on('datachanged', this.dataStoreDataChanged, this)
		this.dataStoreDataChanged();
	},
	getDataStore: function () {		
		return this.get("dataStore");		
	},
	dataStore: null,
	
	getTagsForRow: function (row) {
		var property = "tags";
		var tags = row.get(property);
		var result = [];
		if (tags) {
			var split = splitText(tags, ',');
			result = arrayMakeDistinct(split);
		}
		return result;
	},
	getTags: function (data) {
		var me = this;
		result = {};
		data.forEach(function (row) {
			var tags = me.getTagsForRow(row);
			tags.forEach(function (tag) {
				if (!result[tag]) {
					result[tag] = {
						count: 0,
						uuids: []
					};
				}
				result[tag].count++;
				result[tag].uuids.push(row.get("uuid"));
			})
		});
		return result;
	},
	tagCnt: 1,
	tagStoreDataChanged: function () {		
		var store = this.get("tagStore");
		var tagCloud = this.lookup("tagCloud");
		var i = 0;
		store.each(function (row) {
			var reference = row.get("reference");
			var btn = this.lookup(reference);
			if (!btn) {
				btn = tagCloud.insert(i,{
					xclass: 'Ext.Button',
					reference: reference,
					text: row.get("name"),
					enableToggle: true,
					hidden: !row.get("visible"),
					badgeText: row.get("badge"),
					handler: 'tagClicked',
					margin: '10 10 0 0',
					record: row
				})
			}
			else {
				btn.setBadgeText(row.get("badge"));
				btn.setHidden(!row.get("visible") && !btn.getPressed());
			}
			i++;
			
		}, this);
		this.buildFilter();
	},
	tagClicked: function (tagButton) {
		tagButton.getRecord().set("pressed", tagButton.getPressed());		
	},
	prevFilter: [],
	prevFilterStore: null,
	buildFilter: function () {
		var tagStore = this.get("tagStore");
		var pressed = tagStore.query("pressed", true);
		var tagOperation = this.get("tagOperation");
		filter = [];
		
		var first = true;
		pressed.each(function (row) {
			var rowUuids = row.get("info").uuids;
			if (tagOperation == "OR") {
				filter = filter.concat(rowUuids);
			}
			else {
				if (first) {
					filter = rowUuids;
					first = false;
				}
				else {
					filter = filter.filter(value => rowUuids.includes(value))
				}
			}
			
		}, this);
		filter = arrayMakeDistinct(filter).sort();

		var filterFn = null;
		if (filter.length) {
			filterFn = function (row) {
				return filter.includes(row.get("uuid"));
			}
		}
		var similarity = this.prevFilter.filter(value => filter.includes(value));
		if (!(this.prevFilter.length == filter.length && filter.length == similarity.length)) {
			this.prevFilter = filter;
			//console.log("setting filter ", filter);
			var dataStore = this.get("dataStore");
			if (this.prevFilterStore)
				dataStore.removeFilter(this.prevFilterStore, filterFn != null);
			if (filterFn != null) {
				this.prevFilterStore = new Ext.util.Filter({
					filterFn: filterFn
				});

				dataStore.addFilter(this.prevFilterStore);
				this.set("hideShowAllButton", false);
			} else {
				this.prevFilterStore = null;				
				this.set("hideShowAllButton", true);
			}
			
		}
		
		
		
	},
	clearFilters: function () {
		var tagStore = this.get("tagStore");
		tagStore.each(function (row) {
			this.lookup(row.get("reference")).setPressed(false);
			row.set("pressed", false);
		}, this);
		
	},
	rebuildButtons: function () {
		var tagStore = this.get("tagStore");
		var data = this.dataStore.getData().items;
		var tags = this.getTags(data);
		var allData = getRawStoreData(this.dataStore);
		var allTags = this.getTags(allData);
		var orOperation = (this.get("tagOperation") == "OR")



		var allTagStoreData = getRawStoreData(tagStore);
		tagStore.suspendEvents(true);
		tagStore.beginUpdate();
		
		allTagStoreData.forEach(function (row) {
			var name = row.get("name");
			if (!allTags[name]) {
				row.set("delete", true);
			} else {
				if (!tags[name] && !orOperation) {
					row.set("visible", false);
				} else {
					row.set("visible", true);
					row.set("badge", orOperation ? allTags[name].count : tags[name].count);
					row.set("info", allTags[name] );
				}
				allTags[name].found = true;
			}
		});
		var toDelete = tagStore.query("delete", true);
		tagStore.remove(toDelete.items);
		var tagCloud = this.lookup("tagCloud");
		toDelete.each(function (item) {
			tagCloud.remove(this.lookup(item.get("reference")));
		}, this);
		for (var tag in allTags) {
			var val = allTags[tag];
			if (!val.found) {
				var filtered = !tags[tag];
				tagStore.add({
					name: tag,
					badge: (orOperation && !filtered) ? val.count : allTags[tag].count,
					visible: !filtered,
					info: tags[tag],
					reference: "tag-" + this.tagCnt
				})
				this.tagCnt++;
			}
		}
		
		tagStore.endUpdate();
		tagStore.resumeEvents(true);
		this.set("hideTagPanel", tagStore.getCount()==0);
	},
	dataStoreDataChanged: function () {
		
		this.rebuildButtons();
		this.tagStoreDataChanged();
	},
	andFilterPressed: function () {
		this.vm.set('tagOperation', 'AND');
		this.dataStoreDataChanged();
	},
	orFilterPressed: function () {
		this.vm.set('tagOperation', 'OR');
		this.dataStoreDataChanged();
	},
	updateTags: function () {
		var me = this;
		var store = this.get("dataStore");
		console.log("updateTags");
	},
	
	
	existingTagButtons: [],
	clearTagFilter: function () {
		this.existingTagButtons.forEach(function (existingTagButton) {
			var button = me.lookup(existingTagButton);
			button.setPressed(false);
		})
	},
	
});