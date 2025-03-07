Ext.define('MrG.model.NamedObjectModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        //TODO: implement comments
        { name: 'comments', type: 'string' },
        { name: 'create_date', type: 'date' },
        { name: 'update_date', type: 'date' },
        { name: 'tags', type: 'string' },
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