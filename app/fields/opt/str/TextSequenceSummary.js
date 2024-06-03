//kind of dumb idea. not used.

Ext.define('MrG.fields.opt.str.TextSequenceSummary', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.str.TextComboSequence',
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
					handler: 'openDialogSelectTexts',
					width: 40,
					tooltip: 'Use predefined lists',
				},
			]
		}

	]
})