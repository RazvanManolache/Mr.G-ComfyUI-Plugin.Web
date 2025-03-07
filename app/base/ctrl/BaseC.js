Ext.define('MrG.base.ctrl.BaseC', {
	extend: 'Ext.app.ViewController',
	vm: null,
	view: null,
	init: function () {
		this.callParent(arguments);
		this.setInternalVariables();
	},
	selectPreset: function () {
		var me = this;
		var dialog = new MrG.dialog.view.SelectListV({
			_mrgOptions: {
				type: {
					name: 'preset',
				},
				fieldType: "",
				fieldName: "",
				nodeType: "",
				mode: 'dialog',
				caller: this,
				value: this.vm.get("valuesComboText")
			},
			listeners: {
				selectionDone: function () { me.processPreset(...arguments); }
			}
		});

		dialog.show();
	},
	ignoreEventLogList: [
		//WORKFLOW EVENTS
		//when opening a workflow
		"openWorkflow",
		//NODE EVENTS
		//when clicking on a node
		"clickedNode", 
		// when clicking on label of a field
		"fieldLabelClicked",
		// when node alias is changed
		"nodeAliasChanged",
		//FIELD EVENTS
		//events for when a value is added or removed from a link field
		"nodeFieldLinkRemoved", "nodeFieldLinkAdded", "fieldLinkRemoved", "fieldLinkAdded",
		// this is for when a link field is created/destroyed in UI, it notifies the port store
		"nodeFieldLinkInitialized", "nodeFieldLinkDestroyed", "fieldLinkInitialized", "fieldLinkDestroyed", "nodeInitiated",
		// this is to change type of flexible ports in the ports store (like for reroute and primitive) and for converting fields to inputs or viceversa
		"nodeLinkFieldStateChanged", "linkFieldStateChanged",
		//events for the fields sequence changing screen
		"nodeFieldSequenceChanged", "sequenceChanged",
		//field changed is used for getting list of all fields, this is now used to generate content for preset tags and descriptions
		"nodeFieldChanged", "fieldChanged",
		// navigational events
		"activeNavigationItemChanged",
		//these are used to notify comfy of value changes
		"nodeFieldValueChanged", "fieldValueChanged",
		//these are used to notify everything was created for field
		"nodeFieldInitiated", "fieldInitiated",
		//these just reflect what the field is throwing, already see those
		"nodeFieldSequenceChanged", "nodeFieldLinkAdded"],
	blockEventList: [
		
	],
	fireViewEventArgs: function (eventName, args) {
		this.setInternalVariables();
		if (eventName != "clickedNode") {
			if (this.checkAutoSave) {
				this.checkAutoSave(eventName, args);
			}
		}
		if (this.blockEventList && this.blockEventList.indexOf(eventName) != -1) {
			return;
		}
		if (!this.ignoreEventLogList || this.ignoreEventLogList.indexOf(eventName) == -1) {
			console.log(eventName, args);
		}
	

		this.view.fireEventArgs(eventName, args);
	},
	setInternalVariables: function () {
		if (!this.vm)
			this.vm = this.getViewModel();
		if (!this.view)
			this.view = this.getView();
	},
	bind: function (descriptor, callback, scope, options) {
		this.setInternalVariables();
		return this.vm.bind(descriptor, callback, scope, options);
	},
	set: function (prop, val) {
		this.setInternalVariables();
		var prevValue = this.vm.get(prop);
		if (prevValue != val) {
			this.vm.set(prop, val);
			return true;
		}
		return false;
	},
	get: function (prop) {
		this.setInternalVariables();
		//sometimes viewmodel is null, not clear to why
		if(!this.vm)
			location.reload();
		return this.vm.get(prop);
	},
	getSettingsStore: function () {
		return MrG.store.SettingsStore;
	},
	getSetting: function (name, setting_type) {
		var store = this.getSettingsStore();
		var idx = store.findBy(function (record) {
			return record.get("name") == name && record.get("setting_type") == setting_type;
		});
		if (idx == -1) {
			return null;
		}
		return store.getAt(idx);
	},
	initByUuid: function (uuid) {
		//TODO: Implement initByUuid, loading from server
		console.log("should not really reach here");
	},
	updateSetting: function (name, setting_type, value, description, value_type, value_type_options) {
		var val = value;

		if (isObject(value)) {
			val = JSON.stringify(value);
		}
		var store = this.getSettingsStore();

		var newSetting = false;
		var setting = this.getSetting(name, setting_type)


		if (setting == null) {
			setting = new MrG.model.SettingsModel({
				uuid: crypto.randomUUID(),
				name: name,
				setting_type: setting_type,
				value: val
			});
			store.add(setting);
			newSetting = true;
		}
		else {
			setting.set("name", name);
			setting.set("setting_type", setting_type);
			setting.set("value", val);
		}
		if (setting.isDirty() || newSetting) {
			setting.save();
			store.load();
			return true;
		}
		return false;
	},
	showMenuMobile: function (side, cfg) {
		cfg.side = side;
		if (side === 'left' || side === 'right') {
			if (!cfg.width) {
				cfg.width = '80%';
			}
		}
		else {
			if (cfg.width) {
				delete cfg.width;
			}
		}
		delete cfg.bind
		cfg.viewModel = this.vm;
		//cfg.controller = this;
		cfg.closeAction = 'hide';
		var actionsheet = Ext.create('Ext.ActionSheet', cfg)


		var menu = this.get("mobileMenu");
		if (menu) {
			menu.setViewModel(null);
			//menu.setController(null);
			menu.destroy();
		}
		menu = Ext.Viewport.setMenu(actionsheet, {
			side: side,
			reveal: true
		});
		this.set("mobileMenu", menu);
		Ext.Viewport.toggleMenu(side);
		return menu;
	},
	getController: function () {
		return this;
	},
	forceVMUpdate: function () {
		this.set("forceVMUpdate", this.get("forceVMUpdate") + 1);
	},
	log: function () {
		console.log(...arguments);
	},
	
});
