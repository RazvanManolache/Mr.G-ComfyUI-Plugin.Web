Ext.define('MrG.dialog.ctrl.SelectListC', {
	extend: 'MrG.base.ctrl.BasePanelC',	
	store: null,
	caller: null,
	init: function () {
		this.callParent(arguments);

		
		var options = this.view._mrgOptions;

		//for tests
		if (!options) {
			options = {
				type: {
					name: 'text',
				},
				//value: '256,512,768',
				fieldType: 'sampler_name',
				nodeType: 'KSampler',
				mode: 'dialog',
				caller: null
			};
		}

		
		this.caller = options.caller;
		

		
		switch (options.mode) {
			case 'tab':
				this.view.setWidth('100%');
				this.view.setHeight('100%');
				this.view.setResizable(false);
				this.view.setCentered(false);
				this.view.setModal(false);
				this.view.setFloated(false);
				break;
			default:
		}
		var containerGrid = this.lookup("containerGrid");
		this.set("selectType", options.type.name);
		var xclassGrid = "";
		this.set("fieldType", options.fieldType);
		this.set("nodeType", options.nodeType);
		this.set("fieldName", options.fieldName);
		
		switch (options.type.name) {
			case 'number':
				xclassGrid = 'MrG.grd.sel.NumberGrid';
				this.set("hideSelectCountColumn", true);
				this.set("hideTextColumn", false);
				this.set("hideAliasColumn", false);
				this.set("validationType", true);
				if (options.fieldType == "INT") {
					this.lookup("textArea").stripCharsRe = /[^0-9,]/g
				} else {
					this.lookup("textArea").stripCharsRe = /[^0-9.,]/g
				}
				
				break;
			case 'text':
				xclassGrid = 'MrG.grd.sel.TextGrid';
				this.set("hideTextColumn", false);
				this.set("hideSelectCountColumn", true);
				break;
			case 'selection':
				xclassGrid = 'MrG.grd.sel.ListGrid';
				this.set("hideAdd", true);
				this.set("hideEditColumn", true);
				this.set("hideDescriptionColumn", false);
				this.set("hidePathColumn", false);
				this.set("hideDeleteColumn", true);
				
				this.set("isSelection", true);
				break;
			case 'preset':
				xclassGrid = 'MrG.grd.sel.PresetGrid';
				this.set("hideAdd", true);
				this.set("hideSelectCountColumn", true);
				this.set("hideEditColumn", true);
				this.set("hideDescriptionColumn", false);
				this.set("hidePathColumn", true);
				this.set("hideDeleteColumn", false);
				break;
			default:
				console.error("should not happen");
		}
		containerGrid.add({
			xclass: xclassGrid,
			flex: 1,
			width: '100%',
			plugins: {
				rowedit: {
					autoConfirm: false
				}
			},
		});

		this.store = this.get("selectListStore");

		this.loadData();
		this.makeNewEditObject();
		var tags = "";
		if (options.fieldName) tags += options.fieldName;
		//if (options.fieldType) {
		//	if (tags) tags += ",";
		//	tags += options.fieldType.toLowerCase();
		//}
		this.bind("{editedObject.text}", this.textAreaValueChanged, this);
		this.vm.get('editedObject').set("tags", tags);
		
		if (options.value) {
			this.get('editedObject').set("text", options.value);
			
		}
		
	},
	justOpened: true,
	firstLoad: true,
	makeNewEditObject: function () {
		var old = this.get("editedObject");		
		
		var editedObject = new MrG.model.SelectListModel({
			uuid: crypto.randomUUID(),
			name: '',
			comfy_name: '',
			text: old ? old.get("text") : "",
			alias: old ? old.get("alias") : "",
			field_type: 'MRG_'+this.get("fieldType"),
			field: this.get("fieldName"),
			node_type: this.get("nodeType"),
			tags: old ? old.get("tags") : "",
		});
		//this.set("origEditedObject", null);
		this.set("editedObject", editedObject);
	},
	getSelectedRows: function () {
		var result = [];
		var data = getRawStoreData(this.store);
		var selectType = this.get("selectType")
		data.forEach(function (row) {
			if (row.get("selected")) {
				if (row.get("count") <= 0)
					row.set("count", 1);
				result.push(row);
			}
			
		});
		return result;
	},
	selectionAdd: function () {
		var result = this.getSelectedRows();
		this.fireViewEventArgs("selectionDone", [result, false]);
		//this.caller.processSelectionResult(result, false);
		this.view.close();
	},
	selectionReplace: function () {
		var result = this.getSelectedRows();
		this.fireViewEventArgs("selectionDone", [result, true]);
		//this.caller.processSelectionResult(result, true);
		this.view.close();
	},
	simpleSelection: function () {
		this.vm.set("hideSelectColumn", false);
		this.vm.set("hideSelectCountColumn", true);
	},
	weightedSelection: function () {
		this.vm.set("hideSelectColumn", true);
		this.vm.set("hideSelectCountColumn", false);
	},
	
	showingSelector: function () {
		console.log("showingSelector", arguments);
	},
	selectionCanceled: function () {
		this.view.close();
	},
	prevSearchFilter: null,
	searchValueChanged: function (ctrl, val) {
		var attributes = ["text", "tags", "description", "comments"]
		var filterFn = val ? function (row) {
			return searchInAttributes(val, row, attributes);
		}: null;
		if (this.prevSearchFilter) {
			this.store.removeFilter(this.prevSearchFilter, filterFn!=null);
		}
		if (filterFn) {
			this.prevSearchFilter = new Ext.util.Filter({
				filterFn: filterFn
			});
			this.store.addFilter(this.prevSearchFilter);
		} else {
			this.prevSearchFilter = null;
		}
		
		
	},
	hideRow: function (ctrl, cell) {
		var me = this;
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to hide this record ?',
			function (answer) {
				if (answer == 'yes') {
					cell.record.set("hidden", true);
					me.getData();
				}
			});

	},
	deleteSelectionRow: function (ctrl, cell) {
		var me = this;
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete this record ?',
			function (answer) {
				if (answer == 'yes') {
					me.deleteRowInternal(cell.record);
				}
			});
		
	},
	
	//deleteSelected: function () {
	//	var rows = []
	//	var me = this;
	//	getRawStoreData(this.store).forEach(function (item) {
	//		if (item.get("selected")) {
	//			rows.push(item)
	//		}
	//	})
	//	Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete ' + rows.length + ' record(s) ?',
	//		function (answer) {
	//			if (answer == 'yes') {
	//				rows.forEach(function (row) {
	//					me.deleteRowInternal(row);
	//				})
	//			}
	//		});


	//},
	editSelectionRow: function (ctrl, ev) {
		this.rowSelectedInternal(ev.record);
		this.set("editCollapsed", false);
	},
	rowListSelected: function (ctrl, selection) {
		if (selection.length > 0) {
			this.rowSelectedInternal(selection[0])
		}
		else {
			this.rowSelectedInternal(null);
		}
	},
	rowSelectedInternal: function (record) {
		if (record) {
			this.set("editedObject", record.copy());
			this.set("origEditedObject", record);
			this.set("hideReplaceRecord", false);
			if (this.vm.get('clickToSelect')) {
				record.set("selected", !record.get("selected"))
			}
		}
		else {
			this.makeNewEditObject();
			this.set("hideReplaceRecord", true);
		}
	},
	replaceRecord: function () {
		var origEditedObject = this.get("origEditedObject");
		var editedObject = this.get("editedObject");
		origEditedObject.beginEdit();
		origEditedObject.getFields().forEach(function (field) {
			var fname = field.getName();
			if (fname != "uuid") {
				origEditedObject.set(fname, editedObject.get(fname));
			}
		});
		origEditedObject.endEdit();
	},
	updateSelected: function () {

		var data = getRawStoreData(this.store);
			
		var cnt = data.filter(a => a.get("selected")).length;
		this.vm.set("selectedCount", cnt);
		
	},
	invertSelection: function () {
		var data = getRawStoreData(this.store);
		data.forEach(function (item) {
			item.set('selected', !item.get('selected'));
			row.set("count", row.get("count")>0?0:1);
		})
	},
	clearSelection: function () {
		var data = getRawStoreData(this.store);
		data.forEach(function (row) {
			row.set('selected', false);
			row.set("count", 0);
		})
	},
	deselectVisible: function () {
		
		this.store.each(function (row) {
			row.set("selected", false);
			row.set("count", 0);
		});
	},
	selectVisible: function () {		
		this.store.each(function (row) {
			row.set("selected", true);
			if (row.get("count") <= 0) {
				row.set("count", 1);
			}
		});
		
	},
	textAreaValueChanged: function () {
		var value = this.lookup('textArea').getValue();//this.get("editedObject").get("text")
		var found = this.checkSeries(value);
		//scroll to record if found, because you're not going to be able to add another one
		if (found) {
			var grid = this.lookup('containerGrid').getItems().first();
			if (this.store.indexOf(found)!=-1)
				grid.scrollToRecord(found);
		}
		var wasFound = found != null;
		//not really happy with this logic
		this.set("disableAddAsNew", wasFound);
		if (this.justOpened && !this.firstLoad) {
			this.set("editCollapsed", wasFound);
			this.justOpened = false;
		}
		if (wasFound) {
			return 'value already exists';
		}
		return true;
		
	},
	checkSeries: function (val) {
		val = ""+val
		var data = getRawStoreData(this.store);
		var found = null;
		var trimmed = val.trim();
		data.forEach(function (item) {
			if (item.get("text") == trimmed)
				found = item;
		});
		return found;
	},
	tagFieldValueChanged: function () {
	},
	addAsNew: function () {
		var editedObject = this.get("editedObject")
		var newObj = editedObject.clone();
		newObj.set("uuid", crypto.randomUUID());
		newObj.phantom = true;
		newObj.save();
		this.store.add(newObj);
		this.makeNewEditObject();		
		this.vm.set("disableAddAsNew", true);
	},	
	
	checkAtLoadColumns: function () {
		var me = this;
		if (this.firstLoad) {
			var data = getRawStoreData(this.store);
			this.firstLoad = false;
			var hideImageColumn = true
			var hideNameColumn = true
			var hidePathColumn = true;
			var hideDescriptionColumn = true;
			data.forEach(function (item) {
				if (item.get("description")) {
					hideDescriptionColumn = false;
				}
				if (item.get("thumbnail")) {
					hideImageColumn = false;
				}
				if (item.get("path")) {
					hidePathColumn = false;
				}
				if (item.get("name") != item.get("text")) {
					hideNameColumn = false;
				}
			});
			this.vm.set("hideDescriptionColumn", hideDescriptionColumn);
			this.vm.set("hidePathColumn", hidePathColumn);
			this.vm.set("hideNameColumn", hideNameColumn);
			this.vm.set("hideImageColumn", hideImageColumn);
		}
	},
	storeDataChanged: function () {
		var me = this;
		var singleSelect = me.vm.get('singleSelect');		
		var data = getRawStoreData(this.store);

		this.checkAtLoadColumns();
		
		var dirtyItems = [];
		var selectedItems = [];
		var selectedCountItems = [];
		var selectedItem = null;
		data.forEach(function (item) {
			if (item.dirty) {
				dirtyItems.push(item);
			} else {
				if (item.previousValues) {
					if (item.previousValues.selected != undefined) {
						selectedItems.push(item);
						if (item.previousValues.selected === false && item.get("selected") === true) {
							selectedItem = item;
						}
					}
					if (item.previousValues.count != undefined) {
						selectedCountItems.push(item)
					}
				}
				
			}
		});
		dirtyItems.forEach(function (item) {			
			item.save();
			item.commit();
		});
		this.store.suspendEvents(true);
		this.store.beginUpdate();
		

		selectedItems.forEach(function (item) {
			if (item.get("selected")) {
				if (!item.get("count")) {
					item.set("count", 1)
				}
			} else {
				item.set("count", 0);
			}
			item.previousValues = {};
			item.commit();
		});
		selectedCountItems.forEach(function (item) {
			if (item.get("count")) {
				item.set("selected" , true)
			} else {
				item.set("selected", false);
			}
			item.previousValues = {};
			item.commit();
		});
		if (singleSelect) {
			data.forEach(function (item) {
				if (item != selectedItem) {
					item.set("selected", false);
				}
				item.previousValues = {};
				item.commit();
			});
		}
		this.store.endUpdate();
		this.store.resumeEvents(true);

		this.lookup("containerGrid").getItems().first().refresh();
		this.updateSelected();

		this.textAreaValueChanged();
		//console.log(dirtyItems);
	},
	loadData: function () {
		var dataText = [];
		
		var me = this;

		var api = '/mrg/selection_items'
		var params = null;
		//Get data
		var selectType = this.vm.get("selectType");
		params = {
			field: this.get("fieldName"),
			node: this.get("nodeType")
		}
		switch (selectType) {
			case 'text':
				params.field = "MRG_STRING";
				break;
			case 'number':
				params.field ="MRG_"+ this.get("fieldType");
				break;
			case 'preset':
				params.field = "MRG_PRESET";
				break;
			case 'selection':
				break;
		}
		Ext.Ajax.request({
			method: 'GET',
			url: api,
			params: params,
			success: function (result) {
				var jsonData = Ext.decode(result.responseText);
				me.vm.get("selectListStore").loadData(jsonData);
				//console.log(arguments);
			},
			failure: function () {
				console.log(arguments);
			},
		});

	},
	deleteRowInternal: function (item) {
		this.get("selectListStore").remove(item);
		item.phantom = false;
		item.erase({
			success: function () {
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Could not delete entry.');
			},
		});
		console.log("deleteRow", item);
	},
	
	
	
	
});
