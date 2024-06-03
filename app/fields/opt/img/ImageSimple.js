Ext.define('MrG.fields.opt.img.ImageSimple', {
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
					xclass: 'MrG.fields.opt.OpenSelectDialog',
					height:128,
				},	
			]
		}
	]
})