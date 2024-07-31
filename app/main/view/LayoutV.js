Ext.define('MrG.main.view.LayoutV', {
	title: "Mr.G's Comfy UI",
	extend: "MrG.base.view.BaseTabPanelV",
	width: '100%',
	height: '100%',
	layout: {
		type: 'card',
		animation: {
			type: 'slide'
		}
	},
	defaults: {
		scrollable: true,
		userSelectable: {
			bodyElement: true
		}
	},	
	masked: {
		xtype: 'loadmask',
		message: 'Mr.G is loading...'
	},
	reference: 'mainScreen',
	viewModel: {
		xclass: 'MrG.main.vm.LayoutVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.LayoutC'
	},
	tabBar: {
		hidden: true
	},
	defaults: {
		hideMode: 'offsets'
	},
	items: [
		{
			xclass: 'MrG.main.view.LayoutTabPanelV',
			reference: 'mainTabPanel',
			title: 'MrG',
			listeners: {
				toComfyUI: 'toComfyUI',
			}

			
		},
		{
			xtype: 'panel',
			hideMode: 'visibility',
			title: 'Comfy',
			height: '100%',
			width: '100%',
			scrollable: 'y',
			autoSize: true,
			layout: 'vbox',
			items: [
				{
					xtype: 'button',
					iconCls: 'x-fa fa-window-restore',
					ui: 'raised action',
					tooltip: 'Mr.G AI',
					handler: 'toMrGUI',
					floating: true,
					right: 10,
					top: 10
				},
				{
					xtype: 'component',
					height: '100%',
					width: '100%',
					layout: 'vbox',
					html: '<div style="width:100%;height:99.45%;position:relative;"><iframe style="width:100%;height:100%" src="/"></iframe></div>',
					style: 'background-color: white;',
                }


			]

			
		}
	],

	deferredRender: false,

});
