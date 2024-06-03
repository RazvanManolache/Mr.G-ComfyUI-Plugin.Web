Ext.define('MrG.dialog.vm.SelectListVM', {
	extend: 'MrG.base.vm.BasePanelVM',
	data: {
		selectType: '',
		selection: [],
		selectedCount: 0,
		selectedDistinctCount: 0,
		validationType: 'none',
		clickToSelect: true,
		isSelection: false,

		fieldType: null,
		fieldName: null,
		nodeType: null,

		hideShowAllButton: true,
		hideTagField: false,




		disableAddAsNew: false,
		hideAddAsNew: false,
		hideAdd: false,
		hideReplaceRecord: true,


		editedObject: null,
		origEditedObject: null,

		editCollapsed: true,


		//grid columns hide/show
		hideTextColumn: true,
		hideTagsColumn: false,
		hideSelectColumn: false,
		hideRatingColumn: false,
		hidePathColumn: true,
		hideNameColumn: true,
		hideImageColumn: true,
		hideDescriptionColumn: true,
		hideDeleteColumn: false,
		hideEditColumn: false,
		hideSelectCountColumn: true,
		hideCommentsColumn: true,
		hideComfyNameColumn: true,
		hideAliasColumn: false,

		editableAliasColumn: true,
		editableCommentsColumn: true,
		editableRatingColumn: true,
		editableTagsColumn: true,

		//TODO: use this stuff for something
		disableDeleteSelected: false,
		disableClearSelection: false,
		disableDeselectVisible: false,
		disableSelectVisible: false,
		
	},
	formulas: {
		title: function (get) {
			if (get("selectTypeIsText")) {
				return "Select texts";
			}
			if (get("selectTypeIsNumber")) {
				return "Select number sequence";
			}
			if (get("selectTypeIsSelection")) {
				return "Select items";
			}
			if (get("selectTypeIsImage")) {
				return "Select images";
			}
			return "-- no title --"
		},
		singleSelect: function (get) {
			return get("selectTypeIsNumber") || get("selectTypeIsPreset");
		},
		selectTypeIsText: function (get) {
			return get("selectType") == "text";
		},
		selectTypeIsNumber: function (get) {
			return get("selectType") == "number";
		},
		selectTypeIsImage: function (get) {
			return get("selectType") == "image";
		},
		selectTypeIsPreset: function (get) {
			return get("selectType") == "preset";
		},
		selectTypeIsSelection: function (get) {
			return get("selectType") == "selection";
		},		
		hideAddRecordsButton: function (get) {
			return get("selectTypeIsNumber") || get("selectTypeIsPreset");
		},
		disableAddRecordsButton: {
			get: function (get) {
				return get("selectedCount") == 0;
			}
		},
		disableReplaceRecordsButton: {
			get: function (get) {
				return get("selectedCount") == 0
			}
		},
		selectedCountText: {
			get: function (get) {
				return get("selectedCount") +' selected';
			}
		}
	},
	stores: {
		selectListStore: {
			xclass: 'MrG.store.SelectListMemoryStore',
			listeners: {
				datachanged: 'storeDataChanged'
			}
		}
	}
});
