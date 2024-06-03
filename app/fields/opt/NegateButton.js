Ext.define('MrG.fields.opt.NegateButton', {
	extend: 'Ext.Button',
	iconCls: 'x-fa fa-not-equal',
	tooltip: 'Negate',
	enableToggle: true,
	width: 40,
	bind: {
		pressed: '{negateList}'
	},
})