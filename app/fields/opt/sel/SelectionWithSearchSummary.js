Ext.define('MrG.fields.opt.sel.SelectionWithSearchSummary', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [

		{
			flex: 1,
			xclass: 'MrG.fields.opt.sel.SelectionSequence',
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
					xclass: 'MrG.fields.opt.OpenSelectDialog'
				},
				{
					xclass: 'MrG.fields.opt.NegateButton'
				}
			]
		}

	]
})