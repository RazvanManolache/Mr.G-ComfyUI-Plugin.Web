Ext.define('MrG.fields.opt.num.NumberSequenceMinMax', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.num.NumberSimple',
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.SequenceButton',
		}
	]
})