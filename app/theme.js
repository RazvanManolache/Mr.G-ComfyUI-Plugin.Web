Ext.manifest = {
    material: {
        toolbar: {
            
        }
    }
}

var MrgThemes = {
    selectedTheme: null,
    selectedColor: null,
    selectedDarkMode: false,
    selectedColors: null,
    current_theme: null,
    themes: [
        {
            name: 'Material',
            scripts: ['scripts/extjsgpl/modern/theme-material/resources/css-vars.js','scripts/extjsgpl/modern/theme-material/theme-material.js'],
            styles: ['scripts/extjsgpl/modern/theme-material/resources/theme-material-all.css'],
            isMaterial: true,
            darkMode: true,
            colors: [
                {
                    text: 'America\'s Captain',
                    baseColor: 'red',
                    accentColor: 'blue'
                }, {
                    text: 'Royal Appeal',
                    baseColor: 'deep-purple',
                    accentColor: 'indigo'
                }, {
                    text: 'Creamsicle',
                    baseColor: 'deep-orange',
                    accentColor: 'grey'
                }, {
                    text: 'Mocha Pop',
                    baseColor: 'brown',
                    accentColor: 'blue-grey'
                }, {
                    text: 'Dry Shores',
                    baseColor: 'blue-grey',
                    accentColor: 'grey'
                }, {
                    text: 'Bubble Gum',
                    baseColor: 'pink',
                    accentColor: 'light-blue'
                }, {
                    text: '120 Compliments',
                    baseColor: 'green',
                    accentColor: 'deep-purple'
                }, {
                    text: 'Roboto House',
                    baseColor: 'grey',
                    accentColor: 'blue-grey'
                }, {
                    text: 'Daylight & Tungsten',
                    baseColor: 'light-blue',
                    accentColor: 'orange'
                }
            ]
        },
        {
            name: 'iOS',
            scripts: ['scripts/extjsgpl/modern/theme-ios/theme-ios.js'],
            styles: ['scripts/extjsgpl/modern/theme-ios/resources/theme-ios-all.css']
        },
      
        {
            name: 'Neptune',
            scripts: ['scripts/extjsgpl/modern/theme-neptune/theme-neptune.js'],
            styles: ['scripts/extjsgpl/modern/theme-neptune/resources/theme-neptune-all.css']
        },
        {
            name: 'Triton',
            scripts: ['scripts/extjsgpl/modern/theme-triton/theme-triton.js'],
            styles: ['scripts/extjsgpl/modern/theme-triton/resources/theme-triton-all.css']
        },

    ],
    headRef: null,
    setTheme: function (themeObj) {
        if (!this.headRef) {
            this.headRef = head;
        }
        var themes = this.themes.filter(a => themeObj && a.name == themeObj.name);
        var theme = this.themes[0];
        if (themes.length > 0) {
            theme = themes[0];
        }
        var selected_color = null;
        if (theme.colors) {
            var colors = theme.colors.filter(a => themeObj && a.text == themeObj.color);
            if (colors.length > 0) {
                selected_color = colors[0];
            }
        }

        var themes_to_remove = this.themes.filter(a => a.name != theme.name);


        this.removeAllThemes(themes_to_remove);
        var darkMode = false;
        if (themeObj && themeObj.darkMode) darkMode = true;
        this.loadTheme(theme, selected_color, darkMode);
        this.selectedTheme = theme.name;
        this.selectedColor = selected_color ? selected_color.text : null;
        this.selectedDarkMode = darkMode;
        this.selectedColors = theme.colors;
        return { name: this.selectedTheme, color: this.selectedColor, darkMode: this.selectedDarkMode, colors: this.selectedColors };
    },
    loadTheme: function (theme, selected_color, dark) {
        var filesToLoad = theme.scripts.concat(theme.styles);
        var me = this;

       
        this.headRef.clearAssets();
        this.headRef.load(filesToLoad, function () {

            Ext.getBody().toggleCls('dark-mode', dark)
            if (selected_color) {
                me.updateMaterialTheme(selected_color, dark)
            }
            me.refresh();

        });

    }, 
    updateMaterialTheme: function (selected_color, dark) {   
        var me = this;
        if (Ext.theme.Material) {
            Ext.theme.Material.setColors({
                'darkMode': dark,
                'base': selected_color.baseColor,
                'accent': selected_color.accentColor
            })
        }
        else {
            setTimeout(function () {
                me.updateMaterialTheme(selected_color, dark);
            },200)
        }
    },
    removeAllThemes: function (themes) {
        var me = this;
        themes.forEach(function (theme) {
            theme.scripts.forEach(function (script) {
                me.removejscssfile(script, "js");
            });
            theme.styles.forEach(function (style) {
                me.removejscssfile(style, "css");
            })
        })
    },
    refresh: function () {
        var app = Ext.getApplication();
        if (app) {
            var mainView = app.getMainView();
            if (mainView) {
                mainView.updateLayout({ isRoot: true, defer: false });
            }
        }
        else {
            startUI();
        }
    },
    removejscssfile: function (filename, filetype) {
        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
        var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
            var suspect = allsuspects[i]
            if (suspect && suspect.getAttribute(targetattr) != null && suspect.getAttribute(targetattr).indexOf(filename) != -1) {
                suspect.parentNode.removeChild(suspect) //remove element by calling parentNode.removeChild()
            }
        }
    },
   
    
   
};