Ext.define('MrG.base.vm.BaseActionGridVM', {
    extend: 'MrG.base.vm.BaseVM',
    data: {
        selectedGridItem: null,
        typeGrid: '',
        searchText: '',
        searchFilter: null,
        editFormVisible: false,

        editedGridItem: null,
    },
    formulas: {
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
            return !get("editedGridItem")
        },
        addGridItemButtonDisabled: function (get) {
            return get("editedGridItem") && get("editedGridItem.uuid").indexOf("00000000") == 0
        },
        deleteGridItemButtonDisabled: function (get) {
            return !get("editedGridItem")
                || get("editedGridItem.uuid").indexOf("00000000") == 0
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
            var wf = get("selectedGridItem");
            return wf == null || get("editFormVisible");
        },
        disableDeleteGridItem: function (get) {
            var wf = get("selectedGridItem");
            return wf == null || wf.get("system");
        },
        disableOpenGridItem: function (get) {
            return get("selectedGridItem") == null;
        },
       
    },
    stores: {
        emptyStore: {

        }
    }
   
});