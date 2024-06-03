Ext.define('MrG.base.view.BaseNodeV', {
	extend: "MrG.base.view.BasePanelV",
	requires: [
		'MrG.base.vm.BaseNodeVM',
		'MrG.base.ctrl.BaseNodeC',

		'MrG.fields.view.TextV',
		'MrG.fields.ctrl.TextC',
		'MrG.fields.vm.TextVM',

		'MrG.fields.view.NumberV',
		'MrG.fields.ctrl.NumberC',
		'MrG.fields.vm.NumberVM',

		'MrG.fields.view.BoolV',
		'MrG.fields.ctrl.BoolC',
		'MrG.fields.vm.BoolVM',

		'MrG.fields.view.SelectionV',
		'MrG.fields.ctrl.SelectionC',
		'MrG.fields.vm.SelectionVM',

		'MrG.fields.view.ImageV',
		'MrG.fields.ctrl.ImageC',
		'MrG.fields.vm.ImageVM',
	],
	width: '100%',
	layout: {
		type: 'vbox',

	},
	isNode: true,
	bind: {
		bodyPadding: '{nodeBodyPadding}',
		//title: '{titlePanel}',
		hidden: '{hideNode}',
		border: '{borderShow}'
	},
	style: 'border: 5px solid red;',
	overflowY: 'scroll',
	scollable: true,
	
	listeners: {		
		click: {
			element: 'element', 
			fn: 'clickedOnNode'
		},
	},
	viewModel: {
		xclass: 'MrG.base.vm.BaseNodeVM'
	},
	controller: {
		xclass: 'MrG.base.ctrl.BaseNodeC'
	},
	
	tbar: {
		bind: {
			hidden: '{hideTitles}'
		},
		items: [
			{
				xtype: 'label',
				bind: {
					tooltip: '{comfyCategory}',
					html: '{titlePanel}'
				},
			},
			
			{
				xtype: 'spacer'
			},
			
			
			
			{
				iconCls: 'x-fa fa-gears',
				handler: 'configureNode',
				tooltip: 'Options',
				
				bind: {
					hidden: '{hideConfigure || readOnlyWorkflow}'
				},
				menu: {
					anchor: true,
					items: [
						{
							text: 'Rename',
							iconCls: 'x-fa fa-pen',
						},
						{
							separator: true,
							iconCls: 'x-fa fa-arrow-up',
							text: 'Add node above',
							handler: 'addNodeAbove',
							bind: {
								hidden: '{hideAddNodeAbove}'
							}
						},
						{
							
							iconCls: 'x-fa fa-arrow-down',
							text: 'Add node below',
							handler: 'addNodeBelow',
							bind: {
								hidden: '{hideAddNodeBelow}'
							}
						},
										
						{
							separator: true,
							iconCls: 'x-fa fa-angle-up',
							text: 'Move up node',
							handler: 'moveUp',
							bind: {
								hidden: '{hideMoveDown}'
							}
						},
						{
							
							iconCls: 'x-fa fa-angle-down',
							text: 'Move down node',
							handler: 'moveDown',
							bind: {
								hidden: '{hideMoveUp}'
							}
						},
						{
							separator: true,
							xtype: 'menucheckitem',
							bind: {
								iconCls: 'x-fa fa-eye{hideNodeCls}',
								text: '{hideNodeText}',
								checked: '{nodeHidden}',
								hidden: '{!canHideNodes}'
							}
						},						
						{
							separator: true,
							iconCls: 'x-fa fa-times',
							text: 'Remove node',
							handler: 'closeNode',
							bind: {
								hidden: '{hideNodeClose}'
							}
						},
						{
							separator: true,
							iconCls: 'x-fa fa-circle-notch',
							text: 'Load defaults for node',
							handler: 'loadDefaultLayout',
							bind: {
								hidden: '{hideLoadDefaultLayout}'
							}
						},
						{
							iconCls: 'x-fa fa-compact-disc',
							text: 'Set layout as default',
							handler: 'setLayoutAsDefault',
							bind: {
								hidden: '{hideSetLayoutAsDefault}'
							}
						},
						
					]
				}
			},
			
			
		]
	},


	
	items: [
	],
	deferredRender: false,

});
