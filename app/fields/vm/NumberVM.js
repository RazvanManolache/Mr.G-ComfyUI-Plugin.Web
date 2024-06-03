Ext.define('MrG.fields.vm.NumberVM', {
    extend: 'MrG.base.vm.BaseFieldVM',
    data: {
        fieldModes: [
            {
                name: 'Simple',
                xclass: 'MrG.fields.opt.num.NumberSimple',
                advanced: {
                    xclass: 'MrG.fields.opt.num.NumberSequence',
                }
            },
            {
                name: 'Interval',
                xclass: 'MrG.fields.opt.num.NumberMinMaxSummary',
                goAdvanced: function (me) {
                    return me.get("_maxValueInterval") == null ||
                        me.get("_minValueInterval") == null ||
                        me.get("_stepValueInterval") == null
                },
                advanced: {
                    xclass: 'MrG.fields.opt.num.NumberMinMaxAdvanced',
                }
            },
            {
                name: 'Select',
                xclass: 'MrG.fields.opt.num.NumberWithDefinedSequenceSummary',
                goAdvanced: function (me) {
                    return !me.get("valuesComboText");
                },
                advanced: {
                    xclass: 'MrG.fields.opt.num.NumberWithDefinedSequenceAdvanced',
                }
            },
            {
                name: 'Link',
                xclass: 'MrG.fields.opt.LinkCombo',
                isLink: true
            },
        ],
        typeSpecificFields: ["maxValue", "minValue", "stepValue",  "minValueInterval", "maxValueInterval", "stepValueInterval", "valuesComboText"],
        maxValue: 2147483647,
        minValue: 0,
        stepValue: 1,
        roundValue: 0,


        _maxValueInterval: null,
        _minValueInterval: null,
        _stepValueInterval: 1,
        
        _valuesComboText: "",
    },
    formulas: {
        valuesComboText: {
            get: function (get) {
                return get("_valuesComboText");
            },
            set: function (value) {
                this.set("_valuesComboText", value);
            }
        },
        stripCharsRe: function () {
            var precision = this.get("roundValue");
            var fieldType = this.get("fieldType");
            if (precision > 0 && fieldType=="FLOAT") {
                return /[^0-9.,]/g
            }
            return /[^0-9,]/g
        },
        sequenceTotalCnt: function (get) {
            var maxValueInterval = get("maxValueInterval");
            var minValueInterval = get("minValueInterval");
            var stepValueInterval = get("stepValueInterval");
            var maxValue = get("maxValue");
            var minValue = get("minValue");
            var stepValue = get("stepValue");
            var precision = get("roundValue");


            var valuesComboText = get("valuesComboText");
            if (get("optionSelected") == "Interval") {
                var fits = Math.floor((maxValueInterval - minValueInterval) / stepValueInterval);
                var fitsPerfectly = (maxValueInterval - minValueInterval) % stepValueInterval == 0;
                return fits + (fitsPerfectly ? 1 : 0);
                
            }
            else if (get("optionSelected") == "Select") {
                if (valuesComboText) {
                    var values = splitText(valuesComboText, ',');
                    return values.length;
                }
                return 0;
            }
            else if (get("optionMode") == "Advanced") {
                return Math.floor((maxValue - minValue) / stepValue * Math.pow(10, precision));
            }
            else return -1;

        },
        sequencePosition: {
            get: function (get) {
                var _sequencePosition = get("_sequencePosition");
                var maxValueInterval = get("maxValueInterval");
                var minValueInterval = get("minValueInterval");
                var stepValueInterval = get("stepValueInterval");
                var maxValue = get("maxValue");
                var minValue = get("minValue");
                var stepValue = get("stepValue");
                var precision = get("roundValue");
                var value = get("value");
                var valuesComboText = get("valuesComboText");
                
                if (get("optionSelected") == "Interval") {
                    if (value < minValueInterval || value > maxValueInterval) return -1;
                    var pos = (value - minValueInterval) / stepValueInterval;
                    if (pos != Math.floor(pos)) return -1;
                    return pos;
                }
                else if (get("optionSelected") == "Select") {
                    if (valuesComboText) {
                        var values = splitText(valuesComboText, ',');
                        var pos = values.indexOf(""+value)
                        return pos;
                    }
                    return -1;
                }
                else if (get("optionMode") == "Advanced") {
                    if (value < minValue || value > maxValue) return -1;
                    var pos = (value - minValue) / stepValue;
                    if (pos != Math.floor(pos)) return -1;
                    return pos;
                }
                else return -1;
            },
            set: function (value) {
                var _maxValueInterval = this.get("_maxValueInterval");
                var _minValueInterval = this.get("_minValueInterval");
                var _stepValueInterval = this.get("_stepValueInterval");
                var maxValue = this.get("maxValue");
                var minValue = this.get("minValue");
                var stepValue = this.get("stepValue");
                var precision = this.get("roundValue");
                var valuesComboText = this.get("valuesComboText");
                var sequenceTotalCnt = this.get("sequenceTotalCnt");

                var maxValueInterval = _maxValueInterval == null ? maxValue : _maxValueInterval;
                var minValueInterval = _minValueInterval == null ? minValue : _minValueInterval;
                var stepValueInterval = _stepValueInterval == null ? stepValue : _stepValueInterval;


                while (value < 0 && sequenceTotalCnt > 0) {
                    value += sequenceTotalCnt;
                }
                if (value < 0) {
                    return;
                }
                //if value is smaller than 0 or not an integer, return
                if (value < 0 || Math.floor(value) != value) return;
                //if the value is bigger than the total count of the sequence, make smaller
                value = value % sequenceTotalCnt;
                
                if (this.get("optionSelected") == "Interval") {
                    this.set("value", minValueInterval + stepValueInterval * value);
                }
                else if (this.get("optionSelected") == "Select") {
                    if (valuesComboText) {
                        var values = splitText(valuesComboText, ',');
                        this.set("value", values[value]);
                    }
                }
                else if (this.get("optionMode") == "Advanced") {
                    this.set("value", minValue + stepValue * value);
                }
            }
        },
        maxValueInterval: {
            get: function (get) {
                var _maxValueInterval = get("_maxValueInterval");
                var maxValue = get("maxValue");
                if (_maxValueInterval == maxValue) {
                    this.set("_maxValueInterval", null);
                }
                if (_maxValueInterval == null) {
                    return maxValue;
                }
                
                return _maxValueInterval;
            },
            set: function (value) {
                this.set("_maxValueInterval", value)
            }
        },
        minValueInterval: {
            get: function (get) {
                var _minValueInterval = get("_minValueInterval")
                var minValue = get("minValue");
                if (_minValueInterval == minValue) {
                    this.set("_minValueInterval", null);
                }
                if (_minValueInterval == null) {
                    return minValue;
                }
                return _minValueInterval;
            },
            set: function (value) {
                this.set("_minValueInterval", value)
            }
        },
        stepValueInterval: {
            get: function (get) {
                var _stepValueInterval = get("_stepValueInterval");
                var stepValue = get("stepValue");
                if (_stepValueInterval == stepValue) {
                    this.set("_stepValueInterval", null);
                }
                if (_stepValueInterval == null) {
                    return stepValue;
                }
                return _stepValueInterval;
            },
            set: function (value) {
                this.set("_stepValueInterval", value)
            }
        }
    },
    stores: {
       
    }
});
