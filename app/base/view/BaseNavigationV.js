Ext.define('MrG.base.view.BaseNavigationV', {
    extend: 'MrG.base.view.BaseTabPanelV',
    tabBar: {
        hidden: true
    },
    viewModel: {
        xclass: 'MrG.base.vm.BaseNavigationVM'
    },
    controller: {
        xclass: 'MrG.base.ctrl.BaseNavigationC'
    },
});