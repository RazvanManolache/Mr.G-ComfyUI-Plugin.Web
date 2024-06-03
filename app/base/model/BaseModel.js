Ext.define('MrG.base.model.BaseModel', {
    extend: 'Ext.data.Model',
    idProperty: 'uuid',
    storeIdStart: null,
    updateStores: function () {
        var stores = Ext.StoreManager.keys.filter(a => a.indexOf(this.storeIdStart) == 0);
        for (var i = 0; i < stores.length; i++) {
            var store = Ext.StoreManager.get(stores[i]);
            if (store) {
                store.load();
            }
        }
    },
    save: function () {
        this.callParent(arguments);
        if (this.storeIdStart) {
            this.updateStores();
        }
    },
    erase: function () {
        this.callParent(arguments);
    },
    
});