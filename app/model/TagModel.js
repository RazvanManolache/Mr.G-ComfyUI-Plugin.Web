Ext.define('MrG.model.TagModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'badge', type: 'number' },
        { name: 'visible', type: 'boolean', default:true },
        { name: 'delete', type: 'boolean', default: false },
        { name: 'reference', type: 'string' },
        { name: 'pressed', type: 'boolean', default: false },
        { name: 'allInfo'},
        { name: 'info'},
    ],
});