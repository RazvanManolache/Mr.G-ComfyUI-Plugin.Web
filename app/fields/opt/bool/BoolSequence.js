Ext.define('MrG.fields.opt.bool.BoolSequence', {
	extend: 'Ext.Container',
	layout: 'hbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.bool.BoolSimple',
		},
		{
			flex: 1,
			xclass: 'MrG.fields.opt.SequenceButton',
		}
	]
})