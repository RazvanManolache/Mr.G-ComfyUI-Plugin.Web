Ext.define('MrG.grd.act.vm.OutputGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'output',
        showDetails: false,
        multiSelect: false,
        showTags: true,
        showRatings: true,
    },
    formulas: {
      
      
        previewType: function (get) {
            var selectedGridItems = get('selectedGridItems');
            if (selectedGridItems) {
                if (!Array.isArray(selectedGridItems)) selectedGridItems = [selectedGridItems];
                //check that all have same nice_type, if they do, return it
                var same = true;
                var nice_type = selectedGridItems[0].get('nice_type');
                for (var i = 1; i < selectedGridItems.length; i++) {
                    if (selectedGridItems[i].get('nice_type') != nice_type) same= false;
                }
                if (same&&nice_type!="Unknown") {
                    return nice_type;
                }
            }
            return "";
        },
        showPreview: function (get) {
            return get('previewType') != "" && !get('multipleSelected');
        },

    }
});