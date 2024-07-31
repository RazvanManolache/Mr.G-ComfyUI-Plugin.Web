Ext.define('MrG.grd.act.view.OutputGridV', {
	extend: 'MrG.base.view.BaseActionGridV',
	viewModel: {
		xclass: 'MrG.grd.act.vm.OutputGridVM'
	},
	controller: {
		xclass: 'MrG.grd.act.ctrl.OutputGridC'
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
				store: '{outputStore}'
			}
		},

		{
			xtype: 'panel',
			height: '100%',
			flex: 2,



			items: [

				{
					xtype: 'dataview',
					height: '100%',
					emptyText: 'No Output created',
					flex: 2,
					inline: true,
					reference: 'gridItemList',
					itemTpl: '<div class="dataview-multisort-item">' +
						'<img draggable="false" src="{htmlRepresentation}" />' +
						'<h3>{name}</h3>' +
						'</div>',
					platformConfig: {
						desktop: {
							plugins: [								
								//{
								//	xclass: 'Ext.grid.plugin.PagingToolbar'
								//}
							]
						},
						'!desktop': {
							plugins: [
								
							]
						},
					},
					
					listeners: {
						childdoubletap: 'openGridItem',
						select: 'gridItemSelected',
						deselect: 'gridItemDeselected'
					},
					
					bind: {
						store: '{outputStore}'
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