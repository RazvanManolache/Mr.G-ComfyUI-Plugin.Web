Ext.define('MrG.base.view.BaseContainerV', {
	extend: 'Ext.Container',
	layout: 'hbox',
	viewModel: {
		xclass: 'MrG.base.vm.BaseContainerVM'
	},
	controller: {
		xclass: 'MrG.base.ctrl.BaseContainerC'
	},
});