Ext.define('MrG.fields.opt.sel.SelectionWithSearchAdvanced', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [

		{
			flex: 1,
			xclass: 'MrG.fields.opt.sel.SelectionSequence',
		},
		{
			
			xclass: 'Ext.Container',
			layout: 'hbox',
			flex: 1,
			items: [{

				xclass: 'MrG.grd.sel.ListGrid',
				reference: 'selectValueGrid',
				scrollToTopOnRefresh: true,
				flex: 1,
				plugins: {
					rowedit: {
						autoConfirm: true
					}
				},
				bind: {
					disabled: '{readOnlyWorkflow}',
				},
				maxHeight: '500',
				
				
			},
				{
				xclass: 'Ext.Container',
				layout: 'vbox',
					width: 40,
					bind: {
						hidden: '{readOnlyWorkflow}',
					},
				items: [
					{
						xtype: 'button',
						iconCls: 'x-fa fa-times',
						tooltip: 'Clear list',
						width: 40,
						handler: 'clearList',

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
		}

	]
})