Ext.define('MrG.grd.act.view.QueueGridV', {
    extend: 'MrG.base.view.BaseActionGridV',
    viewModel: {
        xclass: 'MrG.grd.act.vm.QueueGridVM'
    },
    controller: {
        xclass: 'MrG.grd.act.ctrl.QueueGridC'
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
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            bind: {
                disabled: '{disableAddGridItem}'
            },
            menu: {
                items: [
                    {
                        icon: 'x-fa fa-file-medical',
                        handler: 'newGridItem',
                        bind: {
                            text: 'New {typeGrid}'
                        }
                    },
                    {
                        icon: 'x-fa fa-upload',
                        text: 'Import file',
                        handler: 'openFileGridItem',
                    },
                ]
            }

        },
        {
            iconCls: 'x-fa fa-pen',
            handler: 'editGridItem',
            bind: {
                disabled: '{disableEditGridItem}'
            }
        },
        {
            iconCls: 'x-fa fa-trash',
            handler: 'deleteGridItem',
            bind: {
                disabled: '{disableDeleteGridItem}'
            }
        }
    ],
});