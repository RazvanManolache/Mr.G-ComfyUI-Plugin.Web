Ext.define('MrG.fields.opt.sel.SelectionSimple', {
	extend: 'Ext.field.ComboBox',
	queryMode: 'local',
	flex: 1,
	forceSelection: true,
	autoSelect: true,
	required: true,
	typeAhead: true,
	enableRegEx: true,
	displayField: 'alias',
	valueField: 'uuid',
	picker: 'auto',
	bind: {
		readOnly: '{readOnlyWorkflow}',
		value: '{selectedUUID}',
		store: '{globalDataStore}',

	}
})