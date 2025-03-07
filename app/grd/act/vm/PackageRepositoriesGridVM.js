Ext.define('MrG.grd.act.vm.PackageRepositoriesGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'packageRepository',
    },
    formulas: {
        disableSaveGridItem: function (get) {
            if (get("editedGridItem")) {
                if (!get("editedGridItem.name")) return true;
                var url = get("editedGridItem.url");
                if (!url) return true;
                if (!isValidURL(url)) return true;
            } 
            return false;
        },
    }
});