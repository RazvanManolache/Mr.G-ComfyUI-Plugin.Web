Ext.define('MrG.model.OutputModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'batch_step_uuid', type: 'string', allowNull: true },
        { name: 'value', type: 'string', allowNull: false },
        { name: 'order', type: 'int', allowNull: false },
        { name: 'node_id', type: 'int', allowNull: false },
        { name: 'output_type', type: 'string', allowNull: false },
        { name: 'create_date', type: 'date', allowNull: false },
        { name: 'rating', type: 'int', allowNull: false },
        {
            name: 'htmlRepresentation',
            calculate: function (data) {
                var html = "";
                switch (data.output_type) {
                    case "images":
                        var res = JSON.parse(data.value);
                        if(res.filename){
                            html = "<img src='/mrg/outputs/" + data.batch_step_uuid + "/" + res.filename + "' />";
                        }
                        break;
                    default:
                        html = data.value;
                }
                return html;
            }
        }
    ],
});