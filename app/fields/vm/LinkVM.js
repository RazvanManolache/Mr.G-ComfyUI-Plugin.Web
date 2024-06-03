Ext.define('MrG.fields.vm.LinkVM', {
    extend: 'MrG.base.vm.BaseFieldVM',
    data: {
		fieldModes: [
			{
				name: 'Link',
				xclass: 'MrG.fields.opt.LinkCombo',
				isLink: true
			},
		],
		optionSelected: 'Link',
        linkField: true,
    }
});
