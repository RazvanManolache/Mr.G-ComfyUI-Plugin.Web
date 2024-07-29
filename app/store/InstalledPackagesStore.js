Ext.define('MrG.store.InstalledPackagesStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.PackageModel',
    proxy: {
       type: 'rest',
       url: '/mrg/installed_packages',
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