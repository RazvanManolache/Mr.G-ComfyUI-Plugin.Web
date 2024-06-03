Ext.define('MrG.model.ConnectorModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'nodeId', type: 'int' },
        { name: 'portId', type: 'int' },
        { name: 'nodeName', type: 'string' },
        { name: 'nodeType', type: 'string' },
        { name: 'input', type: 'boolean' },
        {
            name: 'display', type: 'string',
            calculate: function (data) {
                return data.nodeName + "(" + (data.nodeId) + ")" + " - " + titleCase(replaceAll(data.name,'_', ' '));   
            }
        },
        {
            name: 'compositeId', type: 'string',
            calculate: function (data) {
                return data.nodeId + "-" + data.portId;
            }
        },
    ],
});