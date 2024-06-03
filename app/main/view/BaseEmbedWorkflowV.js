Ext.define('MrG.main.view.BaseEmbedWorkflowV', {
	extend: "MrG.base.view.BasePanelV",
	layout:'vbox',
	height: '100%',
	scrollable: 'y',
	width: '100%',
	autoSize: true,
	bind: {
		title: '{record.name}'
	},
	viewModel: {
		xclass: 'MrG.main.vm.BaseEmbedWorkflowVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.BaseEmbedWorkflowC'
	},
	tbar: [
		{
			xtype: 'button',
			iconCls: 'x-fa fa-times',
			handler: 'closeEmbedWorkflow',
			text: 'Close'
		},
		{
			xtype: 'spacer',
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-save',
			handler: 'saveEmbedWorkflow',
			text: 'Save'
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-copy',
			handler: 'saveCopyEmbedWorkflow',
			text: 'Make copy'
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-file-download',
			handler: 'exportEmbedWorkflow',
			text: 'Export'
		},


	],
});
