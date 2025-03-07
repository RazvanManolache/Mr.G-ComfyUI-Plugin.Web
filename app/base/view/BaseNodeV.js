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
	
	tools: [{
		type: 'gear',
		bind: {
			hidden: '{hideConfigure || readOnlyWorkflow}'
		},
		tooltip: 'Options',
		handler: function (panel, toolEl, event) {
			panel.getController().configureNode();
			const createMenuItem = (text, iconCls, handlerName, bindConfig, separator) => ({
				text,
				iconCls,
				separator: separator,
				handler: function (item) {
					panel.getController()[handlerName]();
				},
				bind: bindConfig
			});

			Ext.create('Ext.menu.Menu', {
				viewModel: panel.getViewModel(),
				items: [
					//TODO: implement rename
					createMenuItem('Set alias', 'x-fa fa-pen', 'setNodeAlias', false),					
					createMenuItem('Add node above', 'x-fa fa-arrow-up', 'addNodeAbove', { hidden: '{hideAddNodeAbove}' }, true),
					createMenuItem('Add node below', 'x-fa fa-arrow-down', 'addNodeBelow', { hidden: '{hideAddNodeBelow}' }, false),
					createMenuItem('Move up node', 'x-fa fa-angle-up', 'moveUp', { hidden: '{hideMoveDown}' }, true),
					createMenuItem('Move down node', 'x-fa fa-angle-down', 'moveDown', { hidden: '{hideMoveUp}' }, false),
					
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
					createMenuItem('Remove node', 'x-fa fa-times', 'closeNode', { hidden: '{hideNodeClose}' }, true),
					createMenuItem('Load defaults for node', 'x-fa fa-circle-notch', 'loadDefaultLayout', { hidden: '{hideLoadDefaultLayout}' }, true),
					createMenuItem('Set layout as default', 'x-fa fa-compact-disc', 'setLayoutAsDefault', { hidden: '{hideSetLayoutAsDefault}' }, false),

					
				]
			}).showBy(toolEl);
		}
	}],
	isNode: true,
	header: {
		bind: {
			hidden: '{hideTitles}',
			title: '{titlePanel}',
			tooltip: '{comfyCategory}',
		}
	},
	bind: {
		bodyPadding: '{nodeBodyPadding}',
		hidden: '{hideNode}',
		border: '{borderShow}',
		collapsed: '{collapsedPanel}'
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
	collapsible: 'top',
	
	

	
	items: [
	],
	deferredRender: false,

});
