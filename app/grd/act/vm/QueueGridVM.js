Ext.define('MrG.grd.act.vm.QueueGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'queue',
    },
    formulas: {
        disableResumeGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            if (!selectedGridItems ||selectedGridItems.length != 1) return true;
            if (selectedGridItems[0].get("status") == "paused" || selectedGridItems[0].get("status") == "queued") {
                return false;
            }
            return true;
        },
        disablePauseGridItem: function (get) {
            var selectedGridItems = get("selectedGridItems");
            if (!selectedGridItems || selectedGridItems.length != 1) return true;
            if (selectedGridItems[0].get("status") == "running" || selectedGridItems[0].get("status") == "queued") {
                return false;
            }
            return true;
        }
    }
});