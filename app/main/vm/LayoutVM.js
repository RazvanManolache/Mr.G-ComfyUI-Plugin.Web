Ext.define('MrG.main.vm.LayoutVM', {
    extend: 'MrG.base.vm.BaseTabPanelVM',
    data: {
        worflowsReceived: false,
        templatesReceived: false,

        theme: '',
        isMaterial: false,
        materialName: null,
        darkMode: false,
        mobileMenu: null,

        autogeneratePresetTags: true,
        autogeneratePresetDescriptions: true,
    },
    formulas: {
        platform_desktop: function (get) {
            return Ext.platformTags.desktop;
        },
        platform_phone: function (get) {
            return Ext.platformTags.phone;
        },
        platform_tablet: function (get) {
            return Ext.platformTags.tablet;
        }
    },
    stores: {
        settingsStore: {
            xclass: 'MrG.store.SettingsStore'
        },
    }    
});
