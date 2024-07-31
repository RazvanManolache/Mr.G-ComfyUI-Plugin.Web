Ext.define('MrG.main.view.LayoutTabPanelV', {
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
		xclass: 'MrG.main.vm.LayoutTabPanelVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.LayoutTabPanelC'
	},	
	defaults: {
		hideMode: 'offsets'
	},
	tabBar: {
		iconAlign: 'left',
		layout: {
			pack: "left"
		},
		defaults: {
			iconAlign: 'left',
			/*flex:'1 1 auto',*/
			//textAlign: 'left',
			//width: 50,
		},

		centered: false,
		items: [{
			xtype: 'button',
			text: '+',
			ui: 'action',
			setActive: function (active) {
				this.setPressed(active);
			},
			listeners: {
				scope: 'controller',
				click: {
					element: 'element', //bind to the underlying el property on the panel
					fn: 'addTab'
				},
			},

		}, {
			xtype: 'spacer'
		},

		{
			xtype: 'button',
			ui: 'action',
			iconCls: 'x-fa fa-palette',
			reference: 'paletteMenu',
			tooltip: 'Change colors',
			bind: {
				hidden: '{!isMaterial}'
			},
			menu: {
				anchor: true
			}
		},
		{
			xtype: 'button',
			ui: 'action',
			tooltip: 'Change theme',
			iconCls: 'x-fa fa-swatchbook',
			reference: 'themeMenu',
			menu: {
				anchor: true,
			},

		}, {
			xtype: 'button',
			ui: 'action',
			iconCls: 'x-fa fa-sync',
			tooltip: 'Refresh all lists',
			reference: 'refreshStores',
			handler: 'refreshAllSingletonStores'
		},
		{
			xtype: 'button',
			ui: 'action',
			iconCls: 'x-fa fa-project-diagram',
			tooltip: 'Comfy UI',
			handler: 'toComfyUI'
		}]
	},
	items: [

	],

	deferredRender: false,

});
