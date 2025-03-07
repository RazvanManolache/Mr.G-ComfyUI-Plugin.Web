Ext.define('MrG.base.vm.BaseFieldVM', {
    extend: 'MrG.base.vm.BaseContainerVM',
   
    data: {
        normalFieldTypes: ["STRING", "NUMBER", "BOOLEAN", "SELECT", "INT", "FLOAT"],
        nodeId: -1,
        fieldName: '',
        _fieldType: '',
        nodeType: '',
        _label: '???',
        label_padding: '0 20 0 0',
        label_minWidth: 60,
        alias: '',
        _isInField: true,
        errorMessage: '',
        hidden: false,
        usedInDescription: false,
        sequence: "fixed",
        _transparentSequence: false,
        hasSequence: false,

        optionSelected: 'Simple',
        optionMode: 'Basic',
        xclassField: null,
       

        hideTextColumn: true,
        hideTagsColumn: true,
        hideSelectColumn: true,
        hideRatingColumn: true,
        hidePathColumn: true,
        hideNameColumn: true,
        hideImageColumn: true,
        hideDescriptionColumn: true,
        hideDeleteColumn: false,
        hideEditColumn: true,
        hideSelectCountColumn: false,
        hideCommentsColumn: true,
        hideComfyNameColumn: true,
        hideAliasColumn: false,

        editableAliasColumn: false,
        editableCommentsColumn: false,
        editableRatingColumn: false,
        editableTagsColumn: false,

        //if should be used in current preset, saved because it might be convenience thing
        fieldSelected: false,
       
       
        _selectedUUID: null,
        _value: null,
        prevValue: null,

        
        linkValue: null,
        // if it's a link field
        linkField: false,
        // if it's a link field, what is the comfy link id
        linkId: -1,

        _linkStore: null,

        hideLinkOption: false,

       
        mandatoryFields: ["nodeType", "fieldName", "fieldType", "label", "fieldSelected", "alias",
            "optionSelected", "optionMode", "hidden", "usedInDescription", "sequence", "value", "hasSequence", "transparentSequence",
            "linkField", "linkValue", "linkedNodeId", "linkedNodePort", "isInField", "sequenceTotalCnt", "sequencePosition",
            //options for how to view selection grid
            "hideTextColumn", "hideTagsColumn", "hideSelectColumn", "hideRatingColumn", "hidePathColumn", "hideNameColumn", "hideImageColumn",
            "hideDescriptionColumn", "hideDeleteColumn", "hideSelectCountColumn", "hideCommentsColumn", "hideComfyNameColumn", "hideAliasColumn",
        ],
        typeSpecificFields: [],
        hiddenByNode: false,
       
        globalDataStore: null,
        _sequencePosition: -1,
    },
    stores: {
        
    },
    formulas: {
        
        fieldType: {
            get: function (get) {
                var _fieldType = get("_fieldType");
                //var linkedRecord = get("linkedRecord");
                //var isInField = get("isInField");
                //if (isInField) {
                //    if (linkedRecord) {
                //        return linkedRecord.get("type");
                //    };
                //} else {
                //    if (linkedRecord && linkedRecord.length) {
                //        return linkedRecord[0].get("type");
                //    };
                //}
                return _fieldType;
            },
            set: function (value) {
                return this.set("_fieldType", value);
            }
        },
        label: {
            get: function (get) {
                var isInField = get("isInField")
                var _label = get("_label");
                if (_label == "") {
                    if (isInField) {
                        return "In";
                    }
                    else {
                        return "Out";
                    }
                }
                return _label;
            },
            set: function (value) {
                return this.set("_label", value);
            }
        },
        isInField: {
            get: function (get) {
                return get("_isInField");
            },
            set: function (value) {
                return this.set("_isInField", value);
            }
        },
        sequenceTotalCnt: function (get) {
            return -1;
        },
        sequencePosition: {
            get: function (get) {
                return get("_sequencePosition");
            },
            set: function (value) {
                return this.set("_sequencePosition", value);
            }
        },
        nextSequencePosition: function (get) {
            var hasSequence = get("hasSequence");
            var sequenceTotalCnt = get("sequenceTotalCnt");
            var sequencePosition = get("sequencePosition");
            var randomSelected = get("randomSelected");
            var incrementSelected = get("incrementSelected");
            var decrementSelected = get("decrementSelected");
            var fixedSelected = get("fixedSelected");  
            var value = get("value");

          
            if (sequenceTotalCnt == -1) return -1;
            if (!hasSequence || fixedSelected) return sequencePosition;
            if (randomSelected) return Math.floor(Math.random() * (sequenceTotalCnt + 1));
            if (incrementSelected) {
                if (sequencePosition == -1) return 0;
                return (sequencePosition + 1) % sequenceTotalCnt;
            }
            if (decrementSelected) {
                if (sequencePosition == -1) return sequenceTotalCnt - 1;
                return (sequencePosition + sequenceTotalCnt - 1) % sequenceTotalCnt;
            }
            return -1;
        },
        prevSequencePosition: function (get) {
            var hasSequence = get("hasSequence");
            var sequenceTotalCnt = get("sequenceTotalCnt");
            var sequencePosition = get("sequencePosition");
            var randomSelected = get("randomSelected");
            var incrementSelected = get("incrementSelected");
            var decrementSelected = get("decrementSelected");
            var fixedSelected = get("fixedSelected");
            var value = get("value");

            if (sequenceTotalCnt == -1) return -1;
            if (!hasSequence || fixedSelected) return sequencePosition;
            if (randomSelected) return Math.floor(Math.random() * (sequenceTotalCnt + 1));
            if (incrementSelected) {
                if (sequencePosition == -1) return sequenceTotalCnt - 1;
                return (sequencePosition + sequenceTotalCnt - 1) % sequenceTotalCnt;
            }
            if (decrementSelected) {
                if (sequencePosition == -1) return 0;
                return (sequencePosition + 1) % sequenceTotalCnt;
            }
            return -1;
        },
        linkStore: function (get) {
            var emptyStore = get("emptyLinkStore");
            var fieldType = get("fieldType");
            var isInField = get("isInField");
            var nodeId = get("id");
            var _linkStore = get("_linkStore");
            var normalFieldTypes = get("normalFieldTypes");
            var linkField = get("linkField");
            var globalLinkStore = this.get("globalLinkStore");
            if (!fieldType) {
                return emptyStore;
            }
            var me = this;
            //if (_linkStore) {
            //    return _linkStore;
            //}
            var filterTypeFn = function (record) {
                //if (!linkField) return false;
                if (record.get("input") == isInField)
                    return false;
                if (record.get("nodeId") == nodeId)
                    return false;
                if (fieldType == "*")
                    return true;
                var type = record.get("type");
                if (type == "*")
                    return true;
                if (globalLinkStore && type == "SELECT" && fieldType == "SELECT") {
                    var fieldC = record.get("fieldC");
                    if (fieldC.xclass != 'MrG.fields.ctrl.LinkC') {
                        var gds = fieldC.get("globalDataStore");
                        if (globalLinkStore != gds) {
                             return false;
                        }
                    }
                }
                if (type == fieldType)
                    return true;
                if (fieldType == "%" && normalFieldTypes.includes(type))
                    return true;
                if (type == "%" && normalFieldTypes.includes(fieldType))
                    return true;
                return false;
            }
            var filters = [filterTypeFn];
            if (!_linkStore) {
                _linkStore = new Ext.data.ChainedStore({ source: get("portsStore"), filters: filterTypeFn });
            } else {
                _linkStore.clearFilter();
                _linkStore.filterBy(filterTypeFn);
                this.set("forceVMUpdate", this.get("forceVMUpdate") + 1);
            }
            
            this.set("_linkStore", _linkStore);
            return _linkStore;
        },

        linkedRecord: function (get) {
            var isInField = get("isInField");
            var linkValue = get("linkValue");
            var linkStore = get("linkStore");
            var forceVMUpdate = get("forceVMUpdate");
            if (isInField) {
                if (linkValue) {
                    var records = linkStore.queryBy(a => a.get("display") == linkValue
                        && !a.get("input")
                    );
                    
                    return records.items[0];
                }
            } else {
                if (linkValue) {
                    var records = linkStore.queryBy(a => linkValue.includes(a.get("display"))
                        && a.get("input")
                    );
                    
                    //console.log(records);
                    return records.items;
                }
            }
            return null
            
        },
        linkedNodeId: function (get) {
            var linkedRecord = get("linkedRecord");
            if (linkedRecord) {
                if (Array.isArray(linkedRecord)) {
                    return linkedRecord.map(a => a.get("nodeId"));
                }
                return linkedRecord.get("nodeId")
            }
            return null;
        },
        linkedNodePort: function (get) {
            var linkedRecord = get("linkedRecord");
            if (linkedRecord) {
                if (Array.isArray(linkedRecord)) {
                    return linkedRecord.map(a => a.get("name"));
                }
                return linkedRecord.get("name")
            }
            return null;
        },
        value: {
            get: function (get) {
                return get("_value");
            },
            set: function (value) {
                var prevValue = this.get("_value");
                this.set("prevValue", prevValue);
                return this.set("_value", value);
            },
        },
       
        optionModeBasic: function (get) {
            return get('optionMode') == 'Basic'
        },
        optionModeAdvanced: function (get) {
            return get('optionMode') == 'Advanced'
        },
       settingName: function (get) {
            return get("nodeType") + "|" + get("fieldName");
        },
        label_formatted: function (get) {
            var label = get('label');
            var alias = get('alias');
            var hidden = get("hidden");
            var usedInDescription = get("usedInDescription");
            var linkField = get("linkField");
            var isInField = get("isInField");
            label = replaceAll(label, '_', ' ');
            label = titleCase(label);
            var lbl = label;
            if (alias) {
                lbl = alias + " ("+label+")";
            }
            if (hidden) lbl = "<em>" + lbl + "</em>"
            if (usedInDescription) lbl = "<strong>" + lbl + "</strong>";
            if (linkField) {
                if (isInField) {
                    lbl = "→ " + lbl;
                } else {
                    lbl = lbl + " →";
                }

            }
            return lbl;
        },
        fieldHidden: function (get) {
            if (get("hiddenByNode")) return true;

            if (get("linkField")) {
                if (get("fieldsSelection")) return true;
                if (get("hideConnections")) return true;
                if (get("isInField")) {
                    if (get("hideInConnections")) return true;
                } else {
                    if (get("hideOutConnections")) return true;
                }

            }
            var forceHide = get('forceHideFields');
            if (forceHide) return true;
            var forceShow = get('forceShowHiddenFields');
            if (forceShow) return false;
           
            var h = get('hidden');
            return h;
        },
        transparentSequence: {
            get: function (get) {
                var hasSequence = get("hasSequence");
                var sequence = get("sequence");
                if (!hasSequence) return true;
                if (sequence == "fixed" || sequence == "randomize")
                    return true;
                return get("_transparentSequence");
            }, 
            set: function (value) {
                return this.set("_transparentSequence", value);
            }

        },
        hideTransparentSequence: function (get) {
            var incrementSelected = get("incrementSelected");
            var decrementSelected = get("decrementSelected");
            var fieldType = get("fieldType");
            var optionSelected = get("optionSelected");
            if (optionSelected == "Simple" && (fieldType == "INT" || fieldType == "FLOAT" || fieldType == "NUMBER"))
                return true;
            if (incrementSelected || decrementSelected)
                return false;
            return true;
        },
        randomSelected: {
            get: function (get) {                
                return get("sequence") == "randomize";
                
            },
            set: function (value) {
                if (value)
                    this.set('sequence', "randomize")
            }
        },
        incrementSelected: {
            get: function (get) {
                return get("sequence") == "increment";

            },
            set: function (value) {
                if(value)
                    this.set('sequence', "increment")
            }
        },
        decrementSelected: {
            get: function (get) {
                return get("sequence") == "decrement";

            },
            set: function (value) {
                if (value)
                    this.set('sequence', "decrement")
            }
        },
         fixedSelected: {
            get: function (get) {
                return get("sequence") == "fixed";

            },
            set: function (value) {
                if (value)
                    this.set('sequence', "fixed")
            }
        }
    },
   
});
