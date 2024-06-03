Ext.define('MrG.model.FieldSelectionModel', {
    extend: 'MrG.base.model.BaseModel',
    idProperty: 'key',
    fields: [
        { name: 'workflowUniqueUuid', type: 'string' },
        { name: 'workflowName', type: 'string' },
        { name: 'workflowUuid', type: 'string' },
        { name: 'nodeName', type: 'string' },
        { name: 'nodeId', type: 'string' },
        { name: 'fieldName', type: 'string' },
        { name: 'alias', type: 'string' },
        { name: 'defaultValue', type: 'string' },
        { name: 'optional', type: 'boolean' },
        { name: 'enabled', type: 'boolean' },
        {
            name: 'fullNodeName',
            calculate: function (data) {
                return data.nodeName + " (" + data.nodeId + ")";
            }
        },
        {
            name: 'key',
            calculate: function (data) {
                return data.workflowUniqueUuid + "_" + data.nodeId + "_" + data.fieldName;
            }
        }
        
    ],
});