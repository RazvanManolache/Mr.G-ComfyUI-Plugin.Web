Ext.define('MrG.dialog.view.SelectWorkflowV', {
    extend: 'MrG.base.view.BasePanelV',
    title: 'Select Workflow',
    width: '90%',
    height: '90%',
    modal: true,
    floated: true,
    resizeable: true,
    centered: true,
    maximizable: true,
    scrollable: true,
    closable: true,
    controller: {
        xclass: 'MrG.dialog.ctrl.SelectWorkflowC'
    },
    viewModel: {
        xclass: 'MrG.dialog.vm.SelectWorkflowVM'
    },
    items: [{
        xclass: 'MrG.grd.act.view.WorkflowGridV',
        reference: 'workflowGrid',
    }],
    bbar: {
        items: [
            {
                xtype: 'spacer'
            },
            {
                xtype: 'button',
                text: 'Add',
                handler: 'addWorkflow',
                bind: {
                    disabled: '{!selectedSomething}'
                }
            },
            {
                xtype: 'button',
                text: 'Replace',
                handler: 'replaceWorkflow',
                bind: {
                    disabled: '{!selectedSomething}'
                }
            },
            {
                xtype: 'button',
                text: 'Cancel',
                handler: 'closeDialog'
            }

        ]
    }
});