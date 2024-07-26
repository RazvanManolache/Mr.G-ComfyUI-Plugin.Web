Ext.define('MrG.store.OutputStore', {
    extend: 'MrG.base.store.BaseMemoryStore',
    model: 'MrG.model.OutputModel',
    proxy: {
       type: 'memory',
       reader: {
           type: 'json',
           rootProperty: 'data'
       },
       writer: {
           type: 'json'
       },
    },
    
    
});