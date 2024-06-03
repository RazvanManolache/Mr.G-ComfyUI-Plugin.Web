Ext.define('MrG.fields.vm.SelectionVM', {
    extend: 'MrG.base.vm.BaseFieldVM',
    data: {
        fieldModes: [
            {
                name: 'Simple',
                xclass: 'MrG.fields.opt.sel.SelectionSimple',
                advanced: {
                    xclass: 'MrG.fields.opt.sel.SelectionAdvanced',
                }
            },
            {
                name: 'Select',
                xclass: 'MrG.fields.opt.sel.SelectionWithSearchSummary',
                advanced: {
                    xclass: 'MrG.fields.opt.sel.SelectionWithSearchAdvanced',
                }
            },
            {
                name: 'Link',
                xclass: 'MrG.fields.opt.LinkCombo',
                isLink: true
            },
        ],
        typeSpecificFields: ["negateList", "filteredSelectedSets"],
        negateList: false,
        comboSelectRecords: [],

        _filteredSelectedUUIDs: [],
        _filteredSelectedSets: [],
        _filteredSelectedRecords: [],
        _filteredSelectedNames: [],

        
       
    },
    stores: {
        comboSelectStore: {
            xclass: 'MrG.store.SelectListMemoryStore',
        },
        selectListStore: {
            xclass: 'MrG.store.SelectListMemoryStore',
            listeners: {
                datachanged: 'selectListStoreDataChanged'
            }
        },
        
    },
    formulas: {
       
        sequenceTotalCnt: function (get) {
            return get("comboSelectRecords").map(a => a.get("count")).reduce((a, c) => {return a + c}, 0);
        },
        sequencePosition: {
            get: function (get) {
                var comboSelectRecords = get("comboSelectRecords");
                var sequencePosition = get("_sequencePosition");
                var selectedUUID = get("selectedUUID");

                var idx = comboSelectRecords.findIndex(a => a.get("uuid") == selectedUUID);
                if (idx == -1) {
                    this.set("_sequencePosition", -1);
                    return -1;
                }
                //get part of array until idx, including it
                var filteredSum = comboSelectRecords.slice(0, idx).map(a => a.get("count")).reduce((a, c) => { return a + c }, 0);
                var untilNext = comboSelectRecords[idx].get("count");
                //if it's in that range, we're fine with it
                if (sequencePosition >= filteredSum && sequencePosition < filteredSum + untilNext) return sequencePosition;
                //but if not, we must update it
                this.set("_sequencePosition", filteredSum);
                return filteredSum;
                
                
                return 
            },
            set: function (value) {
                var sequenceTotalCnt = this.get("sequenceTotalCnt");
                while (value < 0 && sequenceTotalCnt > 0) {
                    value += sequenceTotalCnt;
                }
                if (value < 0) {
                    return;
                }
                if (value > sequenceTotalCnt) value = value % sequenceTotalCnt;
                var comboSelectRecords = this.get("comboSelectRecords");
                var sum = 0;
                comboSelectRecords.forEach(function (rec) {
                    if (sum != null) {
                        sum += rec.get("count");
                        if (sum > value) {
                            this.set("selectedUUID", rec.get("uuid"));
                            this.set("_sequencePosition", value);
                            sum = null;
                        }
                    }
                }, this);
                if(sum != null) {
                    this.set("_sequencePosition", -1);
                }
            }
        },
        
        value: {
            get: function (get) {
                return get("_value");
            },
            set: function (value) {
                var globalDataStore = this.get("globalDataStore");
                if (globalDataStore) {
                    if (value) {
                        var rec = globalDataStore.queryBy(a=>a.get("comfy_name")==value);
                        if (rec && rec.items && rec.items.length) {
                            this.set("_selectedUUID", rec.items[0].get("uuid"));
                        }
                        else {
                            console.log("value not found: " + value);
                            debugger;
                        }
                    } else {
                        var comboSelectStore = this.get("comboSelectStore")
                        var record = comboSelectStore.first();
                        this.set("_selectedUUID", record.get("uuid"));
                        return this.set("_value", record.get("comfy_name"));
                    }
                }
                return this.set("_value", value);
            },
        },
        selectedRecord: {
            get: function (get) {
                var globalDataStore = get("globalDataStore");
                if (globalDataStore) {
                    var selectedUUID = get("selectedUUID");
                    if (selectedUUID) {
                        var rec = globalDataStore.query("uuid", selectedUUID);
                        if (rec && rec.items && rec.items.length) {
                            return rec.first();
                        }
                    } else {
                        var comboSelectStore = this.get("comboSelectStore")
                        return comboSelectStore.first();
                    }

                }
                return null;
            }
        },
        selectedUUID: {
            get: function (get) {  
                return get("_selectedUUID");
            },
            set: function (value) {
                var globalDataStore = this.get("globalDataStore");
                if (globalDataStore) {
                    if (value) {
                        var rec = globalDataStore.query("uuid", value);
                        this.set("_value", rec.items[0].get("comfy_name"));
                    } else {
                        var comboSelectStore = this.get("comboSelectStore")
                        var record = comboSelectStore.first();
                        this.set("_value", record.get("comfy_name"));
                        return this.set("_selectedUUID", record.get("uuid"));
                    }

                }
                return this.set("_selectedUUID", value);
            },
        },
        valuesComboText: function (get) {
            var stringDesc = "";
            get("filteredSelectedSets").forEach(function (row) {
                if (stringDesc)
                    stringDesc += ", ";
                stringDesc += row.alias
            }, this);
            return stringDesc;
        },
        hasPhotos: function (get) {
            var filteredSelectedRecords = get('filteredSelectedRecords');
            return filteredSelectedRecords.filter(a => a.get('hasPhoto')).length > 0;
        },
        filteredSelectedRecords: {
            get: function (get) {
                return get("_filteredSelectedRecords");
            },
            set: function (value) {
                this.get("selectListStore").setData(value);
                this.set("_filteredSelectedRecords", value);
            }
        },
        filteredSelectedUUIDs: {
            get: function (get) {
                return get("_filteredSelectedUUIDs");
            },
            set: function (value) {
                if (!value) value = [];
                var filteredSelectedRecords = this.get("_filteredSelectedRecords");
                oldValue = filteredSelectedRecords.map(a => a.get("uuid"));

                var toAdd = value.filter(x => !oldValue.includes(x));
                var toRemove = oldValue.filter(x => !value.includes(x));
                
                this.set("_filteredSelectedUUIDs", value);

                if (toAdd.length || toRemove.length) {
                    var newInfo = [].concat(filteredSelectedRecords);
                    newInfo = newInfo.filter(a => !toRemove.includes(a.get("uuid")));
                    if (toAdd.length) {
                        var _filteredSelectedSets = this.get("_filteredSelectedSets");
                        var addItems = [];
                        var globalDataStore = this.get("globalDataStore");
                        toAdd.forEach(function (add) {
                            var row = globalDataStore.findRecord("uuid", add);
                            var clone = row.clone();
                            var cnt = 1;
                            _filteredSelectedSets.forEach(function (set) {
                                if (set.comfy_name == row.get("comfy_name")) {
                                    cnt = set.count;
                                }
                            })
                            clone.set("count", cnt);
                            addItems.push(clone);
                        });
                        newInfo = newInfo.concat(addItems);
                    }
                    this.set("filteredSelectedRecords", newInfo);
                    
                }

            }
        },
        filteredSelectedNames: {
            get: function (get) {
                return get("_filteredSelectedNames");
            },
            set: function (value) {
                this.set("_filteredSelectedNames", value);
                var uuids = [];
                var globalDataStore = this.get("globalDataStore");
                value.forEach(function (name) {
                    var rec = globalDataStore.findRecord("comfy_name", name);
                    uuids.push(rec.get("uuid"))
                });
                this.set("filteredSelectedUUIDs", uuids);
            }
        },
        //this is the one to actually save
        filteredSelectedSets: {
            get: function (get) {
                return get("_filteredSelectedSets");
            },
            set: function (value) {
                this.set("_filteredSelectedSets", value);
                this.set("filteredSelectedNames", value.map(a => a.comfy_name));
            }
        },
      
    }
});
