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
        { name: 'create_date', type: 'date', allowNull: true },
        { name: 'update_date', type: 'date', allowNull: true },
        { name: 'start_date', type: 'date', allowNull: true },
        { name: 'end_date', type: 'date', allowNull: true },
        { name: 'nodes_values', type: 'string', allowNull: true },
        { name: 'run_values', type: 'string', allowNull: true },
        { name: 'current_values', type: 'string', allowNull: true },
        { name: 'workflow_name', type: 'string', allowNull: true },
        { name: 'api_name', type: 'string', allowNull: true },
        { name: 'job_name', type: 'string', allowNull: true },
        { name: 'steps_count', type: 'int', allowNull: true },
        { name: 'outputs_count', type: 'int', allowNull: true },
        {
            name: 'percentage',
            calculate: function (data) {
                return data.total > 0 ? Math.round(data.current / data.total) : 0;
            }
        },
        {
            name: 'progress',
            calculate: function(data) {
                return data.current +'/'+ data.total;
            }

        },
        {
            name: 'nice_description',
            calculate: function (data) {
                var result = "";
                if (data.description) {
                    var run_values = JSON.parse(data.description);
                    run_values.forEach(node => {
                        node["fields"].forEach(field => {
                            result += field["name"] + ": " + field["value"] + " | ";
                        });
                    });
                }
                if (result.length > 0) {
                    result = result.slice(0, -2);
                }
                return result;
            }

        }
       
    ],
 
    storeIdStart: 'batchRequestStore_',

});