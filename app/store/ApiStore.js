Ext.define('MrG.store.ApiStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.ApiModel',
    proxy: {
        type: 'rest',
        url: '/mrg/api',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
});