Ext.define('MrG.base.store.BaseMemoryStore', {
    extend: 'Ext.data.Store',
    data: [],
    proxy: {
        type: "memory"
    }
});