Ext.define('MrG.store.PackagesStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.PackageModel',
    proxy: {
       type: 'rest',
       url: '/mrg/packages',
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