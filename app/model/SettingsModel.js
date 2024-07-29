Ext.define('MrG.model.SettingsModel', {
    extend: 'MrG.base.model.BaseModel',
    fields: [
        { name: 'uuid', type: 'string' },
        { name: 'name', type: 'string' },        
        { name: 'setting_type', type: 'string' },        
        { name: 'description', type: 'string' },
        { name: 'value', type: 'string' },        
        { name: 'value_type', type: 'string' },        
        { name: 'value_type_options', type: 'string' },        
      
   
    ],
    storeIdStart: 'settingsStore_',
    proxy: {
        type: 'rest',
        appendId: false,
        noCache: false,
        url: '/mrg/settings',
        writer: {
            writeAllFields: true
        }
    },
});