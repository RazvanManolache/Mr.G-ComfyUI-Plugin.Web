Ext.define('MrG.model.FieldOptionsModel', {
    extend: 'MrG.base.model.BaseModel',
    idProperty: 'fieldId',
    fields: [

        { name: 'nodeName', type: 'string' },
        { name: 'nodeId', type: 'int' },
        { name: 'fieldName', type: 'string' },
        { name: 'sequence', type: 'string' },
        { name: 'hasSequence', type: 'boolean' },
        { name: 'sequenceTotalCnt', type: 'int' },
        { name: 'transparentSequence', type: 'boolean' },
        { name: 'sequencePosition', type: 'int' },
        { name: 'command', type: 'string' },
        {
            name: 'position',
            type: 'string',
            calculate: function (data) {
                if (data.sequencePosition<0) return "Cust";
                return data.sequencePosition+1;
            }
        },
        {
            name: 'totalCnt',
            type: 'string',
            calculate: function (data) {
                if (data.sequenceTotalCnt<0) return "None";
                return data.sequenceTotalCnt;
            }
        },
        {
            name: 'fieldId',
            type: 'string',
            calculate: function (data) {
                return data.nodeId + "_" + data.fieldName;
            }
        },
    ],
});