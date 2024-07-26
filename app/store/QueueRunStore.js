Ext.define('MrG.store.QueueRunStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.QueueRunModel',
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