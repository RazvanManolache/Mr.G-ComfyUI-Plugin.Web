Ext.define('MrG.model.CategoryModel', {
    extend: 'MrG.base.model.BaseTreeModel',
    idProperty: 'uuid',
    fields: [
        { name: 'uuid', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'order', type: 'number' },
        { name: 'system', type: 'boolean' },
        { name: 'expanded', type: 'boolean', defaultValue:true},
        { name: 'description', type: 'string' },
        
        { name: 'parent_uuid', type: 'string' },
        {
            name: 'iconCls',
            calculate: function (data) {
                return data.icon;
            }
        }
       
    ],
    storeIdStart: 'categoriesStore_',
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/categories',
        writer: {
            writeAllFields: true
        }
    },
});