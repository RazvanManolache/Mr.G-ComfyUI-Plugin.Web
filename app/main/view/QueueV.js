Ext.define('MrG.main.view.QueueV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'queueV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.QueueVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.QueueC'
	},
});
