Ext.define('MrG.store.JobsStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.JobsModel',
    proxy: {
       type: 'rest',
       url: '/mrg/jobs',
       reader: {
           type: 'json',
       }
    },
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().Jobs
    // },
    autoLoad: true
});