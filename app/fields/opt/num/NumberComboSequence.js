Ext.define('MrG.fields.opt.num.NumberComboSequence', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.num.NumberCombo',
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.SequenceButton',
		}
	]
})