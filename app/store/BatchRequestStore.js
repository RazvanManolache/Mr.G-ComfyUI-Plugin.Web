Ext.define('MrG.store.BatchRequestStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.BatchRequestModel',
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