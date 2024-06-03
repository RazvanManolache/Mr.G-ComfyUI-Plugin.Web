Ext.define('MrG.model.WorkflowModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'uuid', type: 'string' },
        { name: 'category_uuid', type: 'string', allowNull: true },
        { name: 'name', type: 'string' }, 
        { name: 'description', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'rating', type: 'int' },
        { name: 'hidden', type: 'bool' },

        { name: 'times_used', type: 'int' },  
        
        { name: 'order', type: 'number' },
        { name: 'favourite', type: 'boolean' },

        { name: 'contents', type: 'string' },
        { name: 'contents_obj', persist:false },

        { name: 'nodes_values', type: 'string' },
        { name: 'nodes_values_obj', persist: false },

        { name: 'settings', type: 'string' },
        { name: 'settings_obj', persist: false },

        { name: 'selected', persist: false },
    ],
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/workflows',
        writer: {
            writeAllFields: true
        }
    },
    storeIdStart: 'workflowStore_',
   
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