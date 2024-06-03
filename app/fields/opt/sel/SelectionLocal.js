Ext.define('MrG.fields.opt.sel.SelectionLocal', {
	extend: 'Ext.field.ComboBox',
	queryMode: 'local',
	
	forceSelection: true,
	autoSelect: true,
	required: true,
	typeAhead: true,
	enableRegEx: true,
	flex: 1,	
	queryMode: 'local',
	displayField: 'alias',
	valueField: 'uuid',
	bind: {
		readOnly: '{readOnlyWorkflow}',
		value: '{selectedUUID}',
		store: '{comboSelectStore}',
	}
})