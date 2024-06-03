Ext.define('MrG.base.view.BaseTabPanelV', {
	extend: 'Ext.tab.Panel',
	layout: 'hbox',
	viewModel: {
		xclass: 'MrG.base.vm.BaseTabPanelVM'
	},
	controller: {
		xclass: 'MrG.base.ctrl.BaseTabPanelC'
	},
})