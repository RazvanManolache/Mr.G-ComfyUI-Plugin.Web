Ext.define('MrG.main.vm.ActionListVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {      
        closeActionsAfterOpen: false,
        focusOnNewTab: true,
        selectedCategory: null,
        actionTitle: 'Workflows',
        categoryFilter: null,
      
        editCategory: null,
       
        categoriesCollapsed: false,
        categoriesWidth: 250,
       
    },
    formulas: {
       


        readOnlyCategory: function (get) {
            if (get("editCategory.system")) return true;
            return false;
        },
        disableSaveCategory: function (get) {
            if (!get("editCategory.name") || get("readOnlyCategory")) return true;            
            return false;
        },
        editCategoryButtonDisabled: function (get) {
            return !get("selectedCategory.uuid")
        },
        addCategoryButtonDisabled: function (get) {
            return get("selectedCategory") && get("selectedCategory.uuid").indexOf("00000000") == 0
        },
        deleteCategoryButtonDisabled: function (get) {
            return !get("selectedCategory")
                || get("selectedCategory.uuid").indexOf("00000000") == 0
        },
      
       
       
    },
    stores: {
        categoryStore: {
            xclass: 'MrG.store.CategoryStore',
            listeners: {
                datachanged: 'categoryStoreDataChanged'
            }
        },
        workflowStore: {
            xclass: 'MrG.store.WorkflowStore',
            listeners: {
                datachanged: 'workflowStoreDataChanged'
            }
        },
        
       
    }
});
