// Leaderboard
// linter: ngspicejs-lint
// global: window, document, console
"use strict";

var SC = window.SC || {};

SC.leaderboard = function () {
    // Show leaderboard
    document.getElementById('leaderboard').classList.remove('hide');
    function hide() {
        // Hide leaderboard
        document.getElementById('leaderboard').classList.add('hide');
    }
    document.getElementById('leaderboard_close').onclick = hide;
    document.getElementById('leaderboard_car2').onclick = SC.carDialog.show;
    document.getElementById('leaderboard_car').onclick = SC.carDialog.show;
    document.getElementById('leaderboard_car').src = SC.cars[SC.player.car].icon;

    // fetch data
    SC.fetch('track/leaderboard.json?v=3', function (aData) {
        //console.log(aData[0]);
        window.z = aData;

        // insert player's times
        var pr = {
            you: true,
            name: SC.player.name,
            country: SC.player.country,
            total: 0
        };
        for (var t in SC.tracks) {
            var r = SC.storage.readObject('SC.record.' + t, null);
            if (r) {
                pr['track' + t] = {
                    car: Object.keys(SC.cars).indexOf(r.car_name) + 1,
                    index: -1,
                    lap_time: r.record_lap_time
                };
                pr.total += r.record_lap_time;
            } else {
                pr['track' + t] = {car: 1, index: -1, lap_time: undefined};
                pr.total = undefined;
            }
        }
        aData.push(pr);

        // sort by total time
        aData = aData.sort((a,b) => a.total - b.total);

        // find best time for each track
        var best_time = [], best_total = 0;
        aData.forEach(d => {
            [d.track1, d.track2, d.track3, d.track4, d.track5, d.track6, d.track7].forEach((t,i) => {
                best_time[i] = best_time[i] || 999;
                if (t.lap_time < best_time[i]) {
                    best_time[i] = t.lap_time;
                }
            });
        });

        function onTdClick(event) {
            // Click on time will compete
            event.preventDefault();
            var o = event.target.data;
            window.o = o;
            if (!o.time) {
                return;
            }
            SC.splash(
                'Challenge',
                ['Challenge', 'Decline'],
                'white',
                'Do you want to challenge time ' + o.time.toFixed(3) + 's by ' + o.driver + ' in ' + o.car_name + ' on track ' + o.track_title + '?',
                function (aButton) {
                    if (aButton === 'Challenge') {
                        console.log(aButton, o);
                        SC.currentTrack = o.track_id;
                        SC.currentOpponent = {
                            you: o.record_index === -1,
                            name: o.driver,
                            lap_time: o.time,
                            car: o.car_name
                        };
                        // improve own record
                        if (SC.currentOpponent.you) {
                            var my_rec = SC.storage.readObject('SC.record.' + SC.currentTrack);
                            document.getElementById('leaderboard').classList.add('hide');
                            document.getElementById('records').classList.add('hide');
                            SC.startTrack(
                                SC.currentTrack,
                                my_rec.record,
                                true,
                                my_rec.car_name
                            );
                        } else {
                            // beat other record
                            var spinner = SC.spinner(10);
                            SC.fetch('track/' + SC.tracks[SC.currentTrack].dir + '/record/' + o.record_index + '.json', function (aCompactRecord) {
                                spinner.hide();
                                document.getElementById('leaderboard').classList.add('hide');
                                document.getElementById('records').classList.add('hide');
                                SC.startTrack(SC.currentTrack, aCompactRecord, true, o.car_name);
                            });
                        }
                    }
                }
            );
            //console.log(o);
        }

        function renderTime(aColumn, aRow, aValue, aTd, aTime) {
            // Show best time green, other as red diffs
            aTd.onclick = onTdClick;
            aColumn = parseInt(aColumn, 10);
            aTd.data = {time: aTime};
            aTd.data.track_id = aColumn;
            aTd.data.track_title = SC.tracks[aColumn].title;
            var o = aData[aRow]['track' + aColumn];
            aTd.data.car_id = o.car;
            aTd.data.car_name = SC.carNumberToName(o.car);
            aTd.data.driver = aData[aRow].name;
            aTd.data.record_index = o.index;
            var t = aTime;
            var b = best_time[aColumn - 1];
            if (t === b) {
                aTd.style.color = 'red';
                return t;
            }
            aTd.style.color = 'pink';
            if (!t) {
                return '';
            }
            return '+' + (t - b).toFixed(3);
        }

        document.getElementById('leaderboard_container').textContent = '';
        var tab = SC.table(
            document.getElementById('leaderboard_container'),
            aData,
            ['Driver', 'Track1', 'Track2', 'Track3', 'Track4', 'Track5', 'Track6', 'Track7', 'Total'],
            function (aColumn, aRow, aValue, aTd) {
                // format cell
                if (aRow === -1) {
                    return aValue;
                }
                // name
                if (aColumn === '0') {
                    if (aData[aRow].you) {
                        aTd.parentElement.style.backgroundColor = 'green';
                    }
                    return (aRow + 1) + '. ' + SC.emojiFlags[aData[aRow].country] + ' ' + aData[aRow].name;
                }
                // tracks
                if (aColumn === '1') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track1.lap_time);
                }
                if (aColumn === '2') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track2.lap_time);
                }
                if (aColumn === '3') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track3.lap_time);
                }
                if (aColumn === '4') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track4.lap_time);
                }
                if (aColumn === '5') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track5.lap_time);
                }
                if (aColumn === '6') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track6.lap_time);
                }
                if (aColumn === '7') {
                    return renderTime(aColumn, aRow, aValue, aTd, aData[aRow].track7.lap_time);
                }
                if (aColumn === '8') {
                    aTd.style.fontWeight = 'bold';
                    if (aRow === 0) {
                        best_total = aData[aRow].total;
                        aTd.style.color = 'red';
                        return aData[aRow].total.toFixed(3);
                    }
                    aTd.style.color = 'pink';
                    if (!aData[aRow].total) {
                        return '';
                    }
                    return '+' + (aData[aRow].total - best_total).toFixed(3);
                }
                return aColumn;
            },
            function (aData,b) {
                // click on row
                console.log(aData,b);
            },
        );

        tab.classList.add('records');
    });
};
