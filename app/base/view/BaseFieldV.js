Ext.define('MrG.base.view.BaseFieldV', {
	extend: 'MrG.base.view.BaseContainerV',
	layout: 'hbox',
	listeners: {
		beforedestroy: 'onFieldDestroy'
	},
	viewModel: {
		xclass: 'MrG.base.vm.BaseFieldVM'
	},
	controller: {
		xclass: 'MrG.base.ctrl.BaseFieldC'
	},
	bind: {
		hidden: '{fieldHidden}'
	},
	optionsMenu: {
		items: [
			{
				separator: true,
				disabled: true,
				height: 20
			},
			{
				xtype: 'button',
				text: 'Set alias',
				handler: 'setFieldAlias'
			},
			{
				separator: true,
				disabled: true,
				height: 20
			},
			{

				xtype: 'button',
				text: 'Used in output description',
				enableToggle: true,
				bind: {
					pressed: '{usedInDescription}'
				},
			},
			{

				xtype: 'button',
				text: 'Hidden',
				enableToggle: true,
				bind: {
					pressed: '{hidden}'
				},
			},
			{
				separator: true,
				disabled: true,
				height: 20
			},
			{
				xtype: 'button',
				text: 'Set layout as default',
				handler: 'setLayoutAsDefault'
			},
			{
				xtype: 'button',
				text: 'Load default layout',
				handler: 'loadDefaultLayout'
			},
		]
	},
	setStore: function (val) {
		this.getController().setStore(val);
	},
	items: [
		{
			xclass: 'Ext.field.Checkbox',
			bind: {
				hidden: '{!fieldsSelection || linkField}',
				checked: '{fieldSelected}'
			}
		},
		{
			flex: 1,
			xclass: 'Ext.Label',
			reference: 'label',
			style: 'display:flex;align-items:center;',
			listeners: {
				click: {
					element: 'element', 
					fn: 'onLabelClick'
				},
				
			},
			bind: {
				html: '{label_formatted}',
				padding: '{label_padding}',
				minWidth: '{label_minWidth}'
			}
		},
		{
			xclass: 'Ext.Container',
			flex: 5,
			items: [
				{
					xtype: 'label',
					style: "color:red;",
					bind: {
                        html: '{errorMessage}',
						hidden: '{!errorMessage}'
                    }
				},
				{
					xclass: 'Ext.Container',
					reference: 'controlContainer',
				},
			]
		},
		
		{
			bind: {
				hidden: '{hideModifying || readOnlyWorkflow}'
			},
			reference: 'optionsMenuBtn',
			xtype: 'button',
			iconCls: 'x-fa fa-gear',
			platformConfig: {
				desktop: {
					menu: []
				},
			}
			
		}
	],
})