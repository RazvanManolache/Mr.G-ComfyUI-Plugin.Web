Ext.define('MrG.model.WorkflowConfigureModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'uuid', type: 'string' },
        { name: 'workflowName', type: 'string' },
        { name: 'workflowAlias', type: 'string' },
        { name: 'workflowUuid', type: 'string' },
        { name: 'presetName', type: 'string' },
        { name: 'presetUuid', type: 'string' },
        { name: 'presetData', type: 'string' },
        { name: 'runMode', type: 'string' },
        { name: 'enabled', type: 'boolean' },
    ],
});