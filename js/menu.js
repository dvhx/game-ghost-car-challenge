// Main menu (via hamburger icon when on track) and main menu in main table
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.gasAlwaysOn = SC.storage.readBoolean('SC.gasAlwaysOn', false);

SC.onTrackMenu = function () {
    // Menu shown on racing track
    SC.pause = true;
    SC.carSound.stop();
    SC.popup(['Continue', 'Restart lap', 'Change track, car or opponent', 'Fullscreen', 'Landscape'], function (aItem) {
        switch (aItem) {
        case 'Continue':
            SC.pause = false;
            SC.carSound.start();
            break;
        case 'Restart lap':
            SC.restartTrack();
            break;
        case 'Change track, car or opponent':
            SC.recordsShow(SC.currentTrack);
            break;
        case 'Fullscreen':
            try {
                SC.fullscreen();
                SC.pause = false;
                SC.carSound.start();
            } catch (e) {
                alert(e);
            }
            break;
        case 'Landscape':
            try {
                SC.landscape();
                SC.pause = false;
                SC.carSound.start();
            } catch (e) {
                alert(e);
            }
            break;
        default:
            SC.carSound.start();
            SC.pause = false;
            break;
        }
    });
};

SC.menu = function () {
    // Show menu
    var items = ['Credits', 'Restart', 'Change player name or country'];
    items.push(SC.carSound.enabled ? 'Disable sound' : 'Enable sound');
    items.push(SC.gasAlwaysOn ? 'Make gas touch controlled' : 'Make gas always 100%');

    SC.popup(items, function (aButton) {
        switch (aButton) {
        case "Change player name or country":
            SC.license(SC.recordsShowRefresh);
            break;
        case "Disable sound":
            SC.carSound.enabled = false;
            SC.carSound.stop();
            SC.storage.writeBoolean('SC.sound.enabled', false);
            break;
        case "Enable sound":
            SC.carSound.enabled = true;
            SC.carSound.start();
            SC.storage.writeBoolean('SC.sound.enabled', true);
            break;
        case "Make gas always 100%":
            SC.gasAlwaysOn = true;
            SC.storage.writeBoolean('SC.gasAlwaysOn', SC.gasAlwaysOn);
            break;
        case "Make gas touch controlled":
            SC.gasAlwaysOn = false;
            SC.storage.writeBoolean('SC.gasAlwaysOn', SC.gasAlwaysOn);
            break;
        case "Restart":
            document.location.reload();
            break;
        case 'Credits':
            SC.splash('Credits', ['OK'], 'white', 'Programming, cars, tracks, textures, sounds: Dusan Halicky (https://github.com/dvhx/), Skyboxes: Zachery "skiingpenguins" Slocum (http://www.freezurbern.com) ');
            break;
        }
    });
};
