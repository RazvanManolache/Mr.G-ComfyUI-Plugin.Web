Ext.define('MrG.node.ctrl.PrimitiveNodeC', {
    extend: 'MrG.base.ctrl.BaseNodeC',
    init: function () {
       
        this.callParent(arguments);
        this.bind("{nodeDataType}", this.nodeDataTypeChanged, this);
        var fldOut = this.lookup('fld-Out').getController();
        fldOut.bind("{linkedRecord}", this.evaluateLinks, this);
    },
 
   
    nodeDataTypeChanged: function (value, prevValue) {
        var fldOut = this.lookup('fld-Out').getController();
        fldOut.set("fieldType", value);
        var existingField = this.lookup("fld-Input");
        var fieldReferences = this.get("fieldReferences");
        if (existingField) {
            fieldReferences = fieldReferences.filter(a => a != "fld-Input");
            this.set("fieldReferences", fieldReferences);
            this.view.remove(existingField, true);
        }
       
        var fieldName = null;
        var fieldConfig = null;

        switch (value) {
            case "INT":
                fieldName = "Int";
                fieldConfig = ['INT', {}];
                break;
            case "FLOAT":
                fieldName = "Float";
                fieldConfig = ['FLOAT', {}];                
                break;
            case "STRING":
                fieldName = "String";
                fieldConfig = ['STRING', {}];                
                break;
            case "BOOLEAN":
                fieldName = "Boolean";
                fieldConfig = ['BOOLEAN', {}];
                break;
            case "SELECT":
                var linkedFields = this.get("linkedFields");
                var config = linkedFields[0].view._configField;
                fieldName = config.fieldName;
                fieldConfig = config.origFieldDetails;
                break;           
        }
        
        if (fieldName) {
            var fld = blocksInterpreter.createField(fieldName, fieldConfig, "PrimitiveNode");
            fld.reference = "fld-Input";
            fieldReferences.push(fld.reference);

            this.set("fieldReferences", fieldReferences);
           
            console.log(fld);
            // add on top
            var item = this.view.insert(0, fld);
            // these can't have link option also
            item.getViewModel().set("hideLinkOption", true);

            if (this.view._mrgConfig && this.view._mrgConfig.fieldValues) {
                var fieldValues = this.view._mrgConfig.fieldValues;
                if (fieldValues[fieldName]) {
                    var val = fieldValues[fieldName];
                    item.getController().setFieldValues(val);

                }
            }
        }
        this.log("INFO", "PrimitiveNodeC", "nodeDataTypeChanged", value, prevValue);
    },
    getFieldValues: function (fieldName) {
        //ignoring field name because mine is the only field
        var field = this.lookup("fld-Input");
        if (field) {
            return field.getController().getFieldValues();
        }
        return null;
     
    },
    evaluateLinks: function (value) {
        var records = [];
        if (value) records = records.concat(value);
        var types = records.map(a => a.get("type"));
        var uniqueTypes = [...new Set(types)];
        if (uniqueTypes.length > 1) {
            console.log("RerouteC: More than one type of link detected. This should not happen!")
            debugger;
        }
        var type = uniqueTypes.length > 0 ? uniqueTypes[0] : "%";
        var gls = records.length > 0 ? records[0].get("fieldC").get("globalDataStore") : null;
        this.set("globalLinkStore", gls);
        
        var fields = records.map(a => a.get("fieldC"))
        this.set("linkedFields", fields);

        this.set("nodeDataType", type);

       
    }

});