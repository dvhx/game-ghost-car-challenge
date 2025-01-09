// Simple popup menu
// require: none
"use strict";
// globals: window, document, setTimeout

var SC = window.SC || {};

SC.popup = function (aLabels, aCallback, aRequired) {
    // display popup menu
    var bg, div, k, line, cb;

    // semi-transparent background
    bg = document.createElement('div');
    bg.style.position = 'fixed';
    bg.style.zIndex = 998;
    bg.style.left = '0';
    bg.style.top = '0';
    bg.style.right = '0';
    bg.style.bottom = '0';
    bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    document.body.appendChild(bg);
    if (!aRequired) {
        bg.addEventListener('click', function () {
            bg.parentElement.removeChild(bg);
            aCallback();
        });
    }

    // div
    div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.zIndex = 999;
    div.style.borderRadius = '1ex';
    div.style.border = '1px solid gray';
    div.style.padding = '1ex';
    div.style.left = '1cm';
    div.style.right = '1cm';
    div.style.bottom = '1cm';
    div.style.color = 'black';
    div.style.backgroundColor = 'white';
    div.style.boxShadow = '0 0 2ex rgba(0,0,0,0.5)';
    div.style.cursor = 'pointer';
    div.style.fontSize = 'large';
    div.style.userSelect = 'none';
    div.style.maxHeight = 'calc(100vh - 2cm)';
    div.style.overflowY = 'auto';
    div.style.boxSizing = 'border-box';
    bg.appendChild(div);

    // array of strings (clickable menu)
    cb = function (event) {
        console.log(event.target.data);
        event.cancelBubble = true;
        bg.parentElement.removeChild(bg);
        if (aCallback) {
            aCallback(event.target.data);
        }
        //if (aRequired) {
        //    bg.parentElement.removeChild(bg);
        //}
    };

    function onMouseOver(event) {
        event.target.style.backgroundColor = 'skyblue';
    }

    function onMouseOut(event) {
        event.target.style.backgroundColor = '';
    }

    for (k = 0; k < aLabels.length; k++) {
        line = document.createElement('div');
        line.textContent = aLabels[k];
        line.data = aLabels[k];
        line.style.paddingTop = '1ex';
        line.style.paddingBottom = '1ex';
        line.addEventListener('click', cb, true);
        line.addEventListener('mouseover', onMouseOver);
        line.addEventListener('mouseout', onMouseOut);
        div.appendChild(line);
    }

    return div;
};

