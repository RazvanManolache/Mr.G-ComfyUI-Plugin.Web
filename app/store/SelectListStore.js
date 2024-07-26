Ext.define('MrG.store.SelectListStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.SelectListModel',
    proxy: {
       type: 'rest',
       page: '',
       api: {
           read: '/mrg/selection_items'
       }
    }
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().SelectList
    // },
});