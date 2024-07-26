Ext.define('MrG.store.CategoryStore', {
    extend: 'MrG.base.store.BaseTreeStore',
    model: 'MrG.model.CategoryModel',
    //defaultRootText: 'Categories',
    proxy: {
       type: 'ajax',
       url: '/mrg/categories_tree',
       reader: {
           type: 'json',
       }
    },
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().Categories
    // },
    autoLoad: true
});