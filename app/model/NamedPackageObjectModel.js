Ext.define('MrG.model.NamedPackageObjectModel', {
    extend: 'MrG.model.NamedObjectModel',    
    fields: [
        { name: 'package_uuid', type: 'string', allowNull: true },
        { name: 'category_uuid', type: 'string', allowNull: true },
    ],
    
});