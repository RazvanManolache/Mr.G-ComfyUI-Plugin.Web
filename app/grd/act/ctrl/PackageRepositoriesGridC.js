Ext.define('MrG.grd.act.ctrl.PackageRepositoriesGridC', {
    extend: 'MrG.base.ctrl.BaseActionGridC',

    newGridItem: function () {
        var newRecord = Ext.create('MrG.model.PackageRepositoryModel', {
            uuid: crypto.randomUUID(),
            name: 'Repo',
        });
        this.set("selectedGridItems", [newRecord]);
        this.set('editFormVisible', true);
        console.log("new repository");
    }
});