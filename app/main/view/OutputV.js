Ext.define('MrG.main.view.OutputV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'outputV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.OutputVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.OutputC'
	},
});
