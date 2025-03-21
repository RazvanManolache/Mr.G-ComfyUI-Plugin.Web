Ext.define('MrG.main.view.InstallPackageV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'packagesV',
	autoSize: true,
	layout: 'vbox',
	deferredRender: false,
	closable:true,	
	viewModel: {
		xclass: 'MrG.main.vm.InstallPackageVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.InstallPackageC'
	},
	items: [
		{
			xtype: 'textfield',
            label: 'Name',
            readOnly: true,
			bind: {
                value: '{record.name}'
			},			
		},
        {
            readOnly: true,
            label: 'Description',
			xtype: 'textareafield',
			bind: {
                value: '{record.description}'
            },
        },
        {
            readOnly: true,
            xtype: 'textfield',
            label: 'Version',
            bind: {
                value: '{record.version}'
            },
        },
        {
            readOnly: true,
            xtype: 'textfield',
            label: 'Tags',
            bind: {
                value: '{record.tags}'
            },
        },
        {
            readOnly: true,
            label: 'Comments',
            xtype: 'textareafield',
            bind: {
                value: '{record.comments}'
            },
        },
        
        {
            xtype: 'grid',
            autoHeight: true,
            flex:1,
            title: 'Workflows',
            bind: {
                hidden: '{!hasWorkflows}',
                store: '{workflowStore}'
            },
            columns: [
                {
                    text: 'Name',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    flex: 1
                },
                {
                    text: 'Tags',
                    dataIndex: 'tags',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'grid',
            autoHeight: true,
            flex: 1,
            title: 'Apis',
            bind: {
                hidden: '{!hasApis}',
                store: '{apiStore}'
            },
            columns: [
                {
                    text: 'Name',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    flex: 1
                },
                {
                    text: 'Tags',
                    dataIndex: 'tags',
                    flex: 1
                }
            ]

        },
        {
            xtype: 'grid',
            autoHeight: true,
            flex: 1,
            title: 'Jobs',
            bind: {
                hidden: '{!hasJobs}',
                store: '{jobsStore}'
            },
            columns: [
                {
                    text: 'Name',
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    text: 'Description',
                    dataIndex: 'description',
                    flex: 1
                },
                {
                    text: 'Tags',
                    dataIndex: 'tags',
                    flex: 1
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'button',
                    text: 'Install',
                    handler: 'installPackage',
                    iconCls: 'x-fa fa-check',
                    bind: {
                        disabled: '{disableSave}'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Cancel',
                    handler: 'cancel',
                    iconCls: 'x-fa fa-times'
                },
            ]
        }

	]
});
