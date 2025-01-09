// Show records table for given track
"use strict";
// linter: ngspicejs-lint
// global: document, window, setTimeout, alert, console

var SC = window.SC || {};

SC.recordsShow = function (aTrackId) {
    // Show records table for given track
    var records_container = document.getElementById('records_container');
    records_container.textContent = '';
    SC.hideIntro();
    SC.carSound.stop();

    // onclick and text of various elements
    document.getElementById('records_car').src = SC.cars[SC.player.car].icon;
    document.getElementById('records_settings').onclick = SC.menu;
    document.getElementById('records_car').onclick = SC.carDialog.show;
    document.getElementById('records_car2').onclick = SC.carDialog.show;
    document.getElementById('records_championship').onclick = SC.leaderboard;
    document.getElementById('records_title').textContent = SC.tracks[aTrackId].title;
    document.getElementById('records_title').onclick = function () {
        // Let user choose track in popup
        var t, labels = [];
        for (t in SC.tracks) {
            if (SC.tracks.hasOwnProperty(t)) {
                labels.push(SC.tracks[t].title);
            }
        }
        SC.popup(labels, function (aItem) {
            if (!aItem) {
                return;
            }
            SC.recordsShow(SC.selectTrackByTitle(aItem));
        });
    };
    document.getElementById('records_prev').onclick = function () {
        // previous track
        SC.storage.writeBoolean('SC.userChangedTrack', true);
        SC.recordsShow(SC.prevTrack());
    };
    document.getElementById('records_next').onclick = function () {
        // next track
        SC.storage.writeBoolean('SC.userChangedTrack', true);
        SC.recordsShow(SC.nextTrack());
    };

    // fetch records from server
    SC.fetch('track/' + SC.tracks[aTrackId].dir + '/record.json', function (aData) {
        // render table
        // include my record if exists for this track with index=-1
        var my = SC.storage.readObject('SC.record.' + aTrackId, null),
            my_rec;
        if (my) {
            my_rec = {
                car: Object.keys(SC.cars).indexOf(my.car_name) + 1,
                index: -1,
                lap_time: my.record_lap_time,
                player: SC.player.name,
                country: SC.player.country,
                posted: my.posted || '????'
            };
            aData.push(my_rec);
        }
        aData = aData.sort((a,b) => a.lap_time - b.lap_time);
        var first_time = my_rec ? my_rec.lap_time : (aData[0] ? aData[0].lap_time : 0);
        var my_tr;
        // SC.table(aParent, aData, aColumns, aFormatCallback, aRowClickCallback) {
        var table = SC.table(
            records_container,
            aData,
            {
                player: 'Driver',
                car: "Car",
                lap_time: 'Time',
                diff: 'Diff'
            },
            function (aColumn, aRow, aValue, aElement) {
                // header
                if (aRow === -1) {
                    return aValue;
                }
                // data cells
                // my record
                if (aData[aRow].index === -1) {
                    my_tr = aElement.parentElement;
                    my_tr.classList.add('me');
                }
                // player name and flag
                if (aColumn === 'player' && aRow >= 0) {
                    var flag = SC.emojiFlags[aData[aRow].country] || '';
                    return (aRow + 1) + '. ' + flag + aValue;
                }
                // car
                if (aColumn === 'car') {
                    var car_name = SC.carNumberToName(aValue), icon;
                    if (!car_name) {
                        console.error('no car name for', aValue, aRow, aColumn, aElement);
                        icon = document.createElement('img');
                    } else {
                        icon = document.createElement('img');
                        icon.src = SC.cars[car_name].icon;
                        aElement.appendChild(icon);
                        var span = document.createElement('span');
                        span.textContent = car_name;
                        aElement.appendChild(span);
                    }
                    return icon;
                }
                // lap time
                if (aColumn === 'lap_time') {
                    if (aValue) {
                    return aValue.toFixed(3) + 's';
                    }
                }
                // diff time
                if (aColumn === 'diff') {
                    if (aRow <= 0) {
                        return '';
                    }
                    var d = aData[aRow].lap_time - first_time;
                    return (d > 0 ? '+' : '') + d.toFixed(3);
                }

                //console.log(aColumn);
                return aValue;
            },
            function (aRowData) {
                // Click on row of data
                SC.splash(
                    'Challenge',
                    ['Challenge', 'Decline'],
                    'white',
                    'Do you want to challenge time ' + aRowData.lap_time.toFixed(3) + 's by ' + aRowData.player + ' in ' + SC.carNumberToName(aRowData.car) + ' on ' + SC.tracks[aTrackId].title + '?',
                    function (aButton) {
                        if (aButton === 'Challenge') {
                            SC.currentOpponent = {
                                you: aRowData.index === -1,
                                name: aRowData.player,
                                lap_time: aRowData.lap_time,
                                car: SC.carNumberToName(aRowData.car)
                            };
                            if (aRowData.index === -1) {
                                // improve own record
                                //console.log(my.record);
                                document.getElementById('records').classList.toggle('hide');
                                SC.startTrack(
                                    SC.currentTrack,
                                    my.record,
                                    true,
                                    SC.carNumberToName(aRowData.car)
                                );
                            } else {
                                // beat other record
                                var spinner = SC.spinner(10);
                                SC.fetch('track/' + SC.tracks[aTrackId].dir + '/record/' + aRowData.index + '.json', function (aData) {
                                    spinner.hide();
                                    //console.log(aData);
                                    // start track
                                    document.getElementById('records').classList.toggle('hide');
                                    SC.startTrack(SC.currentTrack, aData, true, SC.carNumberToName(aRowData.car));
                                });
                            }
                        }
                    }
                );
                // mark that user tapped on table row
                SC.storage.writeBoolean('SC.tapOnTableRow', true);
            }
        );
        table.classList.add('records');
        if (my_tr) {
            my_tr.scrollIntoView({behavior: 'auto', block: 'center'});
            my_tr.classList.add('blink');
        }

        // let player know they can tap on table row
        if (!SC.storage.readBoolean('SC.tapOnTableRow', false)) {
            SC.tapOnDriverMessageShown = true;
            SC.lip.message('Tap on driver you want to compete with.');
        }
        // let player know there are more levels
        if (!SC.storage.readBoolean('SC.userChangedTrack', false)) {
            var more_levels_tooltip = document.getElementById('more_levels_tooltip');
            more_levels_tooltip.style.display = 'inline';
            window.setTimeout(function () {
                more_levels_tooltip.style.opacity = 1;
                more_levels_tooltip.firstChild.style.top = '1em';
                window.setTimeout(function () {
                    more_levels_tooltip.style.opacity = 0;
                    window.setTimeout(function () {
                        more_levels_tooltip.style.display = 'none';
                    }, 1000);
                }, 5000);
            }, 1000);
        }
    });
    // unhide table
    document.getElementById('records').classList.remove('hide');
};
