Ext.define('MrG.fields.vm.TextVM', {
    extend: 'MrG.base.vm.BaseFieldVM',
    data: {
        fieldModes: [
            {
                name: 'Simple',
                xclass: 'MrG.fields.opt.str.TextSimple',
                advanced: {
                    xclass: 'MrG.fields.opt.str.TextSequenceAdvanced',
                }
            },
            {
                name: 'Link',
                xclass: 'MrG.fields.opt.LinkCombo',
                isLink: true
            },
        ],
        typeSpecificFields: ["filteredSelectedSets"],

        textFilter: '',

        hideTextColumn: false,
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
        hideAliasColumn: true,

        _filteredSelectedSets: [],
        _filteredSelectedRecords: []
    },
    formulas: {
        sequenceTotalCnt: function (get) {
            var filteredSelectedSets = get("filteredSelectedSets");;
            if (get("optionMode") == "Advanced") {
                return filteredSelectedSets.map(a => a.count).reduce((a, c) => { return a + c }, 0);
            }
            else {
                return -1;
            }
        },
        sequencePosition: {
            get: function (get) {
                var filteredSelectedSets = get("filteredSelectedSets");
                var value = get("value");
                var sequencePosition = get("_sequencePosition");
               
                if (get("optionMode") == "Advanced" /*&& selectListStore*/) {
                    var idx = filteredSelectedSets.findIndex(a => a.text == value);
                    if (idx == -1) {
                        this.set("_sequencePosition", -1);
                        return -1;
                    }
                    //get part of array until idx, including it
                    var filteredSum = filteredSelectedSets.slice(0, idx).map(a => a.count).reduce((a, c) => { return a + c }, 0);
                    var untilNext = filteredSelectedSets[idx].count;
                    //if it's in that range, we're fine with it
                    if (sequencePosition >= filteredSum && sequencePosition < filteredSum + untilNext) return sequencePosition;
                    //but if not, we must update it
                    this.set("_sequencePosition", filteredSum);
                    return filteredSum;
                }
                this.set("_sequencePosition", -1);
                return -1;
            },
            set: function (value) {
                var sequenceTotalCnt = this.get("sequenceTotalCnt");
                while (value < 0 && sequenceTotalCnt > 0) {
                    value+= sequenceTotalCnt;
                }
                if (value < 0) {
                    return;
                }
                if (value > sequenceTotalCnt) value = value % sequenceTotalCnt;
                var filteredSelectedSets = this.get("_filteredSelectedSets");
                var sum = 0;
                if (!filteredSelectedSets) filteredSelectedSets = [];
                filteredSelectedSets.forEach(function (rec) {
                    if (sum != null) {
                        sum += rec.count;
                        if (sum > value) {
                            this.set("value", rec.text);
                            this.set("_sequencePosition", value);
                            sum = null;
                        }
                    }
                }, this);
                if (sum != null) {
                    this.set("_sequencePosition", -1);
                    this.set("value", "");
                }
            }
        },
        filteredSelectedRecords: {
            get: function (get) {
                return get("_filteredSelectedRecords");
            },
            set: function (value) {
                this.set("_filteredSelectedRecords", value);
               
                var selectListStore = this.get("selectListStore");
                selectListStore.setData(value);
            }
        },
        filteredSelectedSets: {
            get: function (get) {
                return get("_filteredSelectedSets");
            },
            set: function (value) {
                var oldFilteredSelectedSets = this.get("_filteredSelectedSets");
                this.set("_filteredSelectedSets", value);

                var oldTexts = oldFilteredSelectedSets.map(a => a.text);
                var newTexts = value.map(a => a.text);

                var toAdd = newTexts.filter(x => !oldTexts.includes(x));
                var toRemove = oldTexts.filter(x => !newTexts.includes(x));
                if (toAdd.length || toRemove.length) {
                    var filteredSelectedRecords = this.get("_filteredSelectedRecords")
                    var newInfo = [].concat(filteredSelectedRecords);
                    newInfo = newInfo.filter(a => !toRemove.includes(a.get("text")));
                    if (toAdd.length) {
                        var addItems = [];
                        toAdd.forEach(function (add) {
                            if (filteredSelectedRecords.filter(a => a.get("text") == add).length) return;
                            var addedSet = value.filter(a => a.text == add)[0];
                            var newRow = new MrG.model.SelectListModel({
                                uuid: addedSet.uuid,
                                count: addedSet.count,
                                selected: addedSet.selected,
                                text: addedSet.text
                            })
                            addItems.push(newRow);
                        });
                        newInfo = newInfo.concat(addItems);
                    }
                    this.set("filteredSelectedRecords", newInfo);

                }
            }
        },
    },
    stores: {
        selectListStore: {
            xclass: 'MrG.store.SelectListMemoryStore',
            listeners: {
                datachanged: 'selectListStoreDataChanged'
            },
            //filters: [{
            //    property: 'text',
            //    operator: 'like',
            //    value: '{textFilter}',
            //    disableOnEmpty: true
            //}]
        }
    }
});
