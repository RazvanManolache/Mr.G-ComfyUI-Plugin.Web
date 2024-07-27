Ext.define('MrG.model.OutputModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'queue_step_uuid', type: 'string', allowNull: true },
        { name: 'value', type: 'string', allowNull: false },
        { name: 'order', type: 'int', allowNull: false },
        { name: 'node_id', type: 'int', allowNull: false },
        { name: 'output_type', type: 'string', allowNull: false },
        { name: 'create_date', type: 'date', allowNull: false },
        { name: 'rating', type: 'int', allowNull: false },
    ],
});