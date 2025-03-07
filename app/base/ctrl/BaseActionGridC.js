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
		var gridItems = this.get("selectedGridItems");
		var type = this.getTypeGrid();
		
		if (!Array.isArray(gridItems))
			gridItems = [gridItems];

		gridItems.forEach(function (gridItem) {
			this.view.fireEventArgs("openGridItem", [type, this.view.getTitle(), gridItem]);
		}, this);
		
	},
	newGridItem: function () {
		var type = this.getTypeGrid();
		this.view.fireEventArgs("newGridItem", [type, this.view.getTitle()]);
    
	},
	openFileGridItem: function () {
		var type = this.getTypeGrid();
		this.view.fireEventArgs("openFileGridItem", [type, this.view.getTitle()]);
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

		this.updateSelectedGridItems();
	},
	
	clearEditGridItem: function () {
		this.set("editedGridItem", null);
	},
	beforeEditGridItem: function () {
		if (this.get("selectionMode")) return false;
	},
	getSelectedGridItems: function () {
		return this.lookup('gridItemList').getSelection();
	},
	updateSelectedGridItems: function () {
		var gridItems = this.getSelectedGridItems();
		this.set("selectedGridItems", gridItems);
	},
	gridItemDeselected: function () {
		this.updateSelectedGridItems();
	},
	gridItemSelected: function (ctrl, records) {
		this.updateSelectedGridItems();
	},
	deleteItem: function (item) {
		var me = this;
		item.erase({
			failure: function (record, operation) {
				Ext.Msg.alert('Error', 'Could not delete gridItem.');
			},
			callback: function (record, operation, success) {
				me.set('editFormVisible', false);
			}
		});
	},
	deleteItems: function (items) {
		if (!items.length) {
            items = [items];
		}
		items.forEach(function (item) {
			this.deleteItem(item);
		}, this);
	},
	refreshGrid: function () {
		var store = this.getGridItemStore();
        store.load();
	},
	deleteGridItem: function () {
		var me = this;
		var selectedGridItems = this.get("selectedGridItems");
		var store = this.getGridItemStore();
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete?',
			function (answer) {
				if (answer == 'yes') {
					me.deleteItems(selectedGridItems);
				}
			});
	},
	saveGridItem: function () {
		var editedGridItem = this.get('editedGridItem');
		this.set("selectedGridItems", editedGridItem);
		var store = this.getGridItemStore();
		editedGridItem.save({
			failure: function (record, operation) {
				Ext.Msg.alert('Error', 'Could not save gridItem.');
			},
			callback: function (record, operation, success) {
				store.load();
			}
		});

		this.set('editFormVisible', false);
	},
	cancelEditGridItem: function () {
		this.set('editFormVisible', false);
		this.clearEditGridItem();
	},
	editGridItem: function () {
		this.updateSelectedGridItems();
		this.set('editFormVisible', true);
	},

});