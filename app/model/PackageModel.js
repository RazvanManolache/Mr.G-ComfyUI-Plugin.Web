Ext.define('MrG.model.PackageModel', {
    extend: 'MrG.model.NamedObjectModel',
    fields: [
        { name: 'url', type: 'string' },
        { name: 'system', type: 'boolean', default: false },
        { name: 'version', type: 'string' },
        { name: 'repository', type: 'string' },
        { name: 'branch', type: 'string' },
        { name: 'commit', type: 'string' },
        { name: 'parameters', type: 'string' },
        { name: 'settings', type: 'string' },
        { name: 'package_repository_uuid', type: 'string' },
    ],

});
