Ext.define('MrG.grd.act.view.SettingsGridV', {
    extend: 'MrG.base.view.BaseActionGridV',
    alias: 'widget.SettingsGridV',
    requires: [
        'MrG.grd.act.ctrl.SettingsGridC'
    ],
    viewModel: {
        xclass: 'MrG.grd.act.vm.SettingsGridVM'
    },
    controller: {
        xclass: 'MrG.grd.act.ctrl.SettingsGridC'
    },
    title: 'Settings',

    columns: [
        {
            text: 'Name',
            dataIndex: 'name',
            flex: 1
        },
        {
            text: 'Value',
            dataIndex: 'value',
            flex: 1
        }
    ],
    listeners: {
        afterrender: 'onAfterRender'
    }
});