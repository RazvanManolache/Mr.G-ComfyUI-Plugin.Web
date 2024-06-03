Ext.define('MrG.fields.opt.img.ImagePreview', {
	extend: 'Ext.Container',
	layout: {
		type: 'vbox',
		align: 'middle'
	}, 
	items: [
		{
			flex:1,
			xclass: 'Ext.Img',
			minHeight: 128,
			minWidth: 128,
			maxWidth: 512,
			maxHeight: 512,
			bind: {
				src: '{selectedRecord.photoLarge}',
			}
		},
		{
			xtype: 'label',
			bind: {
				html: '{value}'
			}
		}

	]
	
})