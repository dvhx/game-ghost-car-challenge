// Render stats tables
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.table = function (aParent, aData, aColumns, aFormatCallback, aRowClickCallback) {
    // Create HTML table from data
    var p = typeof aParent === 'string' ? document.getElementById(aParent) : aParent, i, k, table, tr, td, v;
    table = document.createElement('table');

    aFormatCallback = aFormatCallback || function (aColumn, aRow, aValue, aTd) {
        return aValue;
    };

    function trClick(event) {
        var e = event.target;
        while (e && (e.nodeName !== 'TR')) {
            e = e.parentElement;
        }
        aRowClickCallback(e.data);
    }

    // header
    tr = document.createElement('tr');
    for (k in aColumns) {
        if (aColumns.hasOwnProperty(k)) {
            td = document.createElement('th');
            tr.appendChild(td);
            v = aFormatCallback(k, -1, (aColumns && aColumns[k]) || k, td);
            if (typeof v !== 'object') {
                td.textContent = v;
            }
        }
    }
    table.appendChild(tr);

    // rows
    for (i = 0; i < aData.length; i++) {
        tr = document.createElement('tr');
        tr.data = aData[i];
        tr.onclick = trClick;
        for (k in aColumns) {
            if (aColumns.hasOwnProperty(k)) {
                td = document.createElement('td');
                tr.appendChild(td);
                v = aFormatCallback(k, i, aData[i][k], td);
                if (typeof v !== 'object') {
                    td.textContent = v;
                }
            }
        }
        table.appendChild(tr);
    }
    p.appendChild(table);

    return table;
};
