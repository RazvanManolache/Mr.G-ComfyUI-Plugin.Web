Ext.define('MrG.main.view.JobV', {
	extend: "MrG.main.view.BaseEmbedWorkflowV",


	viewModel: {
		xclass: 'MrG.main.vm.JobVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.JobC'
	},

	items: [
		{
			xclass: 'Ext.tab.Panel',
			reference: 'tabPanel',
			tabBar: {
				hidden: true
			},
			flex: 1,
			height: '100%',
			items: [
				{
					title: 'Job',
					xclass: 'Ext.Panel',
					reference: 'mainForm',
					border: false,
					layout: 'vbox',
					height: '100%',
					scrollable: 'y',
					width: '100%',
					autoSize: true,
					bodyPadding: 10,

					items: [
						{
							xtype: 'textfield',
							label: 'Name',
							bind: '{record.name}',
						},
						{
							xtype: 'textfield',
							label: 'Tags',
							bind: '{record.tags}',
						},
						{
							xtype: 'textfield',
							label: 'Description',
							bind: '{record.description}',
						},
						{
							xtype: 'textfield',
							label: 'Cron string',
							bind: '{record.cron}',
						},
						{

							xtype: 'togglefield',
							label: 'Enabled',
							bind: '{record.enabled}',
						},
						{
							xtype: 'container',
							layout: 'hbox',
							items: [
								{
									xtype: 'label',
									html: 'Workflows'
								},
								{
									xtype: 'spacer'
								},
								{
									xtype: 'button',
									iconCls: 'x-fa fa-search',
									handler: 'selectWorkflows'
								},
								{
									xtype: 'button',
									iconCls: 'x-fa fa-trash',
									handler: 'removeWorkflows',
									bind: {
										disabled: '{!selectedWorkflowStore.count || disableRemoveWorkflows}'
									}
								}
							]
						},
						{
							xtype: 'grid',
							reference: 'selectedWorkflowsGrid',
							bind: {
								store: '{selectedWorkflowsStore}'
							},
							minHeight: '200',
							flex: 1,
							emptyText: 'No workflows selected',
							columns: [
								{
									text: 'Workflow',
									dataIndex: 'workflowName',
									flex: 1,
									editable: false,
								},
								{
									text: 'Alias',
									dataIndex: 'workflowAlias',
									flex: 1
								},
								{
									text: 'Preset',
									dataIndex: 'presetName',
									flex: 1,
									editable: false,
								},
								{
									text: 'Run mode',
									dataIndex: 'runMode',
									width: 80,
								},
								{
									width: 80,
									xtype: 'checkcolumn',
									text: 'Enabled',
									dataIndex: 'enabled',
								},
								{
									width: 70,
									hideable: false,

									cell: {
										tools: {
											approve: {
												iconCls: 'x-fa fa-cog',
												tooltip: 'Configure workflow',
												handler: 'configureWorkflow'
											},
											decline: {
												iconCls: 'x-fa fa-eye',
												handler: 'viewWorkflow',
												weight: 1
											}
										}
									}
								},

							]
						},
					
					]
				},
				{
					xclass: 'Ext.Panel',
					title: 'Workflow configure',
					reference: 'configureWorkflow',
					flex: 1,
					height: '100%',
					tbar: [
						{
							xtype: 'textfield',
							label: 'Alias',
							bind: {
								value: '{selectedWorkflowAlias}'
							}
						},
						{
							xtype: 'textfield',
							label: 'Preset',
							readOnly: true,
							bind: {
								value: '{selectedWorkflowPreset.alias}'
							}
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-search',
							handler: 'selectPreset',
							tooltip: 'Select preset'
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-trash',
							handler: 'removePreset',
							bind: {
								disabled: '{!selectedWorkflowPreset}'
							}
						},
						{
							xclass: 'MrG.fields.RunMode',
							label: 'Run mode',
							bind: {
								value: '{selectedWorkflowRunMode}'
							}
						},
						{
							xtype: 'togglefield',
							label: 'Enabled',
							bind: {
								value: '{selectedWorkflowEnabled}'
							}
						},
						{
							xtype: 'spacer'
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-sync',
							handler: 'refreshWorkflow',
							tooltip: 'Refresh workflow'
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-eye',
							handler: 'viewSelectedWorkflow',
							tooltip: 'View workflow'
						}



					],
					bbar: [

						{
							xtype: 'label',
							bind: {
								html: 'Fields: {selectedFieldsCount}',
								hidden: '{!canSelectFields}'

							}
						},
						{
							xtype: 'spacer'
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-check',
							handler: 'saveWorkflowConfiguration',
							text: 'Submit'
						},
						{
							xtype: 'button',
							iconCls: 'x-fa fa-arrow-left',
							handler: 'backToMainForm',
							text: 'Cancel'
						},

					],
					items: [
						{
							xtype: 'container',
							reference: 'workflowContainer',
							height: '100%',
							flex: 1
						}
					]
				}
			]
		},

	]
});
