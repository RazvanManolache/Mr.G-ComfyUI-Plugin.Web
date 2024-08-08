Ext.define('MrG.grd.act.view.AvailablePackagesGridV', {
	extend: 'MrG.base.view.BaseActionGridV',
	viewModel: {
		xclass: 'MrG.grd.act.vm.AvailablePackagesGridVM'
	},
	controller: {
		xclass: 'MrG.grd.act.ctrl.AvailablePackagesGridC'
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
				disabled: '{disableAddGridItem}'
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
				disabled: '{disableEditGridItem}'
			}
		},
		{
			iconCls: 'x-fa fa-trash',
			handler: 'deleteGridItem',
			bind: {
				disabled: '{disableDeleteGridItem}'
			}
		},
		{
			iconCls: 'x-fa fa-folder-open',

			ui: 'action',
			handler: 'openGridItem',
			bind: {
				text: '{openGridItemText}',
				disabled: '{disableOpenGridItem}'
			}
		}
	],
	items: [
		{
			xclass: 'MrG.cmp.view.TagPanelV',
			reference: 'tagPanel',

			bind: {
				store: '{availablePackagesStore}'
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
					emptyText: 'No packages available',
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
						deselect: 'gridItemDeselected'
					},
					columns: [
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
							text: 'Enabled',
							xtype: 'checkcolumn',
							headerCheckbox: true,
							dataIndex: 'enabled',
							readOnly: true
						}
					],
					plugins: {

					},
					bind: {
						store: '{availablePackagesStore}'
					}
				}]
		},
		{

			xtype: 'panel',
			title: 'Edit API attributes',
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