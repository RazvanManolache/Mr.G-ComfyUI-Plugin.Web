Ext.define('MrG.grd.act.ctrl.OutputGridC', {
    extend: 'MrG.base.ctrl.BaseActionGridC',
    alias: 'controller.outputGridC',
    onDownload: function (btn) {
        var me = this;
        var grid = me.getView();
        var selection = grid.getSelectionModel().getSelection();
        if (selection.length === 0) {
            Ext.Msg.alert('Error', 'Please select a row to download.');
            return;
        }
        var record = selection[0];
        var url = me.getDownloadUrl(record);
        window.open(url, '_blank');
    },
    getDownloadUrl: function (record) {
        var me = this;
        var url = me.getBaseUrl() + '/download/' + record.get('id');
        return url;
    },
    getBaseUrl: function () {
        var me = this;
        return me.getView().baseUrl;
    },
    onRefresh: function (btn) {
        var me = this;
        var grid = me.getView();
        grid.getStore().reload();
    },

});