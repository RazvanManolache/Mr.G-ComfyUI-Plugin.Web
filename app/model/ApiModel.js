Ext.define('MrG.model.ApiModel', {
    extend: 'MrG.model.WorkflowExtenderModel',
    fields: [
        { name: 'endpoint', type: 'string' },
        { name: 'parameters', type: 'string' },
    ],
    storeIdStart: 'apiStore_',
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/api',
        writer: {
            writeAllFields: true
        }
    },
  
});