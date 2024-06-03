Ext.define('MrG.dialog.ctrl.SelectWorkflowC', {
    extend: 'MrG.base.ctrl.BasePanelC',
    init: function () {
        this.callParent(arguments);

        var grid = this.lookup('workflowGrid');
        grid.getViewModel().set("selectionMode", true);
    },
    workflowStoreDataChanged: function (store) {
        var items = store.query("selected", true).items;
        this.set("selectedItems", items);
    },
    closeDialog: function () {
        this.view.close();
    },
    addWorkflow: function () {
        this.view.fireEventArgs("selectionDone", [this.get("selectedItems"), false]);
        this.closeDialog();
    },
    replaceWorkflow: function () {
        this.view.fireEventArgs("selectionDone", [this.get("selectedItems"), true]);
        this.closeDialog();
    }

});