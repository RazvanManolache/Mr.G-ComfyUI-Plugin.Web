Ext.define('MrG.dialog.view.SelectNodeV',{
	extend: 'MrG.main.view.WorkflowV',
	
	layout: 'vbox',
	modal: true,
	controller: {
		xclass: 'MrG.dialog.ctrl.SelectNodeC'
	},
	viewModel: {
		xclass: 'MrG.dialog.vm.SelectNodeVM'
	},
	listeners: {
		hide: 'selectionCanceled',
		show: 'showingSelector'
	},
	masked: {
		xtype: 'loadmask',
		message: 'Component list is loading...'
	},
	height: '90%',
	height: '80%',

	modal: true,
	floated:true,
	resizeable: true,
	centered: true,
	maximizable: true,
	scrollable: true,
	closable: false,
	

	items: [],
	
	bbar: {
		items: ['->', {
			xtype: 'label',
			bind: {
				html: '{selectedNodesCountText}'
			}
		},'->', {
			xtype: 'button',
			text: 'ok',
			handler: 'selectionDone',
			bind: {
				disabled: '{selectedNodesCount==0}'
			}
		},
			{
				xtype: 'button',
				text: 'cancel',
				handler: 'selectionCanceled'
			}]
	},
});