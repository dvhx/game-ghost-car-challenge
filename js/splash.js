// Nice animated popup window with custom content
// require: none
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.splash = function (aTitle, aButtons, aColor, aShowCallback, aHideCallback, aWidth, aHeight) {
    // Nice popup window with custom content
    var bg, div, h1, content, callback_called, header, i, button, buttons, buttonsArray = [], first, hide, hasButtons = Array.isArray(aButtons) && aButtons.length > 0;
    aButtons = typeof aButtons === 'string' ? [aButtons] : aButtons;

    // background
    bg = document.createElement('div');
    bg.className = 'splash bg';

    // window
    div = document.createElement('div');
    div.className = 'window';
    if (aColor) {
        div.style.backgroundColor = aColor;
    }

    header = document.createElement('div');
    header.className = 'header';
    div.appendChild(header);

    if (aTitle) {
        h1 = document.createElement('h1');
        h1.textContent = aTitle;
        header.appendChild(h1);
    }

    function onKeyDown(event) {
        // Enter will choose first button
        if (event.keyCode === 13) {
            if (hasButtons) {
                first.click();
            } else {
                hide();
            }
        }
        if (event.keyCode === 27) {
            hide();
        }
    }
    window.addEventListener('keydown', onKeyDown, true);

    hide = function (event) {
        var btn = event && event.target && event.target.nodeName === 'BUTTON' && event.target.textContent;
        bg.style.opacity = 0;
        div.style.maxHeight = div.style.clientHeight + 'px';
        div.style.opacity = 0;
        if (div.style.width === 'auto') {
            div.style.width = div.getBoundingClientRect().width + 'px';
        }
        setTimeout(function () {
            div.style.width = 0;
        }, 10);
        window.removeEventListener('keydown', onKeyDown, true);
        setTimeout(function () {
            if (bg.parentElement) {
                bg.parentElement.removeChild(bg);
            }
            if (!callback_called) {
                callback_called = true;
                if (aHideCallback) {
                    aHideCallback(btn);
                }
            }
        }, 700);
    };

    function bgClick(event) {
        if (hasButtons) {
            if (event.target === bg) {
                hide();
                //first.click();
            }
        } else {
            hide();
        }
    }
    bg.addEventListener('click', bgClick);

    content = document.createElement('div');
    content.className = 'content';
    if (aHeight === 'auto') {
        content.style.minHeight = '1cm';
    }
    div.appendChild(content);

    if (aButtons) {
        buttons = document.createElement('div');
        buttons.className = 'buttons';
        div.appendChild(buttons);

        for (i = 0; i < aButtons.length; i++) {
            button = document.createElement('button');
            button.textContent = aButtons[i];
            button.addEventListener('click', hide);
            buttons.appendChild(button);
            if (i === 0) {
                first = button;
            }
            buttonsArray.push(button);
        }
    }

    document.body.appendChild(bg);
    bg.appendChild(div);

    // start animation
    setTimeout(function () {
        bg.style.opacity = 1;
        div.style.opacity = 1;
        div.style.width = aWidth || '50vw';
        div.style.height = aHeight || 'auto';
    }, 100);

    if (typeof aShowCallback === 'function') {
        setTimeout(function () {
            aShowCallback(content);
            content.style.opacity = 1;
        }, 500);
    }
    if (typeof aShowCallback === 'string') {
        content.textContent = aShowCallback;
        content.style.opacity = 1;
    }

    function bgClickDisable() {
        bg.removeEventListener('click', bgClick);
    }

    function bgClickEnable() {
        bg.addEventListener('click', bgClick);
    }

    return {
        bg: bg,
        bgClickDisable: bgClickDisable,
        bgClickEnable: bgClickEnable,
        header: header,
        div: div,
        h1: h1,
        content: content,
        buttons: buttons,
        buttonsArray: buttonsArray,
        hide: hide
    };
};

