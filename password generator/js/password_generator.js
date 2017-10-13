window.addEventListener('DOMContentLoaded', function() {
    var inputs = document.getElementsByTagName('input'),
        password,
        buttons = document.getElementsByTagName('button');
    inputs[0].value = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    inputs[1].value = 15;
    generatePassword();
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            if (+inputs[1].value < 1) {
                inputs[1].value = 1;
            }
            if (!i) {
                inputs[0].value = '';
            } else if (i === 1) {
                inputs[0].value += 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
            } else if (i === 2) {
                inputs[0].value += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            } else if (i === 3) {
                inputs[0].value += '0123456789';
            } else if (i === 4) {
                inputs[0].value += '(){}\\/<>~`@#№$%^&*+=!?.,-_:;"'
            } else {
                if (inputs[0].value !== '') {
                    generatePassword();
                }
            }
        }
    }

    function generatePassword() {
        password = '';
        for (let i = 0; i < +inputs[1].value; i++) {
            password += inputs[0].value[Math.floor(Math.random() * inputs[0].value.length)];
        }
        inputs[2].value = password;
    }
});
