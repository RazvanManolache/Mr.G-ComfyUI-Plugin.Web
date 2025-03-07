Ext.define('MrG.main.view.QueueV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'queueV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	padding:20,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.QueueVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.QueueC'
	},
	items: [
        {
			xtype: 'container',
            layout: 'hbox',
            items: [
				{ xtype: 'label', html: '<b>Name</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.name}'
					}
				}
            ]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Status</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.status}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Create date</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.create_date}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Last update date</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.update_date}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Run interval</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.start_date} - {record.end_date}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Run type</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{runType}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Steps</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.current}/{record.total}'
					}
				}
			]
		},
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
				{ xtype: 'label', html: '<b>Description</b>', width: 100 },
				{
					xtype: 'label',
					bind: {
						html: '{record.nice_description}'
					}
				}
			]
		},
		{
			xclass: 'MrG.grd.act.view.OutputGridV',
			
		}

	]
});
