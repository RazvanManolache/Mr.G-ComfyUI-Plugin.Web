Ext.define('MrG.grd.act.ctrl.OutputGridC', {
    extend: 'MrG.base.ctrl.BaseActionGridC',
    alias: 'controller.outputGridC',
    init: function () {
        var me = this;       
        me.callParent(arguments);
        this.vm.bind('{selectionMode}', function (value) {
            this.lookup('gridItemList').setSelectable(value);
        }, this);
    },
    downloadGridItem: function () {
        // list function arguments
        var me = this;
        var grid = me.getView();
        var gridItemList = this.lookup('gridItemList');
        console.log(gridItemList);

        //for each item of grid check if it has border
        //if it has border then add it to selection
        var selection = [];
        gridItemList.items.each(function (item) {
            if (item.getBorder()) {
                selection.push(item.getRecord());
            }
        });
        
        if (selection.length === 0) {
            Ext.Msg.alert('Error', 'Please select a row to download.');
            return;
        }
        selection.forEach(function (record) {
            var url = me.getDownloadUrl(record);
            window.open(url, '_blank');
        });


    },
    getDataViewItem: function (dataView, record) {
        var ret = null;
        dataView.items.each(function (item) {
            if (item.$dataItem == "record") {
                var itemRecord = item.getRecord();
                if (itemRecord.get("uuid") == record.get("uuid")) {
                    ret = item;
                }
            }
        });
        return ret;
    },
    getDataViewItems: function (dataView, records) {
        var uiRecords = [];
        
        if (!Ext.isArray(records)) {
            records = [records];
        }
        records.forEach(function (record) {
            var uiRecord = this.getDataViewItem(dataView, record);
            if (uiRecord) {
                uiRecords.push(uiRecord);
            }
            
        }, this);
        return uiRecords;
    },
    gridItemSelected: function (dataView, records) {
        this.callParent(arguments);
        var uiRecords = this.getDataViewItems(dataView, records);
        uiRecords.forEach(function (record) {
            record.setBorder(true);
        });
    },
    gridItemDeselected: function (dataView, records) {
        this.callParent(arguments);
        var uiRecords = this.getDataViewItems(dataView, records);
        uiRecords.forEach(function (record) {
            record.setBorder(false);
        });
    },
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