Ext.define('MrG.fields.vm.BoolVM', {
    extend: 'MrG.base.vm.BaseFieldVM',
    data: {
        fieldModes: [
            {
                name: 'Simple',
                xclass: 'MrG.fields.opt.bool.BoolSimple',
                advanced: {
                    xclass: 'MrG.fields.opt.bool.BoolSequence',
                }
            },
            {
                name: 'Link',
                xclass: 'MrG.fields.opt.LinkCombo',
                isLink: true
            },
        ],
    },
    formulas: {
        sequenceTotalCnt: function (get) {
            return 2;
        },
        sequencePosition: {
            get: function (get) {
                var value = get("value");
                if (value) return 1;
                return 0;
            },
            set: function (value) {
                var sequenceTotalCnt = this.get("sequenceTotalCnt");
                while (value < 0 && sequenceTotalCnt>0) {
                    value += sequenceTotalCnt;
                }
                if (value < 0) {
                    return;
                }
                this.set("value", value % 2 == 1);

            }
        },
    }
});
