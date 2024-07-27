Ext.define('MrG.main.view.PackagesV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'packagesV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.PackagesVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.PackagesC'
	},
});
