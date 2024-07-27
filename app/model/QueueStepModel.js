Ext.define('MrG.model.QueueStepModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [       
        { name: 'queued_run_uuid', type: 'string', allowNull: true },
        { name: 'run_value', type: 'string', allowNull: false },
        { name: 'status', type: 'string', allowNull: false },
        { name: 'step', type: 'int', allowNull: false },
        { name: 'server', type: 'int', allowNull: false },
        { name: 'retry', type: 'int', allowNull: false },
        { name: 'error', type: 'string', allowNull: true },
        { name: 'create_date', type: 'date', allowNull: false },
        { name: 'start_date', type: 'date', allowNull: true },
        { name: 'update_date', type: 'date', allowNull: false },
        { name: 'end_date', type: 'date', allowNull: true },
    ],
});