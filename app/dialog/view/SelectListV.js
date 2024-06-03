Ext.define('MrG.dialog.view.SelectListV',{
	extend: 'MrG.base.view.BasePanelV',
	layout: 'vbox',
	reference: 'selectListPanel',
	modal: true,
	controller: {
		xclass: 'MrG.dialog.ctrl.SelectListC'
	},
	viewModel: {
		xclass: 'MrG.dialog.vm.SelectListVM'
	},
	listeners: {
		hide: 'selectionCanceled',
		show: 'showingSelector'
	},
	requires: [
		'Ext.grid.rowedit.Plugin'
	],
	bind: {
		title: '{title}'
	},
	width: '90%',
	height: '90%',
	modal: true,
	floated:true,
	resizeable: true,
	centered: true,
	maximizable: true,
	scrollable: true,
	closable: true,
	

	items: [{
		xclass: 'Ext.Container',
		layout: 'vbox',
		height:'100%',
		items: [
			{
				xclass: 'Ext.Container',
				layout: 'vbox',
				flex:1,
				items: [					
					{
						xclass: 'MrG.cmp.view.TagPanelV',
						reference: 'tagPanel',
					
						bind: {
							store: '{selectListStore}'
						}
					},
					{
						xtype: 'searchfield',
						listeners: {
							change: 'searchValueChanged'
						}
					},
					{
						xclass: 'Ext.Container',
						reference: 'containerGrid',
						layout:'vbox',
						flex: 1,
						width:'100%'
					},
					{
						xclass: 'Ext.Container',
						reference: 'selectionButtons',
						layout: 'hbox',
						wrap: true,
						items: [
							{
								xclass: 'Ext.Button',
								text: 'Click to select',
								enableToggle: true,
								bind: {
									pressed: '{clickToSelect}'
								},
							},
							{
								xclass: 'Ext.Button',
								text: 'Simple selection',
								handler: 'simpleSelection',
								bind: {
									hidden: '{!hideSelectColumn || singleSelect}'
								}
							},
							{
								xclass: 'Ext.Button',
								text: 'Weighted selection',
								handler: 'weightedSelection',
								bind: {
									hidden: '{!hideSelectCountColumn || singleSelect}'
								}
							},
							//{
							//	xclass: 'Ext.Button',
							//	text: 'Delete selected',
							//	handler: 'deleteSelected',
							//	bind: {
							//		disabled: '{disableDeleteSelected}'
							//	}
							//},
							{
								xclass: 'Ext.Button',
								text: 'Invert selection',
								handler: 'invertSelection',
								bind: {
									hidden: '{singleSelect}'
								}
							},
							{
								xclass: 'Ext.Button',
								text: 'Clear selection',
								handler: 'clearSelection',
								bind: {
									disabled: '{disableClearSelection}',
									hidden: '{singleSelect}'
								}
							},
							{
								xclass: 'Ext.Button',
								text: 'Deselect visible',
								handler: 'deselectVisible',
								bind: {
									disabled: '{disableDeselectVisible}',
									hidden: '{singleSelect}'
								}
							},
							{
								xclass: 'Ext.Button',
								text: 'Select visible',
								handler: 'selectVisible',
								bind: {
									disabled: '{disableSelectVisible}',
									hidden: '{singleSelect}'
								}
							},

						]
					},
				]
			},
			{
				xclass: 'Ext.form.Panel',
				title: 'Add/edit form',
				layout: 'vbox',
				collapsible: {
					collapsed: false,
					direction: 'bottom'
				},
				resizable: {
					split: true,
					edges: 'north'
				},
				dock: 'bottom',
				bind: {
					collapsed: '{editCollapsed}',
					hidden: '{hideAdd}'
				},
				items: [
					{
						xclass: 'Ext.field.Text',
						reference: 'aliasField',
						label: 'Alias',
						bind: {
							
							value: '{editedObject.alias}'
						},
						
					},
					{
						xclass: 'Ext.field.TextArea',
						reference: 'textArea',
						label: 'Text',
						bind: {							
							value: '{editedObject.text}'
						},
						validators: function () {
							return this.up('[reference=selectListPanel]').getController().textAreaValueChanged();
						}
						
					},
					{
						xclass: 'Ext.field.Text',
						reference: 'tagField',
						label: 'Tags',
						bind: {
							hidden: '{hideTagField}',
							value: '{editedObject.tags}'
						},
						listeners: {
							change: 'tagFieldValueChanged'
						}
					},
					{
						xclass: 'Ext.field.TextArea',
						reference: 'commentsArea',
						label: 'Comments',
						bind: {
							value: '{editedObject.comments}'
						},						
					},
					{
						xclass: 'Ext.field.Number',
						reference: 'ratingField',
						label: 'Rating',
						bind: {
							value: '{editedObject.rating}'
						},
					},
					{
						xclass: 'Ext.Container',
						reference: 'textButtons',
						layout: 'hbox',
						wrap: true,
						items: [
							{
								xclass: 'Ext.Button',
								text: 'Add',
								handler: 'addAsNew',
								bind: {
									disabled: '{disableAddAsNew}',
									hidden: '{hideAddAsNew}',
								}
							},
							{
								xclass: 'Ext.Button',
								text: 'Replace',
								handler: 'replaceRecord',
								bind: {
									hidden: '{hideReplaceRecord}',
								}
							},
						]
					},
				]
			},
			
			
		]
	}],
	
	bbar: {
		items: ['->', {
			xtype: 'label',
			bind: {
				html: '{selectedCountText}'
			}
		}, '->', {
				xtype: 'button',
				text: 'add',
				handler: 'selectionAdd',
			bind: {
					hidden: '{hideAddRecordsButton}',
					disabled: '{disableAddRecordsButton}'
				}
			},
			{
				xtype: 'button',
				text: 'replace',
				handler: 'selectionReplace',
				bind: {
					disabled: '{disableReplaceRecordsButton}'
				}
			},
			{
				xtype: 'button',
				text: 'cancel',
				handler: 'selectionCanceled'
			}]
	},
});