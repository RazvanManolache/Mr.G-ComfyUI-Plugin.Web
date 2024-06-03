Ext.define('MrG.fields.opt.num.NumberMinMaxAdvanced', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.num.NumberSequenceMinMax',
		},
		{
			xclass: 'MrG.fields.opt.num.NumberMinMax',		

		}
	]
});