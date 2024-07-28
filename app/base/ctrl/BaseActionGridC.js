Ext.define('MrG.base.ctrl.BaseActionGridC', {
	extend: 'MrG.base.ctrl.BaseC',
	getGridItemStore() {
		var type = this.getTypeGrid();
		var store = this.get(type + 'Store');
		if(!store){
            return this.get('emptyStore');
		}
		return store;
	},
	getTypeGrid: function () {
		return this.get("typeGrid");
    },
	openGridItem: function () {
		if(this.get("selectionMode")) return;
		var gridItem = this.get("selectedGridItem");
		var type = this.getTypeGrid();
		this.view.fireEventArgs("openGridItem", [type, gridItem]);
	},
	newGridItem: function () {
		var type = this.getTypeGrid();
		this.view.fireEventArgs("newGridItem", [type]);
    
	},
	openFileGridItem: function () {
		var type = this.getTypeGrid();
		this.view.fireEventArgs("openFileGridItem", [type]);
	},
	searchValueChanged: function (ctrl, val) {
		if (val.length == 0) {
			this.set("searchFilter", null);
		}
		else {
			var attributes = ["text", "tags", "description", "comments"]
			filterFn = function (row) {
				return searchInAttributes(val, row, attributes);
			}
			this.set("searchFilter", filterFn)
		}
		this.applyFilters();
	},
	applyFilters: function () {
		//this.makeTagFilter();
		var searchFilterFn = this.get("searchFilter")
		var categoryFilterFn = this.get("categoryFilter");
		var gridItemStore = this.getGridItemStore();
		var searchFilter = null;
		var categoryFilter = null;

		if (searchFilterFn) {
			searchFilter = new Ext.util.Filter({
				filterFn: searchFilterFn
			});
		}
		if (categoryFilterFn) {
			categoryFilter = new Ext.util.Filter({
				filterFn: categoryFilterFn
			});
		}

		if (this.prevSearchFilter) {
			gridItemStore.removeFilter(this.prevSearchFilter,
				searchFilter != null || this.prevCategoryFilter != null || categoryFilter != null);
		}
		if (searchFilter) {
			this.prevSearchFilter = searchFilter;
			gridItemStore.addFilter(this.prevSearchFilter, this.prevCategoryFilter != null || categoryFilter != null);
		} else {
			this.prevSearchFilter = null;
		}

		if (this.prevCategoryFilter) {
			gridItemStore.removeFilter(this.prevCategoryFilter, categoryFilter != null);
		}
		if (categoryFilter) {
			this.prevCategoryFilter = categoryFilter;
			gridItemStore.addFilter(this.prevCategoryFilter, false);
		}
		else {
			this.prevCategoryFilter = null;
		}


		selected = this.get("selectedGridItem");
		if (gridItemStore.indexOf(selected) == -1) {
			this.setSelectedGridItem(null);
		}
	},
	setSelectedGridItem: function (val) {
		this.set("selectedGridItem", val);
		if (val) {
			this.set("editedGridItem", val.clone())
		} else {
			this.clearEditGridItem();
		}
	},
	clearEditGridItem: function () {
		this.set("editedGridItem", null);
	},
	beforeEditGridItem: function () {
		if (this.get("selectionMode")) return false;
	},
	gridItemDeselected: function () {
		this.set("selectedGridItem", null);
	},
	gridItemSelected: function (ctrl, records) {
		if (records.length > 0) {
			this.setSelectedGridItem(records[0]);
		}
		else {
			this.setSelectedGridItem(null);
		}
	},
	deleteGridItem: function () {
		var me = this;
		var selectedGridItem = this.get("selectedGridItem");
		var store = this.getGridItemStore();
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete the "' + selectedGridItem.get("name") + '" gridItem ?',
			function (answer) {
				if (answer == 'yes') {
					selectedGridItem.erase({
						failure: function (record, operation) {
							Ext.Msg.alert('Error', 'Could not delete gridItem.');
						},
						callback: function (record, operation, success) {
							me.set('editFormVisible', false);
						}
					});
				}
			});
	},
	saveGridItem: function () {
		var editedGridItem = this.get('editedGridItem');
		this.set("selectedGridItem", editedGridItem);
		var store = this.getGridItemStore();
		editedGridItem.save({
			failure: function (record, operation) {
				Ext.Msg.alert('Error', 'Could not save gridItem.');
			},
			callback: function (record, operation, success) {
				store.reload();
			}
		});

		this.set('editFormVisible', false);
	},
	cancelEditGridItem: function () {
		this.set('editFormVisible', false);
		this.clearEditGridItem();
	},
	editGridItem: function () {
		this.setSelectedGridItem(this.get("selectedGridItem"));
		this.set('editFormVisible', true);
	},

});