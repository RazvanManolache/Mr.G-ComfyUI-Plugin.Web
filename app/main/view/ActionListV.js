Ext.define('MrG.main.view.ActionListV', {
	
	iconCls:'x-fa fa-cogs',
	bind: {
		title: "{actionTitle}",
	},
	
	
	extend: "MrG.base.view.BasePanelV",
	width: '100%',
	height: '100%',
	platformConfig: {
		desktop: {
			layout: {
				type: 'hbox',
			},
		},
		'!desktop': {
			layout: {
				type: 'vbox',
			},
		}
	},

	overflowY: 'scroll',
	scollable: true,
	viewModel: {
		xclass: 'MrG.main.vm.ActionListVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.ActionListC'
	},
	masked: {
		xtype: 'loadmask',
		message: 'Actions are loading...'
	},
	header: {
		items: [{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [],

		}
		]
	},
	items: [
		{
			xtype: 'panel',
			layout: 'card',
			reference: 'leftMenu',
			header: true,

			titleCollapse: true,
			title: 'Menu',

			height: '100%',
			minWidth: 220,
			bind: {
				collapsed: '{categoriesCollapsed}'
			},
			platformConfig: {
				desktop: {
					collapsible: {
						collapsed: false,
						direction: 'left'
					},
					dock: 'left',
					width: 220,
					resizable: {
						split: true,
						edges: 'east'
					},
				},
				'!desktop': {
					width: '100%',
					collapsible: {
						collapsed: false,
						direction: 'top'
					},
					dock: 'top',
					bind: {
						hidden: '{editFormVisible}'
					}
				}
			},
			items: [
				{
					xclass: 'Ext.panel.Accordion',
					reference: 'menuPanel',
					defaults: {
						xtype: 'panel',
						bodyPadding: 10,
						flex: 1,
						titleCollapse: true,
					},
					layout: 'vbox',


					items: [
						{
							title: 'Workflows',
							listeners: {
								expand: 'onCategoriesExpand'
							},
							items: [
								{
									xclass: 'Ext.grid.Tree',
									reference: 'treeCategories',
									rootVisible: false,
									platformConfig: {
										desktop: {
											plugins: [
												{
													xclass: 'Ext.grid.plugin.TreeDragDrop',
													groups: ['treeDD', 'categorize'],
												}

											]
										},

									},
									listeners: {
										select: 'activeCategoryChanged',
										dropedRowOnTree: 'assignWorkflowToCategory'
									},
									items: [{
										xtype: 'toolbar',
										docked: 'top',
										reference: 'tbar',
										items: [
											{
												iconCls: 'x-fa fa-plus',
												handler: 'onAddCategoryClick',
												bind: {
													disabled: "{addCategoryButtonDisabled}"
												}
											},
											{
												iconCls: 'x-fa fa-pen',
												handler: 'onEditCategoryClick',
												bind: {
													disabled: "{editCategoryButtonDisabled}"
												}
											},
											{
												iconCls: 'x-fa fa-ban',
												handler: 'onDeleteCategoryClick',
												bind: {
													disabled: "{deleteCategoryButtonDisabled}"
												}
											},
											{
												iconCls: 'x-fa fa-angle-double-down',
												handler: 'onExpandAllCategoriesClick'
											},
											{
												iconCls: 'x-fa fa-angle-double-up',
												handler: 'onCollapseAllCategoriesClick'
											}
										]
									}],
									height: '100%',
									width: '100%',
									bind: {
										store: '{categoryStore}'
									},
									columns: [{
										xtype: 'treecolumn',
										text: 'Name',
										bind: {
											tooltip: '{record.description}'
										},
										flex: 1,
										dataIndex: 'name',
										editable: true
									}]
								},]
						},

						
					]

				},

				{
					xtype: 'container',
					flex: 1,

					reference: 'editCategoryForm',
					layout: 'vbox',
					items: [
						{
							xtype: 'label',
							html: 'Edit category',
						},
						{
							xtype: 'textfield',
							label: 'Name',
							bind: {
								value: '{editCategory.name}',
								readOnly: '{readOnlyCategory}'
							}
						},
						{
							xtype: 'textareafield',
							label: 'Description',
							bind: {
								value: '{editCategory.description}',
								readOnly: '{readOnlyCategory}'
							}
						},

						{
							xtype: 'container',
							layout: 'hbox',
							items: [
								{
									xtype: 'button',
									handler: 'saveCategory',
									iconCls: 'x-fa fa-check',
									bind: {
										disabled: '{disableSaveCategory}'
									}
								},
								{
									xtype: 'button',
									handler: 'cancelEditCategory',
									iconCls: 'x-fa fa-times'
								},
							]
						}
					]

				}
			]

		},
		{
			xclass: 'Ext.Panel',
			layout: 'card',
			height: '100%',
			reference: 'rightMenu',
			flex: 2,
			tabBar: {
				hidden: true
			},
			items: [
				{
					xclass: 'MrG.grd.act.view.WorkflowGridV',
					reference: 'workflowGrid',
					title: 'Workflows',
					listeners: {
						openGridItem: 'openGridItem',
						newGridItem: 'newGridItem',
						openFileGridItem: 'openFileGridItem',
					}
				},
				
				
			]


		},



	],
	deferredRender: false,

});
