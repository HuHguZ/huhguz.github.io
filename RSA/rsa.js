window.addEventListener(`load`, () => {
    let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}\\/<>«»„“~`@#№$%^&*+=!?.,-_:;" ',
        positions = {},
        props = [`msg`, `ciphertext`, `msg2`, `ciphertext2`, `p1`, `p2`, `rndp`, `pubExp`, `mul`, `Fn`, `decrypt`, `privExp`, `encrypt`, `calc`, `range`],
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
        modularPow = (base, exponenta, module) => {
            // let c = new Big(1);
            // for (let i = 0; !exponenta.eq(i); i++) {
            //     c = c.mul(base).mod(module);
            // }
            let c = 1;
            for (let i = 0; i < exponenta; i++) {
                c = (c * base) % module;
            }
            return c;
        },
        generate = (bool) => {
            let counter = 0,
                p1, p2;
            if (!bool) {
                let s = elements.range.value.match(/\s*(\d+)\s*;\s*(\d+)\s*/),
                    min = +s[1],
                    max = +s[2];
                for (let i = getRandomInt(min, max); i < max; i++) {
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
        };
    for (let i = 0; i < alphabet.length; i++) {
        positions[alphabet[i]] = i;
    }
    for (let i = 0; i < props.length; i++) {
        elements[props[i]] = document.getElementById(props[i]);
    }
    elements.rndp.addEventListener(`click`, () => generate());
    generate();
    elements.calc.addEventListener(`click`, () => generate(1));
    elements.encrypt.addEventListener(`click`, () => {
        t = ``;
        for (let i = 0; i < elements.msg.value.length; i++) {
            t += `${modularPow(positions[elements.msg.value[i]] + 5, +elements.pubExp.value, +elements.mul.value)} `;
        }
        t = t.slice(0, t.length - 1);
        elements.ciphertext.value = t;
    });
    elements.decrypt.addEventListener(`click`, () => {
        let nums = elements.ciphertext2.value.split(/\s+/);
        t = ``;
        for (let i = 0; i < nums.length; i++) {
            t += alphabet[modularPow(+nums[i], +elements.privExp.value, +elements.mul.value) - 5];
        }
        elements.msg2.value = t;
    });
    // .match(/\s*(\d+)\s*;\s*(\d+)\s*/)
    // console.log(euler(new Big(3557), new Big(2579)).valueOf());
    // console.log(getPubExp(new Big(9167368)));
    // console.log(getPrivExp(new Big(3), new Big(9167368)).valueOf());
    // console.log(modularPow(new Big(12), new Big(16626307), new Big(3566557)));
    // console.log(modularPow(12, 16626307, 3566557));
});