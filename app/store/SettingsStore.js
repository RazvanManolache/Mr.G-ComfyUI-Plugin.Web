Ext.define('MrG.store.SettingsStore', {
    extend: 'MrG.base.store.BaseStore',
    model: 'MrG.model.SettingsModel',
    requires: [
        'MrG.base.store.BaseStore'
    ],
    singleton: true,
    storeId: 'MrG.store.SettingsStore',
    autoLoad: true,
    dataLoadedFirstTime: false,
    // proxy: {
    //     type: 'ODataProxy',
    //     queryable: newContext().Settings
    // },
    listeners: {
        load: function (store, records, successful, operation, eOpts) {
            if (!this.dataLoadedFirstTime) {
                this.dataLoadedFirstTime = true;
                var themeLoaded = false;
                var themeSettings = records.filter(a => a.get("setting_type") == 'Theme');
                for (var prop in Ext.platformTags) {
                    if (Ext.platformTags[prop]) {
                        var settings = themeSettings.filter(a => a.get("name").toLowerCase() == prop.toLowerCase());
                        if (settings.length > 0) {
                            var value = settings[0].get("value");
                            MrgThemes.setTheme(JSON.parse(value));                            
                            themeLoaded = true;
                            break;
                        }
                    }
                }
                if (!themeLoaded) {
                    MrgThemes.setTheme();
                }
                //console.log(arguments);
              
            }
            
        }
    }
});