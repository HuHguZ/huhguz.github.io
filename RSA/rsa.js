window.addEventListener(`load`, () => {
    let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}\\/<>«»„“~`@#№$%^&*+=!?.,-_:;" ',
        positions = {},
        props = [`msg`, `ciphertext`, `msg2`, `ciphertext2`, `p1`, `p2`, `rndp`, `pubExp`, `mul`, `Fn`, `decrypt`, `privExp`, `encrypt`, `calc`, `range`, `alph`, `up`],
        elements = {},
        t = ``,
        euler = (p1, p2) => p1.minus(1).mul(p2.minus(1)),
        getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min,
        getPubExp = (Fn) => {
            let ers = math.ers(200),
                pos = 1;
            while (!Fn.mod(ers[pos]).c[0]) {
                pos++;
            }
            return ers[pos];
        },
        getPrivExp = (e, Fn) => {
            let k = 1,
                d = (new Big(1).plus(new Big(k).mul(Fn))).div(e);
            while (!d.eq(d.round()) || d.eq(e)) {
                k++;
                d = (new Big(1).plus(new Big(k).mul(Fn))).div(e);
            }
            return d;
        },
        toBin = num => {
            var str = ``;
            while (num.c.length != 1 || num.c[0]) {
                str += num.mod(2).c[0];
                num = num.div(2).round();
            }
            return str.split(``).reverse().join(``);
        },
        modularPow = (base, exponenta, module) => {
            base = new Big(base);
            exponenta = new Big(exponenta);
            module = new Big(module);
            let bin = toBin(exponenta),
                results = [base],
                res;
            for (let i = 1; i < bin.length; i++) {
                results[i] = results[i - 1].pow(2).mod(module);
            }
            res = results[results.length - 1];
            for (let i = 1; i < bin.length; i++) {
                if (+bin[i]) {
                    res = res.mul(results[bin.length - i - 1]).mod(module);
                }
            }
            return res.valueOf();
        },
        generate = (f) => {
            let counter = 0,
                p1, p2;
            if (!f) {
                let s = elements.range.value.match(/\s*(\d+)\s*;\s*(\d+)\s*/),
                    min = +s[1],
                    max = +s[2];
                for (let i = getRandomInt(min, max - 100); i < max; i++) {
                    if (math.isPrime(i)) {
                        if (!counter) {
                            p1 = i;
                            counter++;
                        } else if (counter == 1) {
                            p2 = i;
                            counter++;
                        } else {
                            break;
                        }
                    }
                }
                elements.p1.value = p1;
                elements.p2.value = p2;
            }
            elements.Fn.value = euler(new Big(elements.p1.value), new Big(elements.p2.value));
            elements.mul.value = new Big(elements.p1.value).mul(new Big(elements.p2.value)).valueOf();
            elements.pubExp.value = getPubExp(new Big(elements.Fn.value));
            elements.privExp.value = getPrivExp(elements.pubExp.value, elements.Fn.value);
        },
        updateAlphabet = () => {
            positions = {};
            for (let i = 0; i < alphabet.length; i++) {
                positions[alphabet[i]] = i;
            }
        };
    updateAlphabet();
    for (let i = 0; i < props.length; i++) {
        elements[props[i]] = document.getElementById(props[i]);
    }
    elements.alph.value = alphabet;
    elements.rndp.addEventListener(`click`, () => generate());
    generate();
    elements.calc.addEventListener(`click`, () => generate(1));
    elements.up.addEventListener(`click`, () => {
        alphabet = elements.alph.value;
        updateAlphabet();
    });
    elements.encrypt.addEventListener(`click`, () => {
        t = ``;
        for (let i = 0; i < elements.msg.value.length; i++) {
            t += `${modularPow(positions[elements.msg.value[i]] + 5, elements.pubExp.value, elements.mul.value) || elements.msg.value[i]} `;
        }
        t = t.slice(0, t.length - 1);
        elements.ciphertext.value = t;
    });
    elements.decrypt.addEventListener(`click`, () => {
        let nums = elements.ciphertext2.value.split(/\s+/);
        t = ``;
        for (let i = 0; i < nums.length; i++) {
            t += alphabet[modularPow(nums[i], elements.privExp.value, elements.mul.value) - 5] || nums[i];
        }
        elements.msg2.value = t;
    });
});