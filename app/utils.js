Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}
isObject = function (obj) {
    return typeof obj === 'object' &&        
        obj !== null
}

MrGlogger = function () {
   // if (arguments[1] == "model" || arguments[1] == "MODEL")
     //   console.log(...arguments)
}
removeItemOnce = function(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

removeItemAll = function(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

clone = function (obj) {
    if (structuredClone) return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
}
getRawStoreData = function (store) {
    var hasFilters = store.getFilters().length > 0;
    var data = store.getData().items;
    if (hasFilters) {
        if (store.data._source)
            data = store.data._source.items;
    }
    return data;
};

searchInAttributes = function (search, row, attributes) {
    var words = splitText(search, ' ', true);
    var foundCount = 0;
    words.forEach(function (word) {
        var found = false;
        attributes.forEach(function (attribute) {
            var val = row.get(attribute);
            if (val) {
                if (val.toLowerCase().indexOf(word) >= 0)
                    found = true;
            }
           
        });
        if (found)
            foundCount++;
    });
    return foundCount == words.length;
}

splitText = function (text, delimiter, lower) {
    var words = text.split(delimiter)
    words = words.filter(word => word);
    //remove whitespace
    words = words.map(word => word.trim());
    words = words.filter(word => word);
    if (lower) {
        words = words.map(word => word.toLowerCase());
    }
    return words;
},
arrayMakeDistinct = function (myArray) {
    return myArray.filter((value, index, array) => array.indexOf(value) === index);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function genRand(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}

function removeItemFromArray(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

/**
* Returns the JSON representation of an object.
*
* @param {value} object the object
* @param {number} objectMaxDepth for objects, the maximum number of times to recurse into descendants
* @param {number} arrayMaxLength for arrays, the maximum number of elements to enumerate
* @param {string} indent the string to use for indentation
* @return {string} the JSON representation
*/
function toJSON(object, objectMaxDepth, arrayMaxLength, indent) {
    "use strict";

    /**
     * Escapes control characters, quote characters, backslash characters and quotes the string.
     *
     * @param {string} string the string to quote
     * @returns {String} the quoted string
     */
    function quote(string) {
        escapable.lastIndex = 0;
        var escaped;
        if (escapable.test(string)) {
            escaped = string.replace(escapable, function (a) {
                var replacement = replacements[a];
                if (typeof (replacement) === "string")
                    return replacement;
                // Pad the unicode representation with leading zeros, up to 4 characters.
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        else
            escaped = string;
        return "\"" + escaped + "\"";
    }

    /**
     * Returns the String representation of an object.
     * 
     * Based on <a href="https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js">https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js</a>
     *
     * @param {string} path the fully-qualified path of value in the JSON object
     * @param {type} value the value of the property
     * @param {string} cumulativeIndent the indentation to apply at this level
     * @param {number} depth the current recursion depth
     * @return {String} the JSON representation of the object, or "null" for values that aren't valid
     * in JSON (e.g. infinite numbers).
     */
    function toString(path, value, cumulativeIndent, depth) {
        switch (typeof (value)) {
            case "string":
                return quote(value);
            case "number":
                {
                    // JSON numbers must be finite
                    if (isFinite(value))
                        return String(value);
                    return "null";
                }
            case "boolean":
                return String(value);
            case "object":
                {
                    if (!value)
                        return "null";
                    var valueIndex = values.indexOf(value);
                    if (valueIndex !== -1)
                        return "Reference => " + paths[valueIndex];
                    values.push(value);
                    paths.push(path);
                    if (depth > objectMaxDepth)
                        return "...";

                    // Make an array to hold the partial results of stringifying this object value.
                    var partial = [];

                    // Is the value an array?
                    var i;
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        // The value is an array. Stringify every element
                        var length = Math.min(value.length, arrayMaxLength);

                        // Whether a property has one or multiple values, they should be treated as the same
                        // object depth. As such, we do not increment the object depth when recursing into an
                        // array.
                        for (i = 0; i < length; ++i) {
                            partial[i] = toString(path + "." + i, value[i], cumulativeIndent + indent, depth,
                                arrayMaxLength);
                        }
                        if (i < value.length) {
                            // arrayMaxLength reached
                            partial[i] = "...";
                        }
                        return "\n" + cumulativeIndent + "[" + partial.join(", ") + "\n" + cumulativeIndent +
                            "]";
                    }

                    // Otherwise, iterate through all of the keys in the object.
                    for (var subKey in value) {
                        if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                            var subValue;
                            try {
                                subValue = toString(path + "." + subKey, value[subKey], cumulativeIndent + indent,
                                    depth + 1);
                                partial.push(quote(subKey) + ": " + subValue);
                            }
                            catch (e) {
                                // this try/catch due to forbidden accessors on some objects
                                if (e.message)
                                    subKey = e.message;
                                else
                                    subKey = "access denied";
                            }
                        }
                    }
                    var result = "\n" + cumulativeIndent + "{\n";
                    for (i = 0; i < partial.length; ++i)
                        result += cumulativeIndent + indent + partial[i] + ",\n";
                    if (partial.length > 0) {
                        // Remove trailing comma
                        result = result.slice(0, result.length - 2) + "\n";
                    }
                    result += cumulativeIndent + "}";
                    return result;
                }
            default:
                return "null";
        }
    }

    if (indent === undefined)
        indent = "  ";
    if (objectMaxDepth === undefined)
        objectMaxDepth = 0;
    if (arrayMaxLength === undefined)
        arrayMaxLength = 50;
    // Matches characters that must be escaped
    var escapable =
        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    // The replacement characters
    var replacements =
    {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
    };
    // A list of all the objects that were seen (used to avoid recursion)
    var values = [];
    // The path of an object in the JSON object, with indexes corresponding to entries in the
    // "values" variable.
    var paths = [];
    return toString("root", object, "", 0);
}