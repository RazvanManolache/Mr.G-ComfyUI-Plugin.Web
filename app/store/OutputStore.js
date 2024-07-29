Ext.define('MrG.store.OutputStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.OutputModel',
    proxy: {
        type: 'rest',
        url: '/mrg/outputs',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
    
    
});