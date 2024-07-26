Ext.define('MrG.store.QueueStepStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.QueueStepModel',
    sorters: 'alias',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        },

    }
});