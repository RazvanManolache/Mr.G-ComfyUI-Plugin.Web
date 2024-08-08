Ext.define('MrG.store.OutputStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.OutputModel',
    proxy: {
        type: 'rest',
        url: '/mrg/outputs',
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