Ext.define('MrG.main.view.InstallPackageV', {	
	extend: "MrG.base.view.BasePanelV",	
	mrgReference: 'packagesV',
	layout: 'card',
	deferredRender: false,
    closable: true,    
	viewModel: {
		xclass: 'MrG.main.vm.InstallPackageVM'
	},
	controller: {
		xclass: 'MrG.main.ctrl.InstallPackageC'
	},
    items: [
        {
            xtype: 'panel',
            layout: 'vbox',
            reference: 'configPanel', // this is the panel that will be shown when the package is being configured''
            flex:1,
            scrollable: 'y',
            items: [{
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
                    xtype: 'panel',
                    reference: 'parametersPanel',
                    title: 'Parameters',
                    layout: 'vbox',
                    items: [

                    ]
                },

                {
                    xtype: 'grid',
                    autoHeight: true,
                    minHeight: 200,
                    title: 'Workflows',
                    reference: 'workflowGrid',
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
                    title: 'Apis',
                    minHeight: 200,
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
                    minHeight: 200,
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
                },]
        },
        {
            xtype: 'panel',
            height: '100%',
            width:'90%',
            layout: {
                type: 'vbox',
                align: 'center',
            },
            reference: 'installPanel', // this is the panel that will be shown when the package is being installed'
            
            scrollable: 'y',
            items: [
                {
                    xtype: 'label',
                    html: '<h2>Installing package...</h2>',
                    margin: 20,

                },
                {
                    xtype: 'label',
                    margin: 10,
                    bind: {
                        html: '{installStatus}'
                    }
                },
                {
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                    },
                    width: '100%',
                    bind: {
                        hidden: '{!hasFilesToDownload}'
                    },
                    items: [
                       
                        {
                            xtype: 'progress',
                            width: '90%',
                            shadow: true,
                            margin: 10,
                            bind: {
                                text: '{fileDownloadText}',
                                value: '{fileDownloadPercentage}',
                                hidden: '{!progress.downloadedFile}'
                            }
                        },
                        
                    ]
                },
                
                {
                    xtype: 'textareafield',
                    label: 'Errors:',
                    bind: {
                        value: '{progress.error}',
                        hidden: '{!progress.error}'
                    }
                }
            ]
        },
       

    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Install',
                handler: 'installPackage',
                iconCls: 'x-fa fa-check',
                bind: {
                    disabled: '{!fieldsValid}',
                    hidden: '{installing}'
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
});
