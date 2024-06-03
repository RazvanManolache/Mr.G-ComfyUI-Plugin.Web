Ext.define('MrG.main.vm.BaseEmbedWorkflowVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {
        record: null,
        selectedWorkflowPreset: null,
        selectedWorkflowRunMode: 'qa',
        selectedWorkflowEnabled: false,
        selectedWorkflowAlias: '',
        canSelectFields: false,
    },
    formulas: {
        disableRemoveWorkflows: function (get) {
            return false;
        }
    },
    stores: {
        selectedWorkflowsStore: {
            xclass: 'MrG.store.WorkflowConfigureStore',
           
        },
    }
});