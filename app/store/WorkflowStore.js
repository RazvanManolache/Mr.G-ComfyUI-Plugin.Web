Ext.define('MrG.store.WorkflowStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.WorkflowModel',
    proxy: {
       type: 'rest',
       url: '/mrg/workflows',
       reader: {
           type: 'json',
       }
    },
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().Packages
    // },
    autoLoad: true
});