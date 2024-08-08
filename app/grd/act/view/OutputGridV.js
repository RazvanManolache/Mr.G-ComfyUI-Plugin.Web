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
			iconCls: 'x-fa fa-tasks',
			enableToggle: true,
			bind: {
				pressed: '{multiSelect}'
			}
			



		},
		{
			iconCls: 'x-fa fa-trash',
			handler: 'deleteGridItem',
			bind: {
				disabled: '{disableDeleteGridItem}'
			}
		},
		
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
					xtype: 'componentdataview',
					
					selectable: 'simple',
					
					userSelectable: {
						element: true, 
						bodyElement: true 
					},
					//hack because i'm too lazy to make a proper component, usde for pagination, without this method it crashes
					scrollToRecord: function () { },
					height:'100%',
					emptyText: 'No Output created',
					flex: 2,
					layout: 'fit',
					inline: true,
					itemConfig: {
						viewModel: true,
						xtype: 'container',
						style: 'border: 1px solid blue;',
						border: false,
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'space-between',
							vertical: true
						},
						height: 130,
						items: [
							
							{
								xclass: 'Ext.Img',
								bind: {
                                    src: '{record.icon}'
								},
								minHeight: 50,
								minWidth: 50,
								maxHeight: 100,
								maxWidth: 100
							},
							{
								xtype: 'rating',
								bind: {
									value: '{record.rating}'
								}
							}

						]
					},
					reference: 'gridItemList',
					//itemTpl: '<div class="dataview-multisort-item">' +
					//	'{htmlRepresentation}' +
					//	'<h3>{batch_step_uuid}</h3>' +
					//	'</div>',
					platformConfig: {
						desktop: {
							plugins: [								
								{
									xclass: 'Ext.grid.plugin.PagingToolbar'
								}
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
			title: 'Details',
			header: true,
			reference: 'editGridItemForm',

			dock: 'bottom',
			headerPosition: 'top',
			platformConfig: {
				desktop: {
					collapsible: {
						collapsed: true,
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
			layout: 'hbox',
			items: [
				{
					xtype: 'panel',
					layout: 'vbox',
					flex:1,
					items: [
						{
							xtype: 'container',
							layout: 'hbox',
							items: [
								{
									xtype: 'label',
									html: 'Rating',
								},
								{
									xtype: 'rating',
									bind: {
										value: '{editedGridItem.rating}',
									}
								},
							]
						},

						{
							xclass: 'MrG.fields.TextArea',
							label: 'Tags',
							bind: {
								value: '{editedGridItem.tags}',
							}
						},
						{
							xtype: 'textfield',
							label: 'Create date',
							readOnly: true,
							bind: {
								value: '{editedGridItem.create_date}',
							}
						}
					]
				},
				{
					xtype: 'panel',
					flex: 1,
					resizable: {
						split: true,
						edges: 'west'
					},
				}
			
				
			]
		}
	]
});