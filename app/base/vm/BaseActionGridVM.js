Ext.define('MrG.base.vm.BaseActionGridVM', {
    extend: 'MrG.base.vm.BaseVM',
    data: {
        selectedGridItems: null,
        typeGrid: '',
        searchText: '',
        searchFilter: null,
        editFormVisible: false,


    },
    formulas: {
        somethingSelected: function (get) {
            var selectedGridItems = get("selectedGridItems");
            if (Array.isArray(selectedGridItems) && selectedGridItems.length) return true;
            if (!selectedGridItems) return false;
            return true;
        },
        multipleSelected: function (get) {
            var selectedGridItems = get("selectedGridItems");
            if (Array.isArray(selectedGridItems) && selectedGridItems.length > 1) return true;
            return false;
        },
        editedGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            if (Array.isArray(selectedGridItems) && selectedGridItems.length) return selectedGridItems[0];
            return selectedGridItems;
        },
        readOnlyGridItem: function (get) {
            if (get("editedGridItem") && get("editedGridItem.system")) return true;
            return false;
        },
        disableSaveGridItem: function (get) {
            if (get("readOnlyGridItem")) return true;
            if ((get("editedGridItem") && !get("editedGridItem.name"))) return true;
            return false;
        },
        editGridItemButtonDisabled: function (get) {
            var editedGridItem = get("editedGridItem");
            return !editedGridItem
        },
        addGridItemButtonDisabled: function (get) {
            return false;
            //return get("editedGridItem") && get("editedGridItem.uuid").indexOf("00000000") == 0
        },
        deleteGridItemButtonDisabled: function (get) {
            var editedGridItem = get("editedGridItem");
            return !editedGridItem
                || editedGridItem.get("uuid").indexOf("00000000") == 0
        },
        openGridItemText: function (get) {
            if (get("platform_desktop")) return "Open";
            return "";
        },
        disableAddGridItem: function (get) {
            var cat = get("selectedCategory");
            return cat && cat.get("system");
        },
        disableEditGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            return selectedGridItems == null || !selectedGridItems.length || get("editFormVisible");
        },
        disableDeleteGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            return selectedGridItems == null || !selectedGridItems.length || selectedGridItems.get("system");
        },
        disableOpenGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            return selectedGridItems == null || !selectedGridItems.length;
        },
       
    },
    stores: {
        emptyStore: {

        }
    }
   
});