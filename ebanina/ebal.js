window.addEventListener('load', function() {
    var tx = document.getElementById('result');
    document.getElementById('number').addEventListener('input', function() {
        tx.value = createEbanina(+this.value);
    });

    function createEbanina(num) {
        if (num < 0) {
            return `-(${createEbanina(-num)})`;
        }
        var bin = toBin(num),
            digits = [],
            res = ``;
        for (var i = 0; i < bin.length; i++) {
            if (+bin[i]) {
                digits.push(bin.length - i - 1);
            }
        }
        if (!digits.length) {
            return `0`;
        }
        for (var i = 0; i < digits.length; i++) {
            res += isMagic(digits[i]) ? digits[i] <= 2 ? `-~0<<${getMagic(digits[i])}|` : `-~0<<(${getMagic(digits[i])})|` : `-~0<<(${createEbanina(digits[i])})|`;

        }
        return res.slice(0, res.length - 1);
    }

    function isMagic(num) {
        var mgn = [0];
        for (var i = 1; i < 5; i++) {
            mgn.push(2 ** mgn[i - 1]);
        }
        return ~mgn.indexOf(num);
    }

    function getMagic(num) {
        var mgn = {
            0: '0',
            1: '-~0<<0',
            2: '-~0<<-~0<<0',
            4: '-~0<<-~0<<-~0<<0',
            16: '-~0<<(-~0<<-~0<<-~0<<0)',
        };
        return mgn[num];
    }

    function toBin(num) {
        if (num < 0) {
            return `-${toBin(-num)}`;
        }
        if (!num) {
            return 0;
        }
        var bn = '';
        while (num) {
            bn += num % 2;
            num = Math.floor(num / 2);
        }
        return bn.split('').reverse().join('');
    }
});