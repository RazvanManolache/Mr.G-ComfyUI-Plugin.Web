Ext.define('MrG.node.ctrl.RerouteC', {
    extend: 'MrG.base.ctrl.BaseNodeC',
    init: function () {
        this.callParent(arguments);
    },
    fieldLinkAdded: function (field, row, isInField, fieldName) {
        this.evaluateLinks();
        this.callParent(arguments);
    },
    fieldLinkRemoved: function (field, row, isInField, fieldName) {
        this.evaluateLinks();
        this.callParent(arguments);
    },
    evaluateLinks: function () {
        var fieldReferences = this.get("fieldReferences");
        var fldIn = this.lookup(fieldReferences[0]).getController();
        var fldOut = this.lookup(fieldReferences[1]).getController();
        var fldInLinkRecords = fldIn.get("linkedRecord");
        var fldOutLinkRecords = fldOut.get("linkedRecord");
        var records = [];
        if (fldInLinkRecords) records.push(fldInLinkRecords);
        if (fldOutLinkRecords) records = records.concat(fldOutLinkRecords);
        var types = records.map(a => a.get("type"));
        var uniqueTypes = [...new Set(types)];
        if (uniqueTypes.length > 1) {
            this.log("RerouteC", "More than one type of link detected. This should not happen!")
            this.log("RerouteC", "Or it's that silly behaviour where you can connect input node to anything while output node is connected to a specific type of node.")
            debugger;
        }
        var type = uniqueTypes.length > 0 ? uniqueTypes[0] : "*";
       
        fldIn.set("fieldType", type);
        fldOut.set("fieldType", type);


    }

});