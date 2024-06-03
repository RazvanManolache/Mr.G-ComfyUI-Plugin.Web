Ext.define('MrG.cmp.view.TagPanelV', {
	extend: 'MrG.base.view.BasePanelV',
	layout: 'hbox',
	padding: '0 0 0 5',
	bind: {
		hidden: '{hideTagPanel}'
	},
	viewModel: {
		xclass: 'MrG.cmp.vm.TagPanelVM'
	},
	controller: {
		xclass: 'MrG.cmp.ctrl.TagPanelC'
	},
	setStore: function (store) {
		this.getController().setDataStore(store);
	},
	getStore: function () {
		return this.getController().getDataStore();
	},
	items: [{
		padding: '0 15',
		xtype: 'segmentedbutton',
		ui: 'action',

		items: [{
			text: 'AND',
			pressed: true,
			handler: 'andFilterPressed'
		}, {
			text: 'OR',
			handler: 'orFilterPressed'
		}]
	},
	//	{
	//	xclass: 'Ext.Container',	
	//	padding: '10 0 0 5',
	//	reference: 'tagButtons',
	//	layout: 'hbox',
	//	wrap: true,
	//	items: [



	//	]
	//},
	{
		flex: 1,
		xclass: 'Ext.Container',
		layout: 'hbox',
		wrap: true,
		reference: 'tagCloud'
	},
	{
		margin: '10 0 0 5',
		xclass: 'Ext.Button',
		reference: 'btn_filt_all',
		ui: 'decline',
		handler: 'clearFilters',
		text: 'Clear',
		bind: {
			hidden: '{hideShowAllButton}'
		},
	},

	]
});