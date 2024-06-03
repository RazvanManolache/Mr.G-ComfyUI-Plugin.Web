Ext.define('MrG.fields.ctrl.TextC', {
	extend: 'MrG.base.ctrl.BaseFieldC',
	
	init: function () {
		this.callParent(arguments);
		this.vm.bind("{textFilter}", this.textFilterChanged, this);
	},
	textFilterChanged: function (value) {
		var selectListStore = this.get("selectListStore");
		if (!selectListStore) return;
		if (value == "") {
            selectListStore.clearFilter();
            return;
		}
		selectListStore.filterBy(function (record) {
			var text = record.get("text");
            if (text.includes(value)) return true;
            return false;
		});	
	},
	
	
	openDialogSelectTexts: function () {
		var me = this;
		var dialog = new MrG.dialog.view.SelectListV({
			_mrgOptions: {
				type: {
					name: 'text',
				},
				fieldType: this.vm.get("fieldType"),
				fieldName: this.vm.get("fieldName"),
				nodeType: this.vm.get("nodeType"),
				mode: 'dialog',
				caller: this,
				value: this.vm.get("value")
			},
			listeners: {
				selectionDone: function () { me.processSelectionResult(...arguments); }
			}
		});
		dialog.show();
	},
	clearList: function () {
		this.set("filteredSelectedRecords",[]);
	},
	addRowToTexts: function () {
		var filteredSelectedRecords = this.get("filteredSelectedRecords");
		var array = [].concat(filteredSelectedRecords);
		var newRow = new MrG.model.SelectListModel({
			uuid: crypto.randomUUID(),
			count: 1,
			selected: true,
			text: ""
		});
		array.push(newRow);
		this.set("filteredSelectedRecords", array);
	},

	
	processSelectionResult: function (rows, replace) {
		
		if (replace) {
			this.set("filteredSelectedRecords", rows);
		}			
		else {
			var filteredSelectedRecords = this.get("filteredSelectedRecords");
			var rowsTexts = rows.map(a => a.get("text"));			
			filteredSelectedRecords.forEach(function (record) {
				var text = record.get("text");
				if (rowsTexts.includes(text)) return;
				rows.push(record);
			});
			this.set("filteredSelectedRecords", rows);
		}
	},
	deleteSelectionRow: function (ctrl, item) {
		var filteredSelectedRecords = this.get("filteredSelectedRecords");
		var array = [];
		filteredSelectedRecords.forEach(function (rec) {
			if (rec.get("uuid") == item.record.get("uuid")) return;
			array.push(rec);
		})
		this.set("filteredSelectedRecords", array);
	},
	selectListStoreDataChanged: function () {
		var selectListStore = this.get("selectListStore");
		var records = selectListStore.getData().items;
		var selSets = records.map(a => {
			return {
				uuid: a.get("uuid"),
				count: a.get("count"),
				selected: a.get("selected"),
				text: a.get("text"),
			}
		});
		this.set("filteredSelectedSets", selSets);
	},
	rowListSelected: function (ctrl, records) {
		if (this.get("readOnlyWorkflow")) return;
		if (records.length > 0) {
			this.set("value",records[0].get("text"));
		}
	}
});
