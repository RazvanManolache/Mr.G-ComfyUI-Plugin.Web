Ext.define('MrG.fields.opt.str.TextComboSequence', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.str.TextSimple',
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.SequenceButton',
		}
	]
})