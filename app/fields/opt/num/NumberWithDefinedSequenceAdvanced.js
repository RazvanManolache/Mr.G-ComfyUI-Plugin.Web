Ext.define('MrG.fields.opt.num.NumberWithDefinedSequenceAdvanced', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{
					flex: 1,
					xclass: 'MrG.fields.opt.num.NumberSimple',
				},
				{
					flex: 1,
					xclass: 'MrG.fields.opt.SequenceButton',
				},


			]

		},
		
		{
			flex: 1,
			xclass: 'MrG.fields.opt.num.NumberDefinedSequence',
		}
	]
})