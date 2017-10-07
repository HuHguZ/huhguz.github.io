window.addEventListener('DOMContentLoaded', function() {
    var texts = document.getElementsByTagName('textarea'),
        inps = document.getElementsByTagName('input'),
        buttons = document.getElementsByTagName('button'),
        alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()!?.,-:;" ',
        key = [],
        n, c,
        generation = alphabet.split('');
    inps[0].value = alphabet;
    inps[2].value = 1;
    generateKey();
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            if (+inps[2].value < 1) {
                inps[2].value = 1;
            }
            if (!i) {
                if (+inps[2].value === 1) {
                    code(1);
                } else {
                    for (let i = 0; i < +inps[2].value; i++) {
                        code(1);
                        swap();
                    }
                    if (!(+inps[2].value % 2)) {
                        swap();
                    }
                }
            } else if (i === 1) {
                if (+inps[2].value === 1) {
                    code(0);
                } else {
                    for (let i = 0; i < +inps[2].value; i++) {
                        code(0);
                        swap();
                    }
                    if (!(+inps[2].value % 2)) {
                        swap();
                    }
                }
            } else if (i === 2) {
                generateKey();
            } else if (i === 3) {
                swap();
            } else if (i === 4) {
                clear();
            }
        }
    }
    inps[0].onkeyup = function() {
        alphabet = inps[0].value;
    }

    function code(type) {
        var obj = {},
            rez = '';
        if (type) {
            for (let i = 0; i < alphabet.length; i++) {
                obj[alphabet[i]] = inps[1].value[i];
            }
        } else {
            for (let i = 0; i < alphabet.length; i++) {
                obj[inps[1].value[i]] = alphabet[i];
            }
        }
        for (let i = 0; i < texts[0].value.length; i++) {
            if (obj[texts[0].value[i].toLowerCase()] !== undefined) {
                rez += obj[texts[0].value[i]];
            } else {
                rez += texts[0].value[i];
            }
        }
        texts[1].value = rez;
    }

    function generateKey() {
        var l = alphabet.length;
        alphabet = alphabet.split('');
        for (let i = 0; i < l; i++) {
            n = Math.floor(Math.random() * alphabet.length);
            key[key.length] = alphabet[n];
            alphabet.splice(n, 1);
        }
        inps[1].value = key.join('');
        key.splice(0, key.length);
        alphabet = inps[0].value;
    }

    function swap() {
        c = texts[1].value;
        texts[1].value = texts[0].value;
        texts[0].value = c;
    }

    function clear() {
        texts[0].value = '';
        texts[1].value = '';
        inps[2].value = 1;
    }
});
