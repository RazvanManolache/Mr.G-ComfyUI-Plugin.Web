Ext.define('MrG.dialog.vm.StepNavigationVM', {
	extend: 'MrG.base.vm.BasePanelVM',
	data: {
		combinations: 0,
		randomFields: 0,
		fixedFields: 0,
		transparentSequenceFields: 0,
		sequenceFields: 0,
	},
	stores: {
		fieldsStore: {
			xtype: 'FieldOptionsStore',
			listeners: {
				datachanged: 'onDataChanged'
			}
		}
	}

	
});