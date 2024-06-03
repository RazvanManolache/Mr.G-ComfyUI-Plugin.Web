Ext.define('MrG.model.SelectTypeModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'field', type: 'string' },
        { name: 'cls', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'alias', type: 'string' },
    ],
   
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/selection_items_types',
    },
});