Ext.define('MrG.main.view.NodeList', {
	title: "Node list",
	extend: "Ext.Panel",
	width: '100%',
	height: '80%',
	autoSize: true,
	layout: 'box',

	viewModel: {
		xclass: 'MrG.main.vm.NodeList'
	},
	controller: {
		xclass: 'MrG.main.ctrl.NodeList'
	},
	
	items: [
		{
			xclass: "Ext.Panel",
			flex: 4,
			collapsible: false,	
			height: '100%',
			scrollable: 'y',
			width: '100%',
			autoSize: true,

		},	
		{
			xtype: 'panel',
			flex: 1,
			collapsible: 'right',
			collapsed: true,
			headerPosition: 'top',
			title: 'Options',
			items: [
				{
					xclass: 'Ext.field.Checkbox',
					label: 'Hide connections',
					labelWidth: 'auto',
					bind: {
						value: '{hideConnections}'
					}
				}
			]

		},
		
	],
	deferredRender: false,

});
