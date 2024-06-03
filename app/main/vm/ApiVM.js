Ext.define('MrG.main.vm.ApiVM', {
    extend: 'MrG.main.vm.BaseEmbedWorkflowVM',
    data: {
        canSelectFields: true,
        selectedFieldsCount: 0,
        fileExtension: '.mrga'
    },
    stores: {
        parametersStore: {
            xtype: 'MrG.store.FieldSelectionStore',
            groupField: 'workflowName',
            isTreeStore: true
        },
        selectedWorkflowParametersStore: {
            xtype: 'MrG.store.FieldSelectionStore',
            listeners: {
                datachanged: 'onSelectedWorkflowParametersStoreDataChanged'
            }
        }
    }
});