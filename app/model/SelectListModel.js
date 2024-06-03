Ext.define('MrG.model.SelectListModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'uuid', type: 'string' },
        { name: 'name', type: 'string' },
        
        { name: 'alias', type: 'string' },
        { name: 'comfy_name', type: 'string' },

        { name: 'description', type: 'string' },
        { name: 'comments', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'times_used', type: 'int' },
        { name: 'rating', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'hidden', type: 'bool' },
        { name: 'favorite', type: 'bool' },
        { name: 'field', type: 'string' },
        { name: 'field_type', type: 'string' },

        { name: 'path', type: 'string' },
        
        { name: 'image', type: 'string' },
        { name: 'thumbnail', type: 'string' },
        
        { name: 'count', type: 'int', persist: false, default:false },
        { name: 'selected', type: 'bool', persist: false, default: 0 },
        {
            name: 'photoSmall',
            calculate: function (data) {
                if (data.thumbnail) return data.thumbnail;
                if (data.image) return data.image;
                return "http://127.0.0.1:8188/view?filename=" + data.name + "&type=input&subfolder=&rand=0.11";
                return null;
            }
        },
        {
            name: 'photoLarge',
            calculate: function (data) {                
                if (data.image) return data.image;
                if (data.thumbnail) return data.thumbnail;
                return "http://127.0.0.1:8188/view?filename=" + data.name + "&type=input&subfolder=&rand=0.22";
                return null;
            }
        },
        {
            name: 'hasPhoto',
            calculate: function (data) {
                if (data.photoLarge) return true;
                return false;
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
    },
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/selection_items',
    },
});