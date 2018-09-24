window.addEventListener('load', () => {
    let getElem = el => document.getElementById(el),
        input = getElem(`input`),
        out = getElem(`out`),
        start = getElem(`start`),
        createTowerOfBabel = (n, d, h) => {
            if (n < 1 || n > 1000 || d < 1 || d > n || h < 1 || h > 30 || (h == 1 && n != d)) {
                return 0;
            }
            if (h == 1) {
                return [n];
            } else if (h == 2) {
                let a = n - d;
                if (Math.abs(d - a) == 1) {
                    return [d, a];
                } else {
                    return 0;
                }
            } else {
                let a = n - d;
                if (a <= 0) {
                    return 0;
                }
                let b = [d].concat(createTowerOfBabel(n - d, d + 1, h - 1));
                if (!~b.indexOf(0)) {
                    return b;
                }
                let c = [d].concat(createTowerOfBabel(n - d, d - 1, h - 1));
                if (~c.indexOf(0)) {
                    return 0;
                }
                return c;
            }
        };
    start.addEventListener(`click`, () => {
        let args = input.value.split(/\s+/).map(e => +e);
        if (args.some(e => isNaN(e)) || !args.length) {
            out.value = `Неверные входные данные`;
        } else {
            let r = createTowerOfBabel(...args);
            if (typeof r == `object`) {
                out.value = r.join(`\n`);
            } else {
                out.value = r;
            }
        }
    });
});