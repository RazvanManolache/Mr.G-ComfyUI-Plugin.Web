Ext.define('MrG.dialog.vm.SelectWorkflowVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {
        selectedItems: [],
    },
    formulas: {
        selectedSomething: function (get) {
            return get("selectedItems").length > 0;
        }
    },
    stores: {
        workflowStore: {
            xclass: 'MrG.store.WorkflowStore',
            listeners: {
                datachanged: 'workflowStoreDataChanged'
            }
        },
    }
});