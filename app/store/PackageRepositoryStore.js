Ext.define('MrG.store.PackageRepositoryStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.PackageRepositoryModel',
    proxy: {
       type: 'rest',
       url: '/mrg/package',
       reader: {
           type: 'json',
       }
    },
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().PackageRepository
    // },
    autoLoad: true
});