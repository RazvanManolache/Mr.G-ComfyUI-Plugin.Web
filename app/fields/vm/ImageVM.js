Ext.define('MrG.fields.vm.ImageVM', {
    extend: 'MrG.fields.vm.SelectionVM',
    data: {
        fieldModes: [
            {
                name: 'Simple',
                xclass: 'MrG.fields.opt.img.ImageSimple',
                advanced: {
                    xclass: 'MrG.fields.opt.img.ImageAdvanced',
                }
            },
            {
                name: 'Link',
                xclass: 'MrG.fields.opt.LinkCombo',
                isLink: true
            },
        ],
        typeSpecificFields: ["filteredSelectedSets"],
        filteredSelectedSets: []
    },
    stores: {

    },
    formulas: {      
        showImageList: function (get) {
            var filteredSelectedRecords = get("filteredSelectedRecords");
            return filteredSelectedRecords.length > 1;
        },
    }
});
