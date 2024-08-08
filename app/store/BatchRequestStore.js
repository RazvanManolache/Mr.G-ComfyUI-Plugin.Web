Ext.define('MrG.store.BatchRequestStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.BatchRequestModel',
    proxy: {
        type: 'rest',
        url: '/mrg/batch_requests',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message'
        }
    },
    autoSync: true,
    autoLoad: true
    
    
    
});