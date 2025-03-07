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
			tooltip: 'Show details',
			enableToggle: true,
			bind: {
				pressed: '{showDetails}',
				iconCls: '{showDetails ? "x-fa fa-chevron-up" : "x-fa fa-chevron-down"}'
			}
		},
		{
			iconCls: 'x-fa fa-tags',
			tooltip: 'Show tags',
			enableToggle: true,
			bind: {
				pressed: '{showTags}'
			}
		},
		{
			iconCls: 'x-fa fa-star',
			tooltip: 'Show ratings',
			enableToggle: true,
			bind: {
				pressed: '{showRatings}'
			}
		},
		{
			iconCls: 'x-fa fa-tasks',
			tooltip: 'Multi Select',
			enableToggle: true,
			bind: {
				pressed: '{multiSelect}'
			}
		},
		{
			tooltip: 'Download',
			iconCls: 'x-fa fa-download',
			handler: 'downloadGridItem',
			bind: {
				disabled: '{disableDeleteGridItem}'
			}
		},
		
		{
			iconCls: 'x-fa fa-trash',
			tooltip: 'Delete selected items',
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
			xtype: 'componentdataview',
			scrollable: true,
			selectable: 'simple',
			style: {
				overflow: 'scroll'
			},
			userSelectable: {
				element: true,
				bodyElement: true,
			},

			// Hack to prevent crashes during pagination
			scrollToRecord: Ext.emptyFn, // Cleaner way to define an empty function

			height: '100%',
			emptyText: 'No Output created',
			flex: 2,
			layout: 'fit',
			inline: true,

			itemCls: 'dataview-item',
			itemConfig: {
				viewModel: true,
				xtype: 'container',
				height: 'auto',
				width: 'auto',

				border: false,
				style: {
					border: '1px solid blue',
					overflow: 'unset',
				},
				layout: {
					type: 'vbox', // Vertical layout for child items
					align: 'center',
					pack: 'start', // Start packing vertically
					vertical: true
				},
				defaults: {
					margin: '5 0', // Add spacing between items
					cls: 'dataview-item-content' // Add custom class for styling
				},
				items: [
					{
						xtype: 'label',
						bind: {
							html: '<h2>{record.workflow_name}</h2>',
							hidden: '{!showDetails}'
						},
						style: {
							whiteSpace: 'normal', // Enable wrapping
							textAlign: 'center'
						}
					},
					{
						xtype: 'label',
						bind: {
							html: '<b>{record.description}</b>',
							hidden: '{!showDetails}'
						},
						style: {
							whiteSpace: 'normal', // Enable wrapping
							textAlign: 'center'
						}
					},
					{
						xtype: 'label',
						bind: {
							html: '<i>{record.nice_type} - {record.create_date:date("d/m/Y H:i")}</i>',
							hidden: '{!showDetails}'
						},
						style: {
							whiteSpace: 'normal', // Enable wrapping
							textAlign: 'center'
						}
					},
					{
						xtype: 'rating',
						bind: {
							value: '{record.rating}',
							hidden: '{!showRatings}'
						},
						style: {
							marginTop: '10px',
							textAlign: 'center'
						}
					},
					{
						xtype: 'image', // Use xtype 'image' instead of xclass
						bind: {
							src: '{record.icon}'
						},
						width: 150,
						height: 150,
						style: {
							objectFit: 'contain', // Ensure the image fits within bounds
							margin: '10px auto'
						}
					},
					{
						xtype: 'label',
						bind: {
							html: '<i>{record.tags}</i>',
							hidden: '{!showTags}'
						},
						style: {
							whiteSpace: 'normal', // Enable wrapping
							textAlign: 'center'
						}
					},
				]
			},

			reference: 'gridItemList',

			//platformConfig: {
			//	desktop: {
			//		plugins: [
			//			{
			//				xclass: 'Ext.grid.plugin.PagingToolbar',
			//			}
			//		]
			//	}
			//},

			listeners: {
				childdoubletap: 'openGridItem',
				select: 'gridItemSelected',
				deselect: 'gridItemDeselected'
			},

			bind: {
				store: '{outputStore}'
			}
		},
		//horrible hack but otherwise the paging toolbar is at bottom of scrollable container
		{
			xtype: 'grid',
			listeners: {
				painted: function (grid) {
					grid.el.down('.x-dataview-body-el').setStyle('display', 'none'); // Hide grid content
				}
			},

			bind: {
				store: '{outputStore}'
			},
			plugins: [
				{
					xclass: 'Ext.grid.plugin.PagingToolbar',
				}
			],

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