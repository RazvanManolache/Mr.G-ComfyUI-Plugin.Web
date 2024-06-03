Ext.define('MrG.fields.opt.num.NumberWithDefinedSequenceSummary', {
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
			xtype: 'container',
			layout: {
				type: 'hbox',
				align: 'middle'
			}, 
			items: [
				{
					flex: 1,
					xtype: 'label',
					bind: {
						html: '{valuesComboText}'
					}
				},
				{
					xtype: 'button',
					iconCls: 'x-fa fa-search',
					handler: 'openDialogSelectNumbers',
					width: 40,
					tooltip: 'Use predefined lists',
				},
			]
		}
		
	]
})