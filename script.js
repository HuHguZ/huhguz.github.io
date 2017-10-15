window.addEventListener('DOMContentLoaded', function() {
    var texts = document.getElementsByTagName('textarea'),
        inps = document.getElementsByTagName('input'),
        buttons = document.getElementsByTagName('button'),
        select = document.getElementsByTagName('select'),
        alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}\\/<>«»„“~`@#№$%^&*+=!?.,-_:;" ',
        key = [],
        n, c;
    inps[0].value = alphabet;
    inps[2].value = 1;
    select[0].value = Math.floor(Math.random()*3);
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
            if (obj[texts[0].value[i]]) {
                rez += obj[texts[0].value[i]];
            } else {
                rez += texts[0].value[i];
            }
        }
        texts[1].value = rez;
    }

    function generateKey() {
        if (!(+select[0].value)) {
            var l = alphabet.length;
            alphabet = alphabet.split('');
            for (let i = 0; i < l; i++) {
                n = Math.floor(Math.random() * alphabet.length);
                key[key.length] = alphabet[n];
                alphabet.splice(n, 1);
            }
        } else if (+select[0].value === 1) {
            var pos = Math.floor(Math.random() * (1114111 - inps[0].value.length));
            for (let i = pos; i < pos + inps[0].value.length; i++) {
                key[key.length] = String.fromCharCode(i);
            }
        } else if (+select[0].value === 2) {
            var symbolPosition, positions = [];
            for (let i = 0; i < inps[0].value.length; i++) {
                symbolPosition = Math.floor(Math.random() * 1114112);
                while (positions.join(' ').indexOf(symbolPosition) > -1) {
                    symbolPosition = Math.floor(Math.random() * 1114112);
                }
                positions[positions.length] = symbolPosition;
                key[key.length] = String.fromCharCode(symbolPosition);
            }
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
