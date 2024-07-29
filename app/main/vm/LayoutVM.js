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
        extraMenuItems: [
            {
                title: 'Output',
                items: [
                    {
                        title: 'Output',
                        xclass: 'MrG.grd.act.view.OutputGridV',

                        store: 'MrG.store.OutputStore',
                        storeName: 'outputStore',
                    },
                    {
                        title: 'Queue',
                        xclass: 'MrG.grd.act.view.QueueGridV',

                        store: 'MrG.store.BatchRequestStore',
                        storeName: 'requestStore',
                    },
                ]
            },
            {
                title: 'Packages',
                items: [
                    {
                        title: 'Installed packages',
                        xclass: 'MrG.grd.act.view.PackagesGridV',

                        store: 'MrG.store.InstalledPackagesStore',
                        storeName: 'installedPackagesStore',
                    },
                    {
                        title: 'Available packages',
                        xclass: 'MrG.grd.act.view.PackagesGridV',

                        store: 'MrG.store.AvailablePackagesStore',
                        storeName: 'availablePackagesStore',
                    },
                    {
                        title: 'Repositories',
                        xclass: 'MrG.grd.act.view.PackagesGridV',

                        store: 'MrG.store.PackageRepositoryStore',
                        storeName: 'packageRepositoryStore',
                    },
                ]
            },
            {
                title: 'Settings',
                items: [
                    {
                        title: 'Settings',
                        xclass: 'MrG.grd.act.view.SettingsGridV',

                        store: 'MrG.store.SettingsStore',
                        storeName: 'settingsStore',
                        storeSingleton: true
                    },
                    {
                        title: 'APIs',
                        xclass: 'MrG.grd.act.view.ApiGridV',                        
                        extension: ".mrga",

                        itemView: 'MrG.main.view.ApiV',
                        itemTitle: 'API',

                        store: 'MrG.store.ApiStore',
                        storeName: 'apiStore',
                        model: 'MrG.model.ApiModel',
                        newItem: {
                            name: 'New api'
                        }
                    },
                    {
                        title: 'Jobs',
                        xclass: 'MrG.grd.act.view.JobsGridV',
                        extension: ".mrgj",

                        itemView: 'MrG.main.view.JobV',
                        itemTitle: 'Job',

                        store: 'MrG.store.JobsStore',
                        storeName: 'jobsStore',
                        model: 'MrG.model.JobsModel',
                        newItem: {
                            name: 'New job',
                            cron: '0 0 0 * *',
                        }
                    }
                ]
            }
        ],
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
