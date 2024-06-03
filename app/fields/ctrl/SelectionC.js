Ext.define('MrG.fields.ctrl.SelectionC', {
	extend: 'MrG.base.ctrl.BaseFieldC',
	
	init: function () {
		
		this.callParent(arguments);		
		this.vm.bind("{negateList}", this.filteredItemsChanged, this);
		this.vm.bind("{globalDataStore}", this.filteredItemsChanged, this);
		this.vm.bind("{optionSelected}", this.filteredItemsChanged, this);
		this.vm.bind("{filteredSelectedUUIDs}", this.filteredSelectedUUIDsChanged, this);
	},
	filteredSelectedUUIDsChanged: function () {
		var selectListStore = this.get("selectListStore");
		var filteredSelectedRecords = this.get("_filteredSelectedRecords");
		selectListStore.loadData(filteredSelectedRecords);
		
	},
	selectListStoreDataChanged: function () {
		
		var selectListStore = this.get("selectListStore");
		
		var selSets = selectListStore.getData().items.map(a => {
			return {
				count: a.get("count"),
				comfy_name: a.get("comfy_name"),
				uuid: a.get("uuid"),
				alias: a.get("alias"),
			}
		});
		this.set("_filteredSelectedSets", selSets);
		this.filteredItemsChanged();
	},
	filteredItemsChanged: function () {
		var globalDataStore = this.get("globalDataStore");
		var negateList = this.get("negateList");		
		var selectListStore = this.get("selectListStore")
		var rows = selectListStore.queryBy(a => true);
		var filteredSelectedUUIDs = rows.items.map(a => a.get("comfy_name"));

		var records = globalDataStore.queryBy(function (rec) {
			if (filteredSelectedUUIDs && filteredSelectedUUIDs.length > 0) {
				if (filteredSelectedUUIDs.includes(rec.get("comfy_name"))) {
					return !negateList;
				} else {
					return negateList;
				}
			}
			return true;
		});
		
		var records = records.items.map(a => a.clone());
		if (negateList) {
			records.forEach(function (rec) {
				rec.set("count", 1);
			})
		} else {
			records.forEach(function (rec) {
				var found = selectListStore.queryBy((a) => a.get("comfy_name") == rec.get("comfy_name"));
				if (found && found.length>0)
					rec.set("count", found.items[0].get("count"));
			})
			
		}
		
		this.set("comboSelectRecords", records);
		var comboSelectStore = this.get("comboSelectStore");
		comboSelectStore.loadData(records);
		if (records.length == 0) {
			this.set("negateList", !negateList);
		}
	},
	updateField: function () {
		
	},
	openDialogSelectList: function () {
		var me = this;
		var dialog = new MrG.dialog.view.SelectListV({
			_mrgOptions: {
				type: {
					name: 'selection',
				},
				fieldType: this.vm.get("fieldType"),
				fieldName: this.vm.get("fieldName"),
				nodeType: this.vm.get("nodeType"),
				mode: 'dialog',
				caller: this,
				values: this.vm.get("valuesComboText")
			},
			listeners: {
				selectionDone: function () { me.processSelectionResult(...arguments); }
			}
		});
		dialog.show();
	},
	setFieldValues: function (conf) {
		if (!conf) return;
		this.callParent(arguments);
	},
	clearList: function () {
		this.set("filteredSelectedRecords", []);
	},	
	processSelectionResult: function (rows, replace) {
		if (replace) {
			this.set("filteredSelectedRecords", rows);
		}
		else {
			var filteredSelectedRecords = this.get("filteredSelectedRecords");
			var result = [].concat(filteredSelectedRecords);
			var existingItems = filteredSelectedRecords.map(a => a.get("uuid"));
			rows.forEach(function (row) {
				if (!existingItems.includes(row.get("uuid"))) {
					result.push(row);
				}
			});
			this.set("filteredSelectedRecords", result);
		}
			
	},	
	deleteSelectionRow: function (ctrl, item) {
		var uuid = item.record.get("uuid");
		var filteredSelectedUUIDs = this.get("filteredSelectedUUIDs");		
		this.set("filteredSelectedUUIDs", clone(removeItemAll(filteredSelectedUUIDs, uuid)));
	},
	rowListSelected: function (ctrl, records) {
		if (this.get("readOnlyWorkflow")) return;
		if (!this.get("negateList")) {
			if (records.length > 0) {
				var uuid = records[0].get("uuid");
				this.set("selectedUUID", uuid);
			}
		}		
	},
	galeryItemTap: function (ctrl, event) {
		var uuid = event.record.get("uuid");
		this.set("selectedUUID", uuid);
	}
});
