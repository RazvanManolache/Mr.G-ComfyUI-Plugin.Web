Ext.define('MrG.store.WorkflowStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.WorkflowModel',
    proxy: {
        type: 'rest',
        url: '/mrg/workflows',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
});