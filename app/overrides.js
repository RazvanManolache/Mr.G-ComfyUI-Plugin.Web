//override to stop dragging system nodes or in system nodes

Ext.override(Ext.grid.TreeDropZone, {
    isTargetValid: function (dragee, record) {
       
        var response = true;
        var drageeSystem = false;
        dragee.forEach(function (d) {
            drageeSystem = drageeSystem || d.get("system")
        })
        if (drageeSystem) response = false;
        if (record.get("system") && record.parentNode.get("uuid")) response = false;
        if (!response) return false;
        if (dragee[0].$className == 'MrG.model.WorkflowModel') return true;
        var parentResp = this.callParent(arguments);
        return parentResp;
    },
    onNodeDrop: function (dragInfo) {
        var me = this;
        var targetNode = dragInfo.targetNode;
        var draggedData = dragInfo.draggedData;
        var records = draggedData.records;
        var targetRecord = dragInfo.targetRecord;
        var position = dragInfo.position;
        if (records[0].$className == 'MrG.model.WorkflowModel') {
            //console.log('dropedRowOnTree', targetNode, draggedData, targetRecord, position);
            me.view.fireEventArgs('dropedRowOnTree', [targetNode, draggedData, targetRecord, position]);
            delete me.dragInfo;
            return;
        }
        return this.callParent(arguments);
    }
});



