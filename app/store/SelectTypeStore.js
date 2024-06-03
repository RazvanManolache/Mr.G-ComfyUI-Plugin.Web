Ext.define('MrG.store.SelectTypeStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.SelectTypeModel',
    storeId: 'MrG.store.SelectTypeStore',
    requires: [
        'MrG.base.store.BaseStore'
    ],
    singleton: true,
    autoLoad: true,
    dataLoadedFirstTime: false,
    listeners: {
        load: function (store, records, successful, operation, eOpts) {
            console.log("types loaded");

        }
    }
});