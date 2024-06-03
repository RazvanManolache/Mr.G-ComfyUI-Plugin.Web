Ext.define('MrG.model.WorkflowExtenderModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        
        { name: 'uuid', type: 'string' },
        { name: 'contents', type: 'string', persist: false },

        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'workflows', type: 'string' },
        { name: 'create_date', type: 'string' },
        { name: 'update_date', type: 'string' },
        { name: 'enabled', type: 'boolean' },
        { name: 'tags', type: 'string' },
        { name: 'runs', type: 'int' },

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