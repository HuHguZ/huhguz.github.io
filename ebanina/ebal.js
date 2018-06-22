window.addEventListener('load', function() {
    var tx = document.getElementById('result');
    document.getElementById('number').addEventListener('input', function() {
        if (this.value) { 
            tx.value = createEbanina(new Big(this.value));
        }
    });

    function createEbanina(num) {
        if (num.s == -1) {
            num.s *= -1;
            return `-(${createEbanina(num)})`;
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
            res += isMagic(digits[i]) ? !digits[i] ? `-~0 ` : digits[i] <= 2 ? `-~0<<${getMagic(digits[i])}|` : `-~0<<(${getMagic(digits[i])})|` : `-~0<<(${createEbanina(new Big(digits[i]))})|`;
        }
        return res.slice(0, res.length - 1);
    }



    function getDigits(str) {
        var digits = [];
        for (var i = 0; i < str.length; i++) {
            if (+str[i]) {
                digits.push(str.length - i - 1);
            }
        }
        return digits;
    }


    function isMagic(num) {
        var mgn = [0, 1, 2, 4, 16];
        return ~mgn.indexOf(num);
    }

    function getMagic(num) {
        var mgn = {
            0: `0`,
            1: `-~0`,
            2: `-~0<<-~0`,
            4: `-~0<<-~0<<-~0`,
            16: `-~0<<(-~0<<-~0<<-~0)`,
        };
        return mgn[num];
    }

    function toBin(num) {
        if (num.s == -1) {
            num.s *= -1;
            return `-${toBin(num)}`;
        }
        if (num.c.length == 1 && !num.c[0]) {
            return `0`;
        }
        var bn = ``;
        while (num.c.length != 1 || num.c[0]) {
            bn += num.mod(2);
            num = num.div(2).round();
        }
        return bn.split(``).reverse().join(``);
    }
});