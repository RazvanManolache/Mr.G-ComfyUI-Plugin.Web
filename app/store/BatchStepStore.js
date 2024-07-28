Ext.define('MrG.store.BatchStepStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.BatchStepModel',
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