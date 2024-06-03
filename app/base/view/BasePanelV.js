Ext.define('MrG.base.view.BasePanelV', {
	extend: 'Ext.Panel',
	layout: 'hbox',
	viewModel: {
		xclass: 'MrG.base.vm.BasePanelVM'
	},
	controller: {
		xclass: 'MrG.base.ctrl.BasePanelC'
	},
})