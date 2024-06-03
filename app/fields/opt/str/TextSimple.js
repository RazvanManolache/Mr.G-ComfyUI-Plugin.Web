Ext.define('MrG.fields.opt.str.TextSimple', {
    extend: 'MrG.fields.TextArea',
	bind: {
        value: '{value}',
        readOnly: '{readOnlyWorkflow}'
    },
    autoHeight:true,
	maxRows: 20
})