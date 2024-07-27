Ext.define('MrG.model.PackageRepositoryModel', {
    extend: 'MrG.model.NamedObjectModel',
    fields: [
        { name: 'url', type: 'string' },
        { name: 'system', type: 'boolean', default: false },
    ],
   
});
