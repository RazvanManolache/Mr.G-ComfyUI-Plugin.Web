Ext.define('MrG.fields.opt.OpenSelectDialog', {
	extend: 'Ext.Button',
	iconCls: 'x-fa fa-search',
	tooltip: 'Select items',
	width: 40,
	handler: 'openDialogSelectList',
	bind: {
		hidden: '{readOnlyWorkflow}',
	}
})