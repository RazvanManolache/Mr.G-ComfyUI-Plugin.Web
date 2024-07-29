Ext.define('MrG.store.AvailablePackagesStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.PackageModel',
    proxy: {
       type: 'rest',
       url: '/mrg/available_packages',
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