Ext.define('MrG.grd.act.view.QueueGridV', {
	extend: 'MrG.base.view.BaseActionGridV',
	viewModel: {
		xclass: 'MrG.grd.act.vm.QueueGridVM'
	},
	controller: {
		xclass: 'MrG.grd.act.ctrl.QueueGridC'
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
			iconCls: 'x-fa fa-play',
			tooltip: 'Resume selected',
			handler: 'resumeGridItem',
			bind: {
				disabled: '{disableResumeGridItem}'
			}
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-pause',
			tooltip: 'Pause selected',
			handler: 'pauseGridItem',
			bind: {
                disabled: '{disablePauseGridItem}'
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
				disabled: '{disableOpenGridItem}'
			}
		}
	],
	items: [
		{
			xclass: 'MrG.cmp.view.TagPanelV',
			reference: 'tagPanel',

			bind: {
				store: '{queueStore}'
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
					emptyText: 'No Queue created',
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
							tpl: '<div>{nice_description}</div>'
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
							text: 'Create date',
							width: 160,
							dataIndex: 'create_date',
							formatter: 'date("Y/m/d H:i:s")',
						},
						//this was horrible, just to add a progress bar to a grid, probably could do more color changes, maybe later
						//just realised that i should probably keep the same color coding for the other applications... ffs
						{
							text: 'Progress',
							width: 160,
							
							cell: {
								xtype: 'widgetcell',
								widget: {
									xtype: 'progress',
									bind: '{record.percent}',
									ui: 'warning',
									
									listeners: {
										painted: function (cell) {
											var record = cell.up().getRecord();
											if (record) {
												cell.setValue(record.get('percentage')); 
												cell.setText(record.get('progress')); 
												var status = record.get('status');
												switch (status) {
													case "queued":
                                                        cell.setUi("info");
														break;
													case "running":
														cell.setUi("warning");
                                                        break;
                                                    case "finished":
                                                        cell.setUi("success");
                                                        break;
													case "failed":
													case "invalid":
                                                        cell.setUi("error");
                                                        break;
                                                }
												
											}
										}
									}
								},
								
								
								
							}
						}
,

						
						{
							dataIndex: 'outputs_count',
							text: 'Outputs',
							xtype: 'textcolumn',
						},
						{
							xtype: 'textcolumn',
							text: 'Tags',
							dataIndex: 'tags',
						},
						

						
					],
					plugins: [
						{
							xclass: 'Ext.grid.plugin.PagingToolbar',
						}
					],
					bind: {
						store: '{queueStore}'
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