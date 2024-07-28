Ext.define('MrG.model.BatchRequestModel', {
    extend: 'MrG.model.NamedObjectModel',

    fields: [
        { name: 'workflow_uuid', type: 'string', allowNull: true },
        { name: 'api_uuid', type: 'string', allowNull: true },
        { name: 'job_uuid', type: 'string', allowNull: true },
        { name: 'secondary_uuid', type: 'string', allowNull: true },
        { name: 'client_id', type: 'string', allowNull: true },
        { name: 'run_settings', type: 'string', allowNull: false },
        { name: 'total', type: 'int', allowNull: false },
        { name: 'contents', type: 'string', allowNull: true },
        { name: 'run_type', type: 'string', allowNull: false },
        { name: 'current', type: 'int', allowNull: false },
        { name: 'order', type: 'int', allowNull: false },
        { name: 'status', type: 'string', allowNull: true },
        { name: 'start_date', type: 'date', allowNull: true },
        { name: 'end_date', type: 'date', allowNull: true },
        { name: 'nodes_values', type: 'string', allowNull: true },
        { name: 'run_values', type: 'string', allowNull: true },
        { name: 'current_values', type: 'string', allowNull: true },
       
    ],
 
    storeIdStart: 'batchRequestStore_',

});