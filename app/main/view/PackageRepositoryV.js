Ext.define('MrG.main.view.PackageRepositoryV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'packageRepositoryV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.PackageRepositoryVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.PackageRepositoryC'
	},
});
