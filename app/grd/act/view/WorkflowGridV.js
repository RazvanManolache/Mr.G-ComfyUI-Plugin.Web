Ext.define('MrG.grd.act.view.WorkflowGridV', {
	extend: 'MrG.base.view.BaseActionGridV',
	viewModel: {
		xclass: 'MrG.grd.act.vm.WorkflowGridVM'
	},
	controller: {
		xclass: 'MrG.grd.act.ctrl.WorkflowGridC'
	},
	height: '100%',
	flex: 2,
	layout: 'vbox',
	tbar: [
		{
			xtype: 'searchfield',
			bind: {
				value: '{searchText}'
			},
			listeners: {
				change: 'searchValueChanged'
			}
		},
		{
			xtype: 'spacer'
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-plus',
			bind: {
				disabled: '{disableAddGridItem}',
				hidden: '{selectionMode}'
			},
			menu: {
				items: [
					{
						icon: 'x-fa fa-file-medical',						
						handler: 'newGridItem',
						bind: {
							text: 'New {typeGrid}'
						}
					},
					{
						icon: 'x-fa fa-upload',
						text: 'Import file',
						handler: 'openFileGridItem',

					},
				]
			}

		},
		{
			iconCls: 'x-fa fa-pen',
			handler: 'editGridItem',
			bind: {
				disabled: '{disableEditGridItem}',
				hidden: '{selectionMode}'
			}
		},
		{
			iconCls: 'x-fa fa-trash',
			handler: 'deleteGridItem',
			bind: {
				disabled: '{disableDeleteGridItem}',
				hidden: '{selectionMode}'
			}
		},
		{
			tooltip: 'Refresh',
			iconCls: 'x-fa fa-sync',
			handler: 'refreshGrid',
		},
		{
			iconCls: 'x-fa fa-folder-open',

			ui: 'action',
			handler: 'openGridItem',
			bind: {
				text: '{openGridItemText}',
				disabled: '{disableOpenGridItem}',
				hidden: '{selectionMode}'
			}
		}
	],
	items: [
		{
			xclass: 'MrG.cmp.view.TagPanelV',
			reference: 'tagPanel',

			bind: {
				store: '{workflowStore}'
			}
		},

		{
			xtype: 'panel',
			height: '100%',
			flex: 2,
			


			items: [
				
				{
					xtype: 'grid',
					height: '100%',
					flex: 2,
					reference: 'gridItemList',
					singleExpand: false,
					platformConfig: {
						desktop: {
							plugins: [
								{
									xclass: 'Ext.grid.plugin.RowDragDrop',
									groups: ['gridRowGroup', 'categorize'],
								},
								{
									xclass: 'Ext.grid.plugin.RowExpander'
								}
							]
						},
						'!desktop': {
							plugins: [
								{
									xclass: 'Ext.grid.plugin.RowExpander'
								}
							]
						},
					},
					itemConfig: {
						body: {
							tpl: '<div>Description: {description}</div>'
						}
					},
					listeners: {
						childdoubletap: 'openGridItem',
						select: 'gridItemSelected',
						deselect: 'gridItemDeselected',
						beforeEdit: 'beforeEditGridItem',
					},
					columns: [
						{
							xtype: 'checkcolumn',
							headerCheckbox: false,
							dataIndex: 'selected',
							bind: {
								hidden: '{!selectionMode}'
							}
						},
						{
							xtype: 'textcolumn',
							text: 'Name',
							dataIndex: 'name',
							flex: 1
						},
						{
							xtype: 'textcolumn',
							text: 'Tags',
							dataIndex: 'tags',
						},
						{
							text: 'Favorite',
							xtype: 'checkcolumn',
							headerCheckbox: true,
							dataIndex: 'favourite',
							bind: {
								disabled: '{selectionMode}'
							}
						},
						
					],
					plugins: {

					},
					bind: {
						store: '{workflowStore}'
					}
				}]
		},
		{

			xtype: 'panel',
			title: 'Edit workflow attributes',
			header: true,
			reference: 'editGridItemForm',

			dock: 'bottom',
			bind: {
				hidden: '{!editFormVisible}'
			},
			platformConfig: {
				desktop: {
					collapsible: {
						collapsed: false,
						direction: 'bottom'
					},
					resizable: {
						split: true,
						edges: 'north'
					},
				},
				'!desktop': {
					height: '100%'
				}
			},
			layout: 'vbox',
			items: [

				{
					xtype: 'textfield',
					label: 'Name',
					bind: {
						value: '{editedGridItem.name}',
						readOnly: '{readOnlyGridItem}'
					}
				},
				{
					xclass: 'MrG.fields.TextArea',
					label: 'Description',
					bind: {
						value: '{editedGridItem.description}',
						readOnly: '{readOnlyGridItem}'
					}
				},
				{
					xtype: 'textfield',
					label: 'Tags',
					bind: {
						value: '{editedGridItem.tags}',
						readOnly: '{readOnlyGridItem}'
					}
				},

				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xtype: 'button',
							handler: 'saveGridItem',
							iconCls: 'x-fa fa-check',
							bind: {
								disabled: '{disableSaveGridItem}'
							}
						},
						{
							xtype: 'button',
							handler: 'cancelEditGridItem',
							iconCls: 'x-fa fa-times'
						},
					]
				}
			]
		}
	]
});