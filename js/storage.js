// Simplified access to localStorage with extra checks (it seems to be little bit more anal than necessary but I want to catch as many stupid bugs as possible)
"use strict";
// require: none
// globals: localStorage, window

var SC = window.SC || {};

SC.storage = (function () {
    var self = {};
    self.ops = 0;
    self.prefix = '';

    function cb(aCallback, aValue) {
        // if callback is function call it with value
        if (typeof aCallback === 'function') {
            aCallback(aValue);
        }
    }

    self.keyExists = function (aKey, aCallback) {
        // return true if key exists in storage
        if (typeof aKey !== 'string') {
            throw "SC.storage.keyExists key " + aKey + " is not string!";
        }
        try {
            var r = localStorage.hasOwnProperty(self.prefix + aKey);
            cb(aCallback, r);
            return r;
        } catch (e) {
            return false;
        }
    };

    self.erase = function (aKey) {
        // erase single key
        if (typeof aKey !== 'string') {
            throw "SC.storage.erase key " + aKey + " is not string!";
        }
        localStorage.removeItem(self.prefix + aKey);
    };

    self.size = function (aKey, aCallback) {
        // return size of a key's value in bytes
        if (!localStorage.hasOwnProperty(self.prefix + aKey)) {
            cb(aCallback, 0);
            return 0;
        }
        var r = localStorage.getItem(self.prefix + aKey).length;
        cb(aCallback, r);
        return r;
    };

    self.sizeAll = function (aHuman, aCallback) {
        // return size used by entire storage
        var keys = self.keys(), i, t = 0, s = 0;
        for (i = 0; i < keys.length; i++) {
            t += self.size(keys[i]);
        }
        if (aHuman) {
            if (t > 1024) {
                s = Math.ceil(t / 1024) + ' kB';
            } else {
                s = t + ' B';
            }
        } else {
            s = t;
        }
        cb(aCallback, s);
        return s;
    };

    self.keys = function (aCallback) {
        // return all keys
        var k, keys = [];
        for (k in localStorage) {
            if (localStorage.hasOwnProperty(k)) {
                keys.push(k.substr(self.prefix.length));
            }
        }
        cb(aCallback, keys);
        return keys;
    };

    self.eraseAll = function (aNothing) {
        // erase entire storage
        if (aNothing !== undefined) {
            throw "SC.storage.eraseAll does not require parameter, perhaps you wanted to call SC.storage.erase(key)";
        }
        localStorage.clear();
    };

    self.debug = function (aCallback) {
        // return size occupied by each keys and first few bytes of data
        var i, keys = self.keys().sort(), s = [], c, t = 0;
        for (i = 0; i < keys.length; i++) {
            c = self.size(keys[i]);
            t += c;
            s.push(self.prefix + keys[i] + ': ' + c + ' B = ' + self.readString(keys[i], '').substr(0, 80) + '...');
            console.log(self.prefix + keys[i] + ': ' + c + ' B = ' + self.readString(keys[i], '').substr(0, 80) + '...');
        }
        s.push('Total size: ' + t + ' B (' + (t / 1000).toFixed(0) + ' kB)');
        console.log('Total size: ' + t + ' B (' + (t / 1000).toFixed(0) + ' kB)');
        s = s.join('\n');
        cb(aCallback, s);
        return s;
    };

    self.readString = function (aKey, aDefault, aCallback) {
        // read string
        var r;
        if (typeof aKey !== 'string') {
            throw "SC.storage.readString key " + aKey + " is not string!";
        }
        if ((aDefault !== undefined) && (typeof aDefault !== 'string')) {
            throw "SC.storage.readString default " + aDefault + " is not string nor undefined!";
        }
        self.ops++;
        try {
            if (localStorage.hasOwnProperty(self.prefix + aKey)) {
                r = localStorage.getItem(self.prefix + aKey);
            } else {
                r = aDefault;
            }
        } catch (e) {
            console.warn('SC.storage.writeString: ' + e);
        }
        cb(aCallback, r);
        return r;
    };

    self.writeString = function (aKey, aValue, aCallback) {
        // write string
        if (typeof aKey !== 'string') {
            throw "SC.storage.writeString key " + aKey + " is not string!";
        }
        if ((aValue !== undefined) && (typeof aValue !== 'string')) {
            throw "SC.storage.writeString value " + aValue + " is not string nor undefined!";
        }
        self.ops++;
        try {
            localStorage.setItem(self.prefix + aKey, aValue);
        } catch (e) {
            console.warn('SC.storage.writeString: ' + e);
        }
        cb(aCallback, aValue);
    };

    self.readBoolean = function (aKey, aDefault, aCallback) {
        // read true/false, undefined as default, everything else is default with warning
        var s = self.readString(aKey);
        // console.info(aKey, aDefault, s, typeof s);
        if (s === undefined) {
            cb(aCallback, aDefault || false);
            return aDefault || false;
        }
        if ((s !== 'true') && (s !== 'false')) {
            console.warn('SC.storage.readBoolean: unusual boolean value "' + s + '" for "' + aKey + '", using default');
            cb(aCallback, aDefault || false);
            return aDefault || false;
        }
        cb(aCallback, s === 'true');
        return s === 'true';
    };

    self.writeBoolean = function (aKey, aValue, aCallback) {
        // write true/false
        if ((aValue !== true) && (aValue !== false)) {
            console.warn('SC.storage.writeBoolean: unusual boolean value "' + aValue + '" for "' + aKey + '", using false');
        }
        var r = aValue === true ? 'true' : 'false';
        self.writeString(aKey, r);
        cb(aCallback, aValue === true ? true : false);
    };

    self.readNumber = function (aKey, aDefault, aCallback) {
        // read number, undefined as default, everything else is default with warning
        var s = self.readString(aKey), f;
        if (s === undefined) {
            cb(aCallback, aDefault || 0);
            return aDefault || 0;
        }
        f = parseFloat(s);
        if (isNaN(f)) {
            console.warn('SC.storage.readNumber: unusual number value "' + s + '" for "' + aKey + '", using default');
            cb(aCallback, aDefault || 0);
            return aDefault || 0;
        }
        cb(aCallback, f);
        return f;
    };

    self.writeNumber = function (aKey, aValue, aCallback) {
        // write number
        if (typeof aValue !== 'number') {
            console.warn('SC.storage.writeNumber: unusual number value "' + aValue + '" for "' + aKey + '", using 0');
            self.writeString(aKey, '0');
            cb(aCallback, 0);
        } else {
            self.writeString(aKey, aValue.toString());
            cb(aCallback, aValue);
        }
    };

    self.inc = function (aKey, aDefault, aCallback) {
        // read number, increment it, write it back
        var i = self.readNumber(aKey, aDefault);
        i++;
        self.writeNumber(aKey, i);
        cb(aCallback, i);
        return i;
    };

    self.readObject = function (aKey, aDefault, aCallback) {
        // read object, undefined as default, everything else is default with warning
        var s = self.readString(aKey), o;
        if (aDefault === undefined) {
            aDefault = {};
        }
        if (typeof aDefault !== 'object') {
            console.warn('SC.storage.readObject: default is not object in "' + aKey + '" but "' + aDefault + '", using {}');
            aDefault = {};
        }
        if (s === undefined) {
            cb(aCallback, aDefault);
            return aDefault;
        }
        o = JSON.parse(s);
        if (typeof o !== 'object') {
            console.warn('SC.storage.readObject: unusual value "' + s + '" for "' + aKey + '", using default');
            cb(aCallback, aDefault);
            return aDefault;
        }
        cb(aCallback, o);
        return o;
    };

    self.writeObject = function (aKey, aValue, aCallback) {
        // write object
        if (typeof aValue !== 'object') {
            console.warn('SC.storage.writeObject: unusual object value "' + aValue + '" for "' + aKey + '", using {}');
            self.writeString(aKey, '{}');
            cb(aCallback, {});
        } else {
            self.writeString(aKey, JSON.stringify(aValue));
            cb(aCallback, aValue);
        }
    };

    self.readArray = function (aKey, aDefault, aCallback) {
        // read array, undefined as default, everything else is default with warning
        var s = self.readString(aKey), o;
        if (aDefault === undefined) {
            aDefault = [];
        }
        if (!Array.isArray(aDefault)) {
            console.warn('SC.storage.readArray: default is not array in "' + aKey + '" but "' + aDefault + '", using []');
            aDefault = [];
        }
        if (s === undefined) {
            cb(aCallback, aDefault);
            return aDefault;
        }
        o = JSON.parse(s);
        if (!Array.isArray(o)) {
            console.warn('SC.storage.readArray: unusual value "' + s + '" for "' + aKey + '", using default');
            cb(aCallback, aDefault);
            return aDefault;
        }
        cb(aCallback, o);
        return o;
    };

    self.writeArray = function (aKey, aValue, aCallback) {
        // write array
        if (!Array.isArray(aValue)) {
            console.warn('SC.storage.writeArray: unusual array value "' + aValue + '" for "' + aKey + '", using []');
            self.writeString(aKey, '[]');
            cb(aCallback, []);
        } else {
            self.writeString(aKey, JSON.stringify(aValue));
            cb(aCallback, aValue);
        }
    };

    self.asyncOnly = function () {
        // return true if storage is async only (packaged chrome apps)
        return window.hasOwnProperty('chrome') && window.chrome.hasOwnProperty('storage') && window.chrome.storage.hasOwnProperty('local') && (typeof window.chrome.storage === 'object');
    };

    return self;
}());

