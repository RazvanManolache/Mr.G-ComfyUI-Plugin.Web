Ext.define('MrG.model.PackageRepositoryModel', {
    extend: 'MrG.model.NamedObjectModel',
    fields: [
        { name: 'url', type: 'string' },
        { name: 'system', type: 'boolean', default: false },
    ],
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/package_repositories',
        writer: {
            writeAllFields: true
        }
    },
});
