Ext.define('MrG.fields.opt.str.TextSequenceAdvanced', {
	extend: 'Ext.Container',
	width: '100%',
	layout: 'vbox',
	items: [
		{
			flex: 1,
			xclass: 'MrG.fields.opt.str.TextSimple'
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{
					xclass: 'Ext.field.Search',
					bind: {
						hidden: '{readOnlyWorkflow}',
						value: '{textFilter}'
					},
					flex: 1,
				},
				{
					flex:1,
					xclass: 'MrG.fields.opt.SequenceButton',
				},
			]
			
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{
					xclass: 'MrG.grd.sel.TextGrid',
					
					maxHeight: '500',
					plugins: {
						rowedit: {
							autoConfirm: true
						}
					},
					
				},
				{
					xtype: 'container',
					layout: 'vbox',
					width: 50,
					bind: {
						hidden: '{readOnlyWorkflow}'
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
							xtype: 'button',
							iconCls: 'x-fa fa-search',
							handler: 'openDialogSelectTexts',
							width: 40,
							tooltip: 'Use predefined lists',
						},
					]
				},
			]
		},

		

	]
})