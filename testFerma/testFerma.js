window.addEventListener(`load`, () => {
    const number = document.getElementById(`number`);
    const test = document.getElementById(`test`);
    const result = document.getElementById(`result`);
    const rounds = document.getElementById(`rounds`);

    const isPrime = (n, iterations = n.sqrt().round().plus(1)) => {
        if ((n.mod(2).eq(0) && !n.eq(2)) || n.eq(1)) {
            return false;
        } else if (n.eq(2)) {
            return true;
        }
        if (iterations.gte(n)) {
            iterations = n.sqrt().round().plus(1);
        }
        for (let i = new Big(3); i.lte(iterations); i = i.plus(2)) {
            if (n.mod(i).eq(0)) {
                return false;
            }
        }
        return true;
    };

    const toBin = num => {
        let str = ``;
        while (num.c.length != 1 || num.c[0]) {
            str += num.mod(2).c[0];
            num = num.div(2).round();
        }
        return str.split(``).reverse().join(``);
    };

    const modularPow = (base, exponenta, module) => {
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
        return res;
    };

    const nod = (a, b) => (b.eq(0)) ? a : nod(b, a.mod(b));

    const testFerma = (n, rounds = 20) => {
        const prime = isPrime(n, new Big(127));
        if (!prime) {
            return 0;
        } else if (prime && n.lte(127)) { //new Big(0.1).lte(new Big(0.1)) //true (<=)
            return 1;
        }
        const cache = {};
        for (let i = 0; i < rounds; i++) {
            let a = new Big(Math.random()).mul(n.minus(2)).round().plus(2);
            while (cache[a]) {
                a = new Big(Math.random()).mul(n.minus(2)).round().plus(2);
            }
            cache[a.valueOf()] = 1;
            if (!nod(n, a).eq(1)) {
                return 0;
            }
            if (!modularPow(a, n.minus(1), n).eq(1)) {
                return 0;
            }
        }
        return 1;
    };

    let last;

    test.addEventListener(`click`, () => {
        if (!number.value || new Big(number.value).lte(0)) {
            swal({
                title: "Ошибка",
                text: "Числа должны быть больше 1",
                icon: "error",
            });
            setTimeout(() => {
                document.getElementsByClassName(`swal-button`)[0].dispatchEvent(new Event(`click`));
            }, 2000);
        } else if (number.value != last) {
            last = number.value;
            swal(`Выполнение теста...`);
            setTimeout(() => {
                if (rounds.value <= 0) {
                    rounds.value = 1;
                }
                result.textContent = [`Непростое`, `Простое`][testFerma(new Big(number.value || 0), rounds.value)];
                document.getElementById(`num`).textContent = number.value;
                document.getElementsByClassName(`swal-button`)[0].dispatchEvent(new Event(`click`));
            }, 200);
        }
    });
});
