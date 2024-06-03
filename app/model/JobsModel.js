Ext.define('MrG.model.JobsModel', {
    extend: 'MrG.model.WorkflowExtenderModel',
    fields: [
        { name: 'cron', type: 'string' },
    ],
    storeIdStart: 'jobsStore_',
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/jobs',
        writer: {
            writeAllFields: true
        }
    },
   
});