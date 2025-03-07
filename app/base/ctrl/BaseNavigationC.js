Ext.define('MrG.base.ctrl.BaseNavigationC', {
    extend: 'MrG.base.ctrl.BaseTabPanelC',
    getSubPanel: function (title) {
        return this.view.down('panel[title=' + title + ']');
    },
    setActiveSubPanel: function (title) {
        this.view.setActiveItem(this.getSubPanel(title));
        this.fireViewEventArgs("activeNavigationItemChanged", [this.view.title, title]);
    },
    newGridItem: function (type, title) {
        this.fireViewEventArgs("newGridItem", [type, title, this.view.title]);
    },
    openGridItem: function (type, title, record) {
        this.fireViewEventArgs("openGridItem", [title, this.view.title, record]);
    },
    openFileGridItem: function (type, title) {
        this.fireViewEventArgs("openFileGridItem", [type, title, this.view.title]);
    },
    addSubPanel: function (title, xclass, record) {
        
        if (this.getSubPanel(title) == null) {
            this.view.add({
                xclass: xclass,
                title: title,
                _mrgRecord: record,
                listeners: {
                    openGridItem: 'openGridItem',
                    newGridItem: 'newGridItem',
                    openFileGridItem: 'openFileGridItem',
                }
            });
            if (this.view.items.items.length == 2) {
                this.setActiveSubPanel(title);
            }
        }
    }
});