// Audio using WebAudio (supports seamless loops but does not work in file:/// and music must be loaded via XHR)
"use strict";
// globals: document, window, AudioContext, XMLHttpRequest

var SC = window.SC || {};

SC.audioCache = (function () {
    // This cache avoids problem that audio context must be in user gesture but xhr.onload is no longer user gesture
    var self = {};
    self.data = {};
    self.size = 0;

    self.load = function (aUrl) {
        // Load audio
        var request = new XMLHttpRequest();
        request.open('GET', aUrl, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            self.data[aUrl] = request.response;
            self.size += request.response.byteLength;
        };
        request.send();
    };

    self.loadMultiple = function (aUrls, aCallback) {
        // Load multiple urls at once and call callback when all are done
        var pending = aUrls.length;
        function one(aUrl) {
            //console.log('Loading ' + aUrl);
            var request = new XMLHttpRequest();
            request.open('GET', aUrl, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                console.log('Loaded ' + aUrl);
                self.data[aUrl] = {
                    response: request.response,
                    audio: null
                };
                self.size += request.response.byteLength;
                pending--;
                if (pending === 0) {
                    aCallback(aUrls);
                }
            };
            request.send();
        }
        aUrls.map(one);
    };

    return self;
}());

SC.audio = function (aUrl) {
    // Single audio loop
    var self = {}, firstGesture = true, ready = false, playing = false;

    function onError(e) {
        console.error(e);
    }

    if (!SC.audioCache.data.hasOwnProperty(aUrl)) {
        console.error('Sound ' + aUrl + ' is not in audioCache');
        return;
    }
    if (SC.audioCache.data[aUrl].audio) {
        //console.warn('Using audio from cache', SC.audioCache.data[aUrl].audio);
        return SC.audioCache.data[aUrl].audio;
    }

    self.userGesture = function (aStart) {
        // Use user's gesture to init audio context
        if (!firstGesture) {
            return;
        }
        firstGesture = false;
        //console.log('Creating audio context on first gesture');
        self.context = new AudioContext();
        self.context.decodeAudioData(SC.audioCache.data[aUrl].response.slice(0), function (buffer) { // slice is shallow
            // save buffer
            self.buffer = buffer;
            // create source
            self.source = self.context.createBufferSource();
            self.source.buffer = buffer;
            self.source.connect(self.context.destination);
            self.source.loop = true;
            // gain
            self.gain = self.context.createGain ? self.context.createGain() : self.context.createGainNode();
            self.source.connect(self.gain);
            self.gain.gain.setValueAtTime(0, self.context.currentTime, 0);
            self.gain.connect(self.context.destination);
            // callback
            ready = true;
            SC.audioCache.data[aUrl].audio = self;
            if (aStart) {
                //console.log('starting');
                self.source.start(0);
            }
        }, onError);
    };

    self.play = function () {
        // Play audio
        if (!ready) {
            self.userGesture(true);
            return;
        }
        if (!playing) {
            playing = true;
            self.source.start(0);
        }
    };

    self.pause = function () {
        // Pause audio
        if (!ready) {
            self.userGesture(false);
            return;
        }
        if (!playing) {
            return;
        }
        playing = false;
        self.source.stop();
        self.source = self.context.createBufferSource();
        self.source.buffer = self.buffer;
        self.source.connect(self.context.destination);
        self.source.loop = true;
        //self.gain = self.context.createGain ? self.context.createGain() : self.context.createGainNode();
        self.source.connect(self.gain);
        self.gain.gain.setValueAtTime(0, self.context.currentTime, 0);
        self.gain.connect(self.context.destination);
    };

    self.fadeOut = function () {
        // Fade out audio
        if (!ready) {
            return;
        }
        self.gain.gain.setTargetAtTime(-1, self.context.currentTime, 0.5);
    };

    self.fadeIn = function () {
        // Fade in audio
        if (!ready) {
            return;
        }
        self.gain.gain.setTargetAtTime(0, self.context.currentTime, 0.5);
    };

    self.rate = function (aRate) {
        // Change playback rate
        if (!ready) {
            return;
        }
        self.source.playbackRate.setTargetAtTime(aRate, self.context.currentTime, 0.2);
    };

    self.volume = function (aVolume) {
        // Change volume
        if (!ready) {
            console.error('audio.volume changed while audio not ready, ignored');
            return;
        }
        if (aVolume < 0) {
            aVolume = 0;
        }
        if (aVolume > 1) {
            aVolume = 1;
        }
        self.gain.gain.setTargetAtTime(aVolume - 1, self.context.currentTime, 0.2);
    };

    return self;
};

