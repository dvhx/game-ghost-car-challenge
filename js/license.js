// Driver's license (name, country)
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.license = function (aCallback) {
    SC.licensePaused = SC.pause;
    SC.pause = true;

    var license = document.getElementById('license'),
        license_name = document.getElementById('license_name'),
        license_country = document.getElementById('license_country'),
        i,
        option,
        countries = Object.keys(SC.emojiFlags).sort();

    // fill country combo
    license_country.textContent = '';
    for (i = 0; i < countries.length; i++) {
        option = document.createElement('option');
        option.textContent = countries[i];
        if (countries[i] === 'Russia') {
            option.disabled = true;
            option.value = 'Russia';
            option.textContent = 'Russia (banned!)';
        }
        if (countries[i] === 'Belarus') {
            option.disabled = true;
            option.value = 'Belarus';
            option.textContent = 'Belarus (banned!)';
        }
        license_country.appendChild(option);
    }

    // fill current values
    license_name.value = SC.player.name;
    license_country.value = SC.player.country;

    // show
    license.classList.remove('hide');
    license_name.focus();

    function hide() {
        // hide license
        license.classList.add('hide');
        SC.pause = SC.licensePaused;
        if (aCallback) {
            aCallback();
        }
    }

    function badInput(aElement) {
        // shortly flash input red
        console.log('badInput');
        aElement.classList.add('bad');
        setTimeout(function () {
            aElement.classList.remove('bad');
        }, 500);
        aElement.focus();
        if (aElement.select) {
            aElement.select();
        }
    }

    document.getElementById('license_randomize').onclick = function () {
        // Fill in random name and country
        license_name.value = SC.names.randomName() + ' ' + SC.names.randomMiddleName() + ' ' + SC.names.randomSurname();
        license_country.value = SC.randomItem.apply({}, countries);
        license_name.focus();
        SC.player.name = license_name.value;
        SC.player.country = license_country.value;
        SC.player.save();
    };

    document.getElementById('license_submit').onclick = function () {
        // check if available
        var n = license_name.value.trim(),
            c = license_country.value;

        // cannot have the same name as existing driver
        if (SC.bannedNames[n]) {
            badInput(license_name);
            return;
        }
        // both are required
        if (!n) {
            badInput(license_name);
            return;
        }
        if (!c) {
            badInput(license_country);
            return;
        }
        // changing the name
        SC.player.name = license_name.value.trim();
        SC.player.country = license_country.value;
        SC.player.save();
        // hide license
        hide();
        SC.recordsShow(SC.currentTrack);
    };
};

