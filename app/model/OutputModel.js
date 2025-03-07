Ext.define('MrG.model.OutputModel', {
    extend: 'MrG.base.model.BaseModel',
    proxy: {
        type: 'rest',
        url: '/mrg/outputs',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message'
        }
    },
    fields: [
        { name: 'batch_step_uuid', type: 'string', allowNull: true },
        { name: 'name', type: 'string', allowNull: false },
        { name: 'value', type: 'string', allowNull: false },
        { name: 'order', type: 'int', allowNull: false },
        { name: 'node_id', type: 'int', allowNull: false },
        { name: 'tags', type: 'string', allowNull: false },
        { name: 'output_type', type: 'string', allowNull: false },
        { name: 'create_date', type: 'date', allowNull: false },
        { name: 'rating', type: 'int', allowNull: false },
        { name: 'request_description', type: 'string' },
        { name: 'step_description', type: 'string' },
        {
            name: 'description',
            calculate: function (data) {
                
                var request_description = [];
                if(data.request_description)
                    request_description = JSON.parse(data.request_description);
                var step_description = [];
                if(data.step_description)
                    step_description = JSON.parse(data.step_description);
                var result = "";
                if (request_description) {
                    request_description.forEach(node => {
                        node["fields"].forEach(field => {
                            result += field["name"] + ": " + field["value"] + " | ";
                        });
                    });
                }
                if (step_description) {
                    step_description.forEach(node => {
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
        },
        {
            name: 'nice_type',
            calculate: function (data) {
                switch (data.output_type) {
                    case "images":
                        return "Image";
                    case "text":
                        return "Text";
                    default:
                        return "Unknown";
                }
            }
        },
        {
            name: 'icon',
            calculate: function (data) {
                switch (data.output_type) {
                    case "images":
                        if (data.value) {
                            var res = JSON.parse(data.value);
                            if (res.filename)
                                return '/view?filename=' + res.filename + '&subfolder=' + res.subfolder + '&type=output';

                        }
                        return "";
                        
                    default:
                        return "";
                }
                
            }
        },
        {
            name: 'htmlRepresentation',
            calculate: function (data) {
                var html = "";
                switch (data.output_type) {
                    case "images":
                        var res = JSON.parse(data.value);
                        if (res.filename) {
                            var url = '/view?filename=' + res.filename +'&subfolder='+res.subfolder+'&type=output'
                            html = "<img src='" + url +"' />";
                        }
                        break;
                    default:
                        html = data.value;
                }
                return html;
            }
        }
    ],
    getTags: function () {
        var tags = this.get('tags');
        var result = [];
        if (tags) {
            var split = splitText(tags, ',');
            result = arrayMakeDistinct(split);
        }
        return result;
    }
});