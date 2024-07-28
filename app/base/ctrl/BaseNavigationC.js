Ext.define('MrG.base.ctrl.BaseNavigationC', {
    extend: 'MrG.base.ctrl.BaseTabPanelC',
    getSubPanel: function (title) {
        return this.view.down('panel[title=' + title + ']');
    },
    setActiveSubPanel: function (title) {
        this.view.setActiveItem(this.getSubPanel(title));
    },
    addSubPanel: function (title, xclass) {
        this.view.add({
            xclass: xclass,
            title: title,
            listeners: {
                openGridItem: 'openGridItem',
                newGridItem: 'newGridItem',
                openFileGridItem: 'openFileGridItem',
            }
        })
    }
});