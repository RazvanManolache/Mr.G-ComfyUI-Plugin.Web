Ext.define('MrG.main.view.WorkflowV', {	
	extend: "MrG.base.view.BasePanelV",
	width: '100%',
	height: '100%',
	mrgReference: 'workflowV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,
	bind: {
		title: '{(workflowData.dirty? "*" :"") + workflowData.name }'
	},
	viewModel: {
		xclass: 'MrG.main.vm.WorkflowVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.WorkflowC'
	},
	masked: {
		xtype: 'loadmask',
		message: 'Worflow is loading...'
	},
	bbar: {
		bind: {
			hidden: '{hideWorkflowBBar}'
		},
		items: [			
			{
				xclass: 'MrG.fields.RunMode',
				bind: {
					hidden: '{hideWorkflowRun}'
				},
				listeners: {
					change: 'runModeChangedUI'
				},
				
			},
			{
				xtype: 'button',
				text: 'run',
				iconCls: 'x-fa fa-play',
				
				bind: {
					disabled: '{disableGenerate}',
					hidden: '{hideGenerate || hideWorkflowRun}'
				},
				listeners: {
					tap: 'runWorkflow'
				}
			},
			{
				xtype: 'button',
				tooltip: 'Sequence fields',
				iconCls: 'x-fa fa-exchange-alt',

				bind: {
					disabled: '{disableNavigateStep}',
					hidden: '{hideWorkflowRun || readOnlyWorkflow}'
				},
				listeners: {
					tap: 'openNavigateSteps'
				}
			},
			{
				xtype: 'button',
				iconCls: 'x-fa fa-sliders-h',
				tooltip: 'Run settings',
				bind: {
					disabled: '{disableWorkflowSettings}',
					hidden: '{hideWorkflowRun || readOnlyWorkflow}'
				},
				listeners: {
					tap: 'openWorkflowSettings'
				}
			},
			{
				xtype: 'spacer'
			}, 
			{
				xtype: 'button',
				bind: {
					hidden: '{hideWorkflowQueue}'
				},
				text: 'queue',
				iconCls: 'x-fa fa-tasks',
			}
		]
	},
	tbar: 
		{
			xtype: 'toolbar',
			docked: 'top',
			items: [
			
				{
					xtype: 'searchfield',
					clearable:true,					
					bind: {						
						hidden: '{hideSearch}'
					},
					listeners: {
						change: 'searchValueChanged'
					}
				},
				{
					xtype: 'button',
					tooltip: 'Search options',
					iconCls: 'x-fa fa-search-plus',
					menu: {
						anchor: true,
						bind: {
							indented: '{indented}'
						},
						items: [

							{
								xtype: 'menucheckitem',
								text: "Keep selected items",
								labelWidth: 'auto',
								bind: {
									checked: '{searchKeepSelected}'
								}
							},
							{
								xtype: 'menucheckitem',
								separator: true,
								text: 'Search in titles',
								labelWidth: 'auto',
								bind: {
									checked: '{searchUseTitle}',
								},
							},
							{
								xtype: 'menucheckitem',
								text: 'Search in descriptions',
								labelWidth: 'auto',
								bind: {
									checked: '{searchUseDescription}',
								},
							},
							{
								xtype: 'menucheckitem',
								text: 'Search also comfy category',
								labelWidth: 'auto',
								bind: {
									checked: '{searchUseComfyMenu}',
								},
							},
							{
								xtype: 'menucheckitem',
								separator: true,
								text: 'Search in field names',
								labelWidth: 'auto',
								bind: {
									checked: '{searchUseFields}',
								},
							},
							
							
						
						]
					},
				},
				{
					xtype: 'spacer'
				}, 
				{
					xtype: 'button',
					iconCls: 'x-fa fa-rotate-left',
					bind: {
						disabled: '{disableUndo}',
						hidden: '{hideUndo || hideWorkflowOptions}'
					}
				},
				{
					xtype: 'button',
					iconCls: 'x-fa fa-rotate-right',
					bind: {
						disabled: '{disableRedo}',
						hidden: '{hideRedo || hideWorkflowOptions}'
					}
				},
				{ 
					xtype: 'spacer'
				}, 
				
				{
					xtype: 'button',
					tooltip: 'Edit details',
					iconCls: 'x-fa fa-pen',
					enableToggle: true,	
					handler: 'showEditForm',
					bind: {
						pressed: '{pressedShowEditForm}',
						hidden: '{hideEditDetails || hideWorkflowOptions}'
					}
				},
				{
					xtype: 'button',
					tooltip: 'Save',
					iconCls: 'x-fa fa-save',
					handler: 'saveWorkflow',
					bind: {
						disabled: '{workflowData.name==""}',
						hidden: '{workflowData.system || hideWorkflowOptions}'
					}
				},
				{
					xtype: 'button',
					tooltip: 'Presets',
					iconCls: 'x-fa fa-marker',
					bind: {
						hidden: '{hideWorkflowOptions}'
					},
					menu: {
						anchor: true,
						bind: {
							indented: '{indented}'
						},
						items: [
							{
								iconCls: 'x-fa fa-highlighter',
								text: 'Create preset',
								handler: 'createPreset'
							},
							{
								iconCls: 'x-fa fa-edit',
								text: 'Load preset',
								handler: 'selectPreset'
							},
							
						]
					},
				},
				{
					xtype: 'button',
					tooltip: 'Settings',
					iconCls: 'x-fa fa-tools',
					bind: {
						hidden: '{hideWorkflowOptions}'
					},
					menu: {
						anchor: true,
						bind: {
							indented: '{indented}'
						},
						items: [
							{
								separator: true,
								iconCls: 'x-fa fa-file-download',
								text: 'Export workflow',
								handler: 'exportWorkflow'
							},
							{
								separator: true,
								xtype: 'menucheckitem',
								text: 'Autosave after run',
								labelWidth: 'auto',
								bind: {
									checked: '{autoSaveAfterRun}',
								},
							},
							{
								xtype: 'menucheckitem',
								text: 'Autosave',
								labelWidth: 'auto',
								bind: {
									checked: '{autoSave}',
								},
							},
							{
								separator: true,
								xtype: 'menucheckitem',
								text: 'Use all modified fields for description of output',
								labelWidth: 'auto',
								bind: {
									checked: '{modifiedFieldsOutputDescription}',
								},
							},
							{
								xtype: 'menucheckitem',
								text: 'Use all visible fields for description of output',
								labelWidth: 'auto',
								bind: {
									checked: '{visibleFieldsOutputDescription}',
								},
							},
							{
								separator: true,
								iconCls: 'x-fa fa-link',
								text: 'Autolink nodes',
								bind: {
									hidden: '{hideautoConnect}'
								},
								handler: 'autoConnect'
							},
							{
								iconCls: 'x-fa fa-unlink',
								text: 'Unlink nodes',
								bind: {
									hidden: '{hideautoConnect}'
								},
								handler:  'unlinkNodes'
							},
							{
								separator: true,
								xtype: 'menucheckitem',
								text: 'Show description',
								labelWidth: 'auto',
								bind: {
									checked: '{showDescription}',
								},
							},
							{
								separator: true,
								xtype: 'menucheckitem',
								text: 'Hide titles',
								labelWidth: 'auto',
								bind: {
									checked: '{hideTitles}'
								}
							},
							{
								xtype: 'menucheckitem',
								separator: true,
								text: 'Hide all connections',
								labelWidth: 'auto',
								bind: {
									checked: '{hideConnections}',
								},
							},
							{
								xtype: 'menucheckitem',	
								text: 'Hide in connections',
								labelWidth: 'auto',
								bind: {
									disabled: '{hideConnections}',
									checked: '{hideInConnections}',
								},
							},
							{
								xtype: 'menucheckitem',
								text: 'Hide out connections',
								labelWidth: 'auto',
								bind: {
									disabled: '{hideConnections}',
									checked: '{hideOutConnections}',
								},
							},
							{
								separator: true,
								xtype: 'menucheckitem',
								text: 'Show hidden fields',
								labelWidth: 'auto',
								bind: {
									checked: '{forceShowHiddenFields}'
								}
							},
							{
								xtype: 'menucheckitem',
								text: 'Hide all fields',
								labelWidth: 'auto',
								bind: {
									checked: '{forceHideFields}'
								}
							},
							{
								xtype: 'menucheckitem',
								separator: true,
								text: 'Hide field options',
								labelWidth: 'auto',
								bind: {
									checked: '{hideModifying}'
								}
							},
							{
								xtype: 'menucheckitem',
								text: 'Hide node options',
								labelWidth: 'auto',
								bind: {
									checked: '{hideConfigure}'
								}
							},
							{
								xtype: 'menucheckitem',
								separator: true,
								text: 'Show hidden nodes',
								labelWidth: 'auto',
								bind: {
									checked: '{showHiddenNodes}',
									hidden: '{!canHideNodes}'
								}
							},
							{
								xtype: 'menucheckitem',
								text: 'Can select nodes',
								separator: true,
								labelWidth: 'auto',
								bind: {
									checked: '{canSelectNodes}',
									hidden: '{canHideNodes}'
								}
							},
						]
					},
				},
				{
					xtype: 'label',
					html: 'Preset creation',
					bind: {
						hidden: '{!presetCreation}'
					},
				}
			]
		}		
	,
	items: [
		{
			xtype: 'panel',
			layout: 'vbox',

			bind: {
				hidden: '{!presetCreation}'
			},
			border: true,
			items: [
				{
					xtype: 'textfield',
					label: 'Name',
					bind: {
						value: '{presetData.alias}'
					}
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xclass: 'Ext.field.Text',
							label: 'Tags',
							flex: 2,
							bind: {
								value: '{presetData.tags}',
								readOnly: '{autogeneratePresetTags}'
							}
						},
						{
							xclass:'Ext.field.Toggle',
							label: 'Autogenerate',
							width:100,
							bind: {
								value: '{autogeneratePresetTags}',
								
							}
						}
					]
				},
				{
					xtype: 'container',
					layout: 'hbox',
					items: [
						{
							xclass: 'MrG.fields.TextArea',
							label: 'Description',
							
							flex: 2,
							bind: {
								value: '{presetData.description}',
								readOnly: '{autogeneratePresetDescriptions}'
							}
						},
						{
							xclass: 'Ext.field.Toggle',
							label: 'Autogenerate',
							width: 100,
							bind: {
								value: '{autogeneratePresetDescriptions}'
							}

						}

					]
				},
				
			],
			bbar: {
				items: [
					{
						xtype: 'spacer'
					},

					{
						xtype: 'button',
						handler: 'savePreset',
						text: 'Save',
						tooltip: 'Accept and save all changes',
						iconCls: 'x-fa fa-save',
						bind: {
							disabled: '{!presetData.alias}'
						}
					},
					{
						xtype: 'button',
						handler: 'cancelPreset',
						text: 'Cancel',
						iconCls: 'x-fa fa-times'
					},
					{
						xtype: 'spacer'
					},
				]
			},
		},
		{
			xtype: 'panel',
			layout: 'vbox',
			
			bind: {
				hidden: '{hideEditForm}'
			},
			border: true,
			items: [
				{
					xtype: 'textfield',
					label: 'Name',					
					bind: {
						value: '{workflowData.name}'
					}
				},
				{
					xtype: 'textareafield',
					label: 'Description',
					bind: {
						value: '{workflowData.description}'
					}
				},
				
				{
					xtype: 'container',
					layout: 'hbox',

					items: [
						{
							xtype: 'textfield',
							label: 'Tags',
							flex:2,
							bind: {
								value: '{workflowData.tags}'
							}
						},
						{
							xtype: 'numberfield',
							label: 'Rating',
							flex:1,
							minValue: 0,
							maxValue: 10,
							bind: {
								value: '{workflowData.rating}'
							}
						},
						{
							xtype: 'checkboxfield',
							label: 'Favorite',
							flex: 1,
							minValue: 0,
							maxValue: 10,
							bind: {
								value: '{workflowData.favourite}'
							}
						}
					]
				},
				
				
			],
			bbar: {
				items: [
					{
						xtype: 'spacer'
					},

					{
						xtype: 'button',
						handler: 'saveWorkflow',
						text: 'Save',
						tooltip: 'Accept and save all changes',
						iconCls: 'x-fa fa-save',
						bind: {
							disabled: '{workflowData.name==""}',
							hidden: '{workflowData.system}'
						}
					},
					{
						xtype: 'button',
						text: 'Save as',
						tooltip: 'Save as',
						handler: 'saveAsWorkflow',
						iconCls: 'x-fa fa-files-o',
						bind: {
							disabled: '{workflowData.name==""}',
						}
					},
					{
						xtype: 'button',
						handler: 'acceptChangesWorkflow',
						text: 'Accept changes',
						iconCls: 'x-fa fa-check',
						bind: {
							disabled: '{workflowData.name==""}',
						}
					},
					{
						xtype: 'button',
						handler: 'cancelEditWorkflow',
						text: 'Cancel',
						iconCls: 'x-fa fa-times'
					},
					{
						xtype: 'spacer'
					},
				]
			},
		},
		{
			xtype: 'container',
			bind: {
				hidden: '{!showDescription}'
			},
			style: 'background:lightyellow',
			items: [
				{
					xtype: 'label',
					bind: {
						html: '{workflowData.description}'
					}
				}
			]

		},
		{
			//TODO: make it scroll properly
			xtype: 'container',
			platformConfig: {
				desktop: {
					layout: 'hbox',
				},
				'!desktop':{
					layout: 'vbox',
				}
			},
			height:'100%',
			items: [
				{
					xclass: "Ext.Panel",
					flex: 1,
					reference: 'workflowView',
					dock: 'left',
					scrollable: true, 
					height: '100%',
					bind: {
						hidden: '{hideComfy}'
					},

					//TODO: how to resize these well
				},

				{
					height: '100%',
					xclass: "Ext.Panel",
					hideMode: 'visibility',
					reference: 'comfyView',
					platformConfig: {
						desktop: {
							bind: {
								width: '{iframeWidth}',
								flex: '{iframeFlex}'
							},
							//collapsible: 'right',

							resizable: {
								split: true,
								edges: 'west',
							},

							height: '100%',
							dock: 'right',
						},
						'!desktop': {
							bind: {
								height: '{iframeHeight}',
								flex: '{iframeFlex}'
							},
							width: '100%',
							resizable: {
								split: true,
								edges: 'north',
							},
							dock: 'bottom',
						}
					},
					flex:1,
					scrollable: 'y',
					layout: 'vbox',
					listeners: {
						initialize: function (cmp) {
							var ctrl = this.up('[mrgReference=workflowV]').getController();
							ctrl.comfyViewInit(cmp);
							var comp = cmp.el.dom.children[1];							
							comp.addEventListener('pointerdown', function () {
								ctrl.comfyViewPointerDown(cmp);
							});
							comp.addEventListener('pointerup', function () {
								ctrl.comfyViewPointerUp(cmp);
							})
						},
						resizedragstart: function (cmp) {
							var ctrl = this.up('[mrgReference=workflowV]').getController();
							ctrl.comfyViewResizeStart(cmp);
							
						},
						resizedragend: function (cmp) {
							var ctrl = this.up('[mrgReference=workflowV]').getController();
							ctrl.comfyViewResizeEnd(cmp);
						}
					},

					html: [
						'<div style="width:100%;height:100%;position:relative;"><div style="position:absolute;top:0;left:0;width:100%;height:100%;visibility:collapse"></div><iframe style="width:100%;height:100%"></iframe></div>'
					],
					


				},
			]
		},
		
	],
	deferredRender: false,

});
