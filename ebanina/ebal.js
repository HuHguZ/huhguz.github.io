window.addEventListener('load', function() {
    var tx = document.getElementById('result');
    document.getElementById('number').addEventListener('input', function() {
        if (this.value) {
            tx.value = createEbanina(new Big(this.value));
        }
    });

    function createEbanina(num) {
        if (typeof num == 'object') {
            if (num.s == -1) {
                num.s *= -1;
                return `-(${createEbanina(num)})`;
            }
        }
        var digits = typeof num == 'object' ? toBin(num) : toBinFast(num),
            res = ``;
        if (!digits.length) {
            return `0`;
        }
        for (var i = 0; i < digits.length; i++) {
            if (i == digits.length - 1) {
                res += isMagic(digits[i]) ? !digits[i] ? `-~0` : digits[i] <= 2 ? `-~0<<${getMagic(digits[i])}` : `-~0<<(${getMagic(digits[i])})` : `-~0<<(${createEbanina(digits[i])})`;
            } else {
                res += isMagic(digits[i]) ? !digits[i] ? `-~0|` : digits[i] <= 2 ? `-~0<<${getMagic(digits[i])}|` : `-~0<<(${getMagic(digits[i])})|` : `-~0<<(${createEbanina(digits[i])})|`;
            }
        }
        return res;
    }

    var arr= [1054, 1083, 1077, 1075, 32, 1087, 1080, 1076, 1086, 1088, 41, 48, 41];
    for (var i = 0; i < arr.length; i++) {
        arr[i] = createEbanina(new Big(arr[i]));
    }
    console.log(arr.join(`, `));
    var a = [-~0<<-~0|-~0<<-~0<<-~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0|-~0<<-~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0|-~0<<-~0<<-~0|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0|-~0<<-~0|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0<<(-~0|-~0<<-~0<<-~0), -~0|-~0<<-~0|-~0<<-~0<<-~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0<<(-~0|-~0<<-~0)|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0<<-~0<<-~0|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0<<-~0|-~0<<-~0<<-~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0<<(-~0<<-~0|-~0<<-~0<<-~0)|-~0<<(-~0<<-~0|-~0<<(-~0|-~0<<-~0)), -~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0), -~0<<(-~0<<-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0), -~0|-~0<<(-~0|-~0<<-~0)|-~0<<(-~0|-~0<<-~0<<-~0)], b = ``;
    for (var i = 0; i < a.length; i++) {
        b += String.fromCharCode(a[i]);
    }
    b;
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
        var digits = [],
            pow = 0;
        while (num.c.length != 1 || num.c[0]) {
            if (num.mod(2).c[0]) {
                digits.push(pow);
            }
            num = num.div(2).round();
            pow++;
        }
        return digits;
    }

    function toBinFast(n) {
        var bits = [],
            maxIter = Math.log(n) / Math.log(2);
        for (var i = 0; i <= maxIter; i++) {
            if (n & (1 << i)) {
                bits.push(i);
            }
        }
        return bits;
    }
});