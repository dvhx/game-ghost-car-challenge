// Next gen spinner
"use strict";
// globals: document, window, setInterval, clearInterval, setTimeout

var SC = window.SC || {};

SC.spinnerError = 'before-init';

SC.spinnerShow = function (aHideAfterSeconds) {
    // Show spinner
    if (SC.spinnerDiv) {
        return;
    }
    SC.spinnerDiv = document.createElement('div');
    SC.spinnerDiv.style.position = 'fixed';
    SC.spinnerDiv.style.left = 'calc(50% - 0.5em)';
    SC.spinnerDiv.style.top = 'calc(50% - 0.5em)';
    SC.spinnerDiv.style.width = '1em';
    SC.spinnerDiv.style.height = '1em';
    SC.spinnerDiv.style.fontSize = 'xx-large';
    SC.spinnerDiv.style.borderTop = '0.1em solid red';
    SC.spinnerDiv.style.borderRight = '0.1em solid green';
    SC.spinnerDiv.style.borderBottom = '0.1em solid yellow';
    SC.spinnerDiv.style.borderLeft = '0.1em solid blue';
    SC.spinnerDiv.style.borderRadius = '50%';
    SC.spinnerDiv.style.transform = 'rotate(0deg)';
    SC.spinnerDiv.style.boxShadow = '0 0 1ex black inset, 0 0 1ex rgba(0,0,0,0.3)';
    SC.spinnerDiv.style.zIndex = 999;
    SC.spinnerDiv.style.opacity = '0';
    SC.spinnerDiv.style.transition = 'opacity 0.2s linear';
    document.body.appendChild(SC.spinnerDiv);

    // rotation
    SC.spinnerDiv.angle = 0;
    SC.spinnerDiv.time = (aHideAfterSeconds || 10) * 1000;
    function rotate() {
        if (!SC.spinnerDiv) {
            return;
        }
        SC.spinnerDiv.angle += 20;
        SC.spinnerDiv.style.transform = 'rotate(' + SC.spinnerDiv.angle + 'deg)';
        SC.spinnerDiv.time -= 150;
        if (SC.spinnerDiv.time <= 0) {
            SC.spinnerHide();
        }
    }
    SC.spinnerDiv.interval = setInterval(rotate, 150);

    // show it now
    setTimeout(function () {
        if (SC.spinnerDiv) {
            SC.spinnerDiv.style.opacity = 1;
        }
    }, 1);

    SC.spinnerDiv.addEventListener('click', SC.spinnerHide);
};

SC.spinnerHide = function () {
    // Hide spiner
    if (SC.spinnerDiv) {
        try {
            clearInterval(SC.spinnerDiv.interval);
            SC.spinnerDiv.style.opacity = 0;
            setTimeout(function () {
                if (SC.spinnerDiv && SC.spinnerDiv.parentElement) {
                    SC.spinnerDiv.parentElement.removeChild(SC.spinnerDiv);
                    SC.spinnerDiv = undefined;
                }
            }, 300);
        } catch (e) {
            console.error('Spinner error: ' + e);
        }
    }
};

SC.spinner = function (aHideAfterSeconds) {
    // Compatibility with old spinner
    SC.spinnerShow(aHideAfterSeconds);
    return {
        hide: SC.spinnerHide
    };
};
