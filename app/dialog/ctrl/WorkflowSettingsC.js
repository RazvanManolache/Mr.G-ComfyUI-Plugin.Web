Ext.define('MrG.dialog.ctrl.WorkflowSettingsC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	init: function () {		
		this.callParent(arguments);
		var settings = this.view._settings;
		this.setProperties(settings);
	},
	
	// Set the properties from the settings object
	setProperties: function (settings) {
		this.set("origSettings", settings);
		this.get("workflowSettings").forEach(function (property) {
			if (settings[property] !== undefined) {
				this.vm.set(property, settings[property]);
			}			
		}, this);
	},

	// Get the save object
	getSaveObject: function () {
		var saveObject = this.get("origSettings");
		this.get("workflowSettings").forEach(function(property) {
			saveObject[property] = this.vm.get(property);
		}, this);
		return saveObject;
	},
	closeWindow: function () {
		this.view.close();
	},
	// Save and run the workflow settings
	saveAndRun: function () {
		var saveObject = this.getSaveObject();
		this.fireViewEventArgs("workflowSettingsClosed", [saveObject, true]);
		this.closeWindow();
	},

	// Save the workflow settings
	save: function () {
		var saveObject = this.getSaveObject();
		this.fireViewEventArgs("workflowSettingsClosed", [saveObject, false]);
		this.closeWindow();
	},

	// Cancel the workflow settings
	cancel: function () {
		this.fireViewEventArgs("workflowSettingsClosed", [null, false]);
		this.closeWindow();
	},

	// Reopen the popup with the same parameters
	reopenPopupWithSameParams: function () {
	}
});
