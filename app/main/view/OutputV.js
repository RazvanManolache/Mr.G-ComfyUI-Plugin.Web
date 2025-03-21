Ext.define('MrG.main.view.OutputV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'outputV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.OutputVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.OutputC'
	},
	items: [
		{
			xtype: 'panel',
			layout: 'vbox',
			items: [
				{
					xtype: 'panel',
					layout: 'hbox',
					items: [
						
                        {
                            xtype: 'spacer'
						},
						
						{
							xtype: 'button',
							text: 'Download',
							handler: 'downloadOutput'
						}
                    ]
				},
				{
					xtype: 'panel',
					
					layout: 'vbox',
					items: [

						{
							xtype: 'image',
							bind: {
								src: '{record.sourceUrl}',
								hidden: '{!record.isImage}'
							},
							listeners: {
								
								load: function (caller) {
									var src = caller.getSrc();
									var image = new Image();
									image.src = src;
									image.onload = function () {
										var width = 100;
										var height = 100;
										if (this.height > height) {
											height = this.height;
											width = this.width;
										}
										else {
											if (this.height > this.width) {
												width = this.width * (height / this.height);
											} else {
												height = this.height * (width / this.width);
											}
										}
										if (height > 500) {
											height = 500;
											width = this.width * (height / this.height);
										}
										caller.setWidth(width);
										caller.setHeight(height);
									};
								},
							
							}
						},
						{
							xtype: 'textareafield',
							bind: {
								value: '{record.sourceUrl}',
								hidden: '{!record.isText}'
							},
						}
					]
				},
				{
					xtype: 'panel',
					layout: 'hbox',
					items: [
						{
							xtype: 'textfield',
							label: 'Workflow name',
							readOnly: true,
							bind: {
								value: '{record.workflow_name}',
							}

						},
						{
							xtype: 'button',
							text: 'Open Workflow',
							handler: 'openWorkflow'
						},
						{
							xtype: 'button',
							text: 'Open Workflow with these parameters',
							handler: 'openWorkflowWithParams'
						},
					]
				},
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
								value: '{record.rating}',
							}
						},
					]
				},
				{
					xclass: 'MrG.fields.TextArea',
					label: 'Tags',
					bind: {
						value: '{record.tags}',
					}
				},
				{
					xtype: 'textfield',
					label: 'Create date',
					readOnly: true,
					bind: {
						value: '{record.create_date}',
					}
				},
			
				{
					xtype: 'textfield',
					label: 'Parameters',
					bind: {
						value: '{record.description}',
					}
				}
				
			]
		}
	]
});
