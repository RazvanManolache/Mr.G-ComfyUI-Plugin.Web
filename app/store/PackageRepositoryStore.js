Ext.define('MrG.store.PackageRepositoryStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.PackageRepositoryModel',
    storeIdStart: 'package_repositoriesStore_',
    proxy: {
       type: 'rest',
       url: '/mrg/package_repositories',
       reader: {
           type: 'json',
       }
    },   
    autoLoad: true
});