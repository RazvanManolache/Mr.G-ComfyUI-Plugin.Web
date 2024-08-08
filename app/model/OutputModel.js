Ext.define('MrG.model.OutputModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'batch_step_uuid', type: 'string', allowNull: true },
        { name: 'value', type: 'string', allowNull: false },
        { name: 'order', type: 'int', allowNull: false },
        { name: 'node_id', type: 'int', allowNull: false },
        { name: 'tags', type: 'string', allowNull: false },
        { name: 'output_type', type: 'string', allowNull: false },
        { name: 'create_date', type: 'date', allowNull: false },
        { name: 'rating', type: 'int', allowNull: false },
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