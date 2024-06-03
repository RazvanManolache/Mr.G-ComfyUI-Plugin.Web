Ext.define('MrG.fields.opt.img.ImageAdvanced', {
	extend: 'Ext.Container',
	layout: 'vbox',
	items: [
		{
			xtype: 'container',
			layout: {
				type: 'hbox',
				align: 'middle'
			},
			items: [
				{
					flex: 1,
					xclass: 'MrG.fields.opt.img.ImagePreview',
				},
				{
					flex: 1,
					xclass: 'MrG.fields.opt.SequenceButton',
					vertical: true,
					minWidth: 30,
					maxWidth: 50,
				},
				{
					xclass: 'MrG.fields.opt.OpenSelectDialog',
					height: 128,
				},
			]
		},

		{
			xclass: 'MrG.fields.opt.sel.SelectionGalery',

		}

	]
})