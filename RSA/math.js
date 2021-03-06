/*!
 * Math JavaScript Library v1.18
 *
 * Author: HuHguZ
 *
 * Contact with me: vk.com/huhguz
 *
 * Date: 2017-09-24T19:54:31.076Z
 */

! function() {
    var DEFAULT_ACCURACY = 3,
        version = 1.18,
        erMsg = 'Error: incorrect arguments';

    let checkValueOn = (...args) => {
        for (var i = 1; i < args.length; i++) {
            if (args[i] !== args[i] || typeof args[i] !== '' + args[0] + '') {
                return true;
            }
        }
        return false;
    }
    let checkStringOn = (example, n) => {
        var c = false;
        for (var i = 0; i < n.length; i++) {
            for (var j = 0; j < example.length; j++) {
                if (n[i] === example[j]) {
                    c = !c;
                }
            }
            if (!c) {
                return !c;
            }
            if (c) {
                c = !c;
            }
        }
        return false;
    }
    let math = {

        //consts

        consts: {
            GS: 1.618033988749895, //золотое сечение - соотношение двух величин b и a, a > b, когда справедливо a/b = (a+b)/a
            EXP: 2.718281828459045, //e — основание натурального логарифма, математическая константа, иррациональное и трансцендентное число
            PI: 3.141592653589793, //математическая постоянная, равная отношению длины окружности к её диаметру
            C: 299792458, //скорость света в вакууме (м·с^-1)
            G: 6.67408e-11, //гравитационная постоянная (м^3·кг^−1·с^−2)
            U_0: 1.25663706144e-6, //магнитная постоянная (Гн·м^−1)
            U_E: -928.4764620e-26, //магнитный момент электрона (Дж·Тл^−1)
            U_B: 927.4009994e-26, //магнетон Бора (Дж·Тл^−1)
            U_N: 5.050783699e-27, //ядерный магнетон (Дж·Тл^−1)
            Z_0: 376.73031346177, //волновое сопротивление вакуума (Ом)
            E_0: 8.85418782e-12, //электрическая постоянная (Ф·м^−1)
            H_P: 6.626070040e-34, //постоянная Планка (элементарный квант действия) (Дж·с)
            H_P_2PI: 1.054571800e-34, //постоянная Дирака (приведённая постоянная Планка) (Дж·с)
            M_P: 2.176470e-8, //планковская масса (кг)
            L_P: 1.616229e-35, //планковская длина (м)
            TIME_P: 5.39116e-44, //планковское время (с)
            TEMP_P: 1.416808e+32, //планковская температура (К)
            E: 1.6021766208e-19, //элементарный заряд (кл)
            M_E: 9.109534e-31, //масса электрона (кг)
            M_PR: 1.6726485e-27, //масса протона (кг)
            M_N: 1.6749543e-27, //масса нейтрона (кг)
            M_H: 1.673532836e-27, //абсолютная масса атома водорода (кг)
            M_A: 1.660565e-27, //атомная единица массы (кг)
            N_A: 6.022045e+23, //постоянная Авогадро (моль^−1)
            F: 96484.56, //Постоянная Фарадея (Кл/моль)
            R: 8.3144598, //универсальная газовая постоянная (Дж/(моль*К))
            K: 1.38064852e-23, //постоянная Больцмана (Дж·К^−1)
            P_ATM: 101325, //стандартное атмосферное давление (Па)
            G_N: 9.80665, //стандартное ускорение свободного падения на поверхности Земли (усреднённое) (м·с^−2)
            //астрономические константы (масса в кг, расстояния в км)
            M_SUN: 1.98892e+30, //масса Солнца
            M_MER: 3.285e+23, //масса Меркурия
            M_V: 4.867e+24, //масса Венеры
            M_EARTH: 5.972e+24, //масса Земли
            M_MARS: 6.39e+23, //масса Марса
            M_J: 1.898e+27, //масса Юпитера
            M_S: 5.683e+26, //масса Сатурна
            M_U: 8.681e+25, //масса Урана
            M_NEP: 1.024e+26, //масса Нептуна
            M_PLUTO: 1.303e+22, //масса Плутона
            M_MOON: 7.3477e+22, //масса Луны
            AU: 1.496e+8, //астрономическая единица (расстояние от Земли до Солнца)
            PC: 3.08567758128e+13, //Парсек
            DBEAM: 3.844e+5, //расстояние между Землёй и Луной
            LY: 9.4607304725808e+12, //световой год
        },

        //Mathematical algorithms

        log(a, b, c = DEFAULT_ACCURACY) {
            // c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            return (checkValueOn('number', a, b, c) || (a === 0 && b === 0) || a === 1 || a < 0 || b < 0) ? erMsg : +(Math.log(b) / Math.log(a)).toFixed(c);
        },

        sumTo(n) {
            if (checkValueOn('number', n) || this.fraction(n) !== 0) {
                return erMsg;
            }
            if (n < 0) {
                var b = -n;
                for (var i = 1; i < -n; i++) {
                    b += n - i;
                }
                return b;
            } else {
                var b = n;
                for (var i = 1; i < n; i++) {
                    b += n - i;
                }
                return b;
            }
        },

        numIsPowOfNum(n) {
            var c = [];
            if (checkValueOn('number', n) || n < 0) {
                return erMsg;
            }
            for (var i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
                if (this.fraction(this.log(i, n, 10)) === 0) {
                    c[c.length] = '' + i + '**' + '' + this.log(i, n);
                }
            }
            c[c.length] = '' + n + '**' + 1;
            return c;
        },

        numIsFactOfNum(n) {
            if (checkValueOn('number', n) || n <= 0) {
                return erMsg;
            }
            var c = 2;
            while (n % c === 0) {
                n = n / c;
                c += 1;
            }
            if (n !== 1) {
                return false;
            } else {
                return c - 1;
            }
        },

        ers(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            var numbers = [],
                primeNumbers = [],
                p = 2;
            for (var i = 0; i < n; i++) {
                if (i > p && !((i + 1) % p)) {
                    primeNumbers[i] = false;
                } else {
                    primeNumbers[i] = true;
                }
            }
            p = 3;
            while (p * p <= n) {
                for (var i = p ** 2 - 1; i < n; i += 2 * p) {
                    primeNumbers[i] = false;
                }
                for (var i = p - 1; i < n; i++) {
                    if (primeNumbers[i] && i + 1 > p) {
                        p = i + 1;
                        break;
                    }
                }
            }
            for (var i = 2; i <= primeNumbers.length; i++) {
                if (primeNumbers[i - 1]) {
                    numbers[numbers.length] = i;
                }
            }
            return numbers;
        },

        ats(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            var t, k, numbers = [],
                primeNumbers = [];
            for (var x = 1; x <= Math.floor(Math.sqrt(n)); x++) {
                for (var y = 1; y <= Math.floor(Math.sqrt(n)); y++) {
                    t = 4 * (x ** 2 + y ** 2);
                    if ((t <= n) && ((t % 12 === 1) || (t % 12 === 5))) {
                        primeNumbers[t] = !primeNumbers[t];
                    }
                    t -= x ** 2;
                    if (t <= n && t % 12 === 7) {
                        primeNumbers[t] = !primeNumbers[t];
                    }
                    t -= 2 * (y ** 2);
                    if (x > y && t <= n && t % 12 === 11) {
                        primeNumbers[t] = !primeNumbers[t];
                    }
                }
            }
            for (var i = 5; i <= Math.floor(Math.sqrt(n)); i++) {
                if (primeNumbers[i]) {
                    k = i ** 2;
                    t = k;
                    while (t <= n) {
                        primeNumbers[t] = false;
                        t += k;
                    }
                }
            }
            if (n >= 2) {
                primeNumbers[2] = true;
            }
            if (n >= 3) {
                primeNumbers[3] = true;
            }
            for (var i = 2; i < primeNumbers.length; i++) {
                if (primeNumbers[i]) {
                    numbers[numbers.length] = i;
                }
            }
            return numbers;
        },

        isPrime(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            if (this.fraction(n) !== 0 || n <= 1) {
                return false;
            }
            for (var i = 2; i <= Math.sqrt(n); i++) {
                if (n % i === 0) {
                    return false;
                }
            }
            return true;
        },

        isSemsiPrime(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            for (var i = 2; i <= Math.floor(n ** 0.5); i++) {
                if (this.isPrime(i) && this.isPrime(n / i)) {
                    return i + ', ' + n / i;
                }
            }
            return false;
        },

        goldbp(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            if (n % 2 || n < 4) {
                return false;
            }
            var r = [],
                p = this.ers(Math.floor(n / 2));
            for (var i = 0; i < p.length; i++) {
                if (this.isPrime(p[i]) && this.isPrime(n - p[i])) {
                    r[r.length] = '' + (p[i]) + ', ' + (n - p[i]);
                }
            }
            return r;
        },

        goldtp(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            } else {
                if (!(n % 2) || n < 7) {
                    return false;
                }
                var p = this.ers(Math.floor(n - 4)),
                    r = [];
                for (var i = 0; i < p.length; i++) {
                    if (!((n - p[i]) % 2)) {
                        r[r.length] = f(n - p[i], p[i]);
                    }
                }

                function f(num, $num) {
                    var a = math.goldbp(num);
                    for (var i = 0; i < a.length; i++) {
                        a[i] = '' + $num + ', ' + a[i];
                    }
                    return a;
                }
                return r;
            }
        },

        isPerfectNum(n) {
            if (checkValueOn('number', n)) {
                return erMsg;
            }
            var a = math.log(2, 0.5 * ((8 * n + 1) ** 0.5 + 1));
            if (this.isPrime(a)) {
                return true;
            } else {
                return false;
            }
        },

        factorization(n) {
            if (checkValueOn('number', n) || this.fraction(n) !== 0 || n <= 0) {
                return erMsg;
            }
            if (this.isPrime(n)) {
                return 'Number is prime';
            }
            if (n === 1) {
                return [1];
            }
            var fctrzt = [];
            var num = this.ers(Math.floor(n ** 0.5));
            while (n !== 1) {
                for (var i = 0; i < num.length; i++) {
                    if (n % num[i] === 0) {
                        fctrzt[fctrzt.length] = num[i];
                        n /= num[i];
                        break;
                    } else {
                        if (this.isPrime(n)) {
                            fctrzt[fctrzt.length] = n;
                            return fctrzt;
                        }
                    }
                }
            }
            return fctrzt;
        },

        fib(n, c) {
            c = c || 0;
            if (checkValueOn('number', n, c)) {
                return erMsg;
            }
            var f = [1, 1];
            if (n === 0) {
                return 0;
            } else if (n === 1) {
                return 1;
            } else if (n < 0) {
                return erMsg;
            } else {
                for (var i = 2; i < n; i++) {
                    f[i] = f[i - 1] + f[i - 2];
                }
                return (!c) ? f[n - 1] : f;
            }
        },

        nd(a, b) {
            return (checkValueOn('number', a, b)) ? erMsg : (b === 0) ? a : this.nd(b, a % b);
        },

        nod() {
            for (var i = 0; i < arguments.length; i++) {
                if (checkValueOn('number', arguments[i])) {
                    return erMsg;
                }
            }
            var nod = this.nd(arguments[0], arguments[1]);
            for (var i = 2; i < arguments.length; i++) {
                nod = this.nd(nod, arguments[i]);
            }
            return nod;
        },

        nk(a, b) {
            return (checkValueOn('number', a, b)) ? erMsg : (a * b) / this.nd(a, b);
        },

        nok() {
            for (var i = 0; i < arguments.length; i++) {
                if (checkValueOn('number', arguments[i])) {
                    return erMsg;
                }
            }
            var nok = this.nk(arguments[0], arguments[1]);
            for (var i = 2; i < arguments.length; i++) {
                nok = this.nk(nok, arguments[i]);
            }
            return nok;
        },

        dividers(n) {
            if (checkValueOn('number', n) || this.fraction(n) !== 0 || n < 1) {
                return erMsg;
            }
            if (this.isPrime(n)) {
                return 'Number is prime';
            } else {
                var d = [1];
                if (n === 1) {
                    return 1;
                }
                for (var i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
                    if (n % i === 0) {
                        d[d.length] = i;
                        if (n / i !== i) {
                            d[d.length] = n / i;
                        }
                    }
                }
                d[d.length] = n;
                return this.Qsort(d);
            }
        },

        sumNumerals(n) {
            return (checkValueOn('number', n)) ? erMsg : ((n).toString().indexOf('e') !== -1) ? this.sumNumerals(+(((n).toString().indexOf('.') !== -1) ? +((n).toString().substring(0, (n).toString().indexOf('e'))) * Math.pow(10, (n).toString().indexOf('e') - (n).toString().indexOf('.')) : (
                n).toString().substring(0, (n).toString().indexOf('e')))) : ((n).toString().indexOf('.') !== -1) ? this.sumNumerals(+(n * Math.pow(10, (n).toString().length - (n).toString().indexOf('.')))) : (n < 0) ? this.sumNumerals(-n) : (n < 10) ? n : Math.floor(n % 10) + this.sumNumerals(Math.floor(n / 10));
        },

        //Combinatorics

        doubleFact(n) {
            return (checkValueOn('number', n) || n < 0 || this.fraction(n) !== 0) ? erMsg : (n === 0) ? 1 : (n !== 1 && n !== 2) ? n * this.doubleFact(n - 2) : n;
        },

        fact(n) {
            if (checkValueOn('number', n) || n < 0 || this.fraction(n) !== 0) {
                return 'Erorr';
            }
            if (n === Infinity) {
                return n;
            }
            var res = n;
            for (var i = 1; i < n - 1; i++) {
                res *= n - i;
                if (res === Infinity) {
                    break;
                }
            }
            return (n === 0) ? 1 : (res !== Infinity) ? res : ((2 * Math.PI * n) ** 0.5).toFixed(0) + '*' + (n / Math.E).toFixed(0) + '^' + n + '';
        },

        combinations(n, m) {
            return (checkValueOn('number', n, m) || (n === 1 && m !== 1) || (n < 1 && m > 1) || m > n || this.fraction(n) !== 0 || this.fraction(m) !== 0) ? erMsg : +(this.fact(n) / (this.fact(n - m) * this.fact(m))).toFixed(DEFAULT_ACCURACY);
        },

        placements(n, m) {
            return (checkValueOn('number', n, m) || (n === 1 && m !== 1) || (n < 1 && m > 1) || m > n || this.fraction(n) !== 0 || this.fraction(m) !== 0) ? erMsg : +(this.fact(n) / this.fact(n - m)).toFixed(DEFAULT_ACCURACY);
        },

        //Matrices

        matrix: {
            sum(a, b) {
                if (checkValueOn('object', a, b) || !this.checkSize(a, b) || this.checkOnNum(a) || this.checkOnNum(b) || !this.checkColumn(a) || !this.checkColumn(b)) {
                    return erMsg;
                }
                var c = [];
                for (var i = 0; i < a.length; i++) {
                    c[i] = [];
                    for (var j = 0; j < a.length; j++) {
                        c[i][j] = a[i][j] + b[i][j];
                    }
                }
                return c;
            },

            dif(a, b) {
                if (checkValueOn('object', a, b) || !this.checkSize(a, b) || this.checkOnNum(a) || this.checkOnNum(b) || !this.checkColumn(a) || !this.checkColumn(b)) {
                    return erMsg;
                }
                var c = [];
                for (var i = 0; i < a.length; i++) {
                    c[i] = [];
                    for (var j = 0; j < a.length; j++) {
                        c[i][j] = a[i][j] - b[i][j];
                    }
                }
                return c;
            },

            edit(a, n, s) {
                if (checkValueOn('object', a) || checkValueOn('number', n) || checkValueOn('string', s) || !this.checkColumn(a) || checkStringOn('+-*/', s) || s.length > 1) {
                    return erMsg;
                }
                var c = [];
                for (var i = 0; i < a.length; i++) {
                    c[i] = [];
                    for (var j = 0; j < a[0].length; j++) {
                        c[i][j] = a[i][j];
                    }
                }
                if (s === '+') {
                    for (var i = 0; i < c.length; i++) {
                        for (var j = 0; j < c[0].length; j++) {
                            c[i][j] += n;
                        }
                    }
                } else if (s === '-') {
                    for (var i = 0; i < c.length; i++) {
                        for (var j = 0; j < c[0].length; j++) {
                            c[i][j] -= n;
                        }
                    }
                } else if (s === '*') {
                    for (var i = 0; i < c.length; i++) {
                        for (var j = 0; j < c[0].length; j++) {
                            c[i][j] *= n;
                        }
                    }
                } else if (s === '/') {
                    for (var i = 0; i < c.length; i++) {
                        for (var j = 0; j < c[0].length; j++) {
                            c[i][j] /= n;
                        }
                    }
                }
                return c;
            },

            multiply(a, b) {
                if (checkValueOn('object', a, b) || this.checkOnNum(a) || this.checkOnNum(b) || !this.checkOnMultiply(a, b) || !this.checkColumn(a) || !this.checkColumn(b)) {
                    return erMsg;
                }
                var c = [];
                for (var i = 0; i < a.length; i++) {
                    c[i] = [];
                    for (var j = 0; j < b[0].length; j++) {
                        c[i][j] = mm(a, b, i, j);
                    }
                }

                function mm(a, b, q, p) {
                    var result = 0;
                    for (var i = 0; i < a[0].length; i++) {
                        result += a[q][i] * b[i][p];
                    }
                    return result;
                }
                return c;
            },

            transpose(n) {
                if (checkValueOn('object', n) || !this.checkColumn(n)) {
                    return erMsg;
                }
                var c = [];
                for (var i = 0; i < n[0].length; i++) {
                    c[i] = [];
                    for (var j = 0; j < n.length; j++) {
                        c[i][j] = n[j][i];
                    }
                }
                return c;
            },

            determinant(n) {
                if (!this.checkSqr(n) || checkValueOn('object', n) || this.checkOnNum(n)) {
                    return erMsg;
                }
                var N = n.length,
                    B = [],
                    denom = 1,
                    exchanges = 0;
                for (var i = 0; i < N; i++) {
                    B[i] = [];
                    for (var j = 0; j < N; j++) B[i][j] = n[i][j];
                }
                for (var i = 0; i < N - 1; i++) {
                    var maxN = i,
                        maxValue = Math.abs(B[i][i]);
                    for (var j = i + 1; j < N; j++) {
                        var value = Math.abs(B[j][i]);
                        if (value > maxValue) {
                            maxN = j;
                            maxValue = value;
                        }
                    }
                    if (maxN > i) {
                        var temp = B[i];
                        B[i] = B[maxN];
                        B[maxN] = temp;
                        ++exchanges;
                    } else {
                        if (maxValue == 0) return maxValue;
                    }
                    var value1 = B[i][i];
                    for (var j = i + 1; j < N; j++) {
                        var value2 = B[j][i];
                        B[j][i] = 0;
                        for (var k = i + 1; k < N; ++k) B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
                    }
                    denom = value1;
                }
                return (exchanges % 2) ? -B[N - 1][N - 1] : B[N - 1][N - 1];
            },

            minor(n, l, c) {
                if (checkValueOn('number', l, c) || checkValueOn('object', n)) {
                    return erMsg;
                }
                return this.determinant(this.clip(n, l, c));
            },

            alcompl(n, l, c) {
                if (checkValueOn('number', l, c) || checkValueOn('object', n)) {
                    return erMsg;
                }
                return ((l + 1 + c + 1) % 2) ? -this.minor(n, l, c) : this.minor(n, l, c);
            },

            inverse(n, type) {
                if (checkValueOn('object', n) || !this.checkSqr(n) || this.checkOnNum(n)) {
                    return 'Erorr';
                }
                if (!this.determinant(n)) {
                    return false;
                }
                var inm = [],
                    det = this.determinant(n);
                for (var i = 0; i < n.length; i++) {
                    inm[i] = [];
                    for (var j = 0; j < n.length; j++) {
                        inm[i][j] = this.alcompl(n, i, j);
                    }
                }
                inm = this.transpose(inm);
                for (var i = 0; i < n.length; i++) {
                    for (var j = 0; j < n.length; j++) {
                        if (!type) {
                            if (det !== 1 && ~det) {
                                if (inm[i][j] < 0 && det < 0 || inm[i][j] > 0 && det < 0) {
                                    inm[i][j] = -inm[i][j] + '/' + -det;
                                } else if (!inm[i][j]) {
                                    inm[i][j] = '0';
                                } else {
                                    inm[i][j] += '/' + det;
                                }
                            } else if (!(~det)) {
                                inm[i][j] = -inm[i][j];
                            }
                        } else {
                            inm[i][j] /= det;
                        }
                    }
                }
                return inm;
            },

            linearEq(n, f, c) {
                c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
                if (checkValueOn('object', n, f) || checkValueOn('number', c)) {
                    return erMsg;
                }
                if (!this.determinant(n)) {
                    return false;
                }
                var rez = this.multiply(this.inverse(n, 1), f);
                for (var i = 0; i < rez.length; i++) {
                    rez[i] = +(+rez[i]).toFixed(c);
                }
                return rez;
            },

            gauss(n, f, c, p) {
                c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
                if (checkValueOn('object', n, f) || checkValueOn('number', c)) {
                    return erMsg;
                }
                var t = 0,
                    cop,
                    roots = [],
                    nc = this.createClone(n),
                    fc = this.createClone(f);
                for (var i = 0; i < nc.length; i++) {
                    nc[i].push(fc[i][0]);
                }
                // for (var i = 0; i < nc.length; i++) {
                // console.log(nc[i].join(' '));
                // }
                // console.log('\n');
                for (; t < nc.length - 1; t++) {
                    if (nc[t][t] !== 1 && ~nc[t][t]) {
                        for (var i = t + 1; i < nc.length; i++) {
                            if (nc[i][t] === 1 || !~nc[i][t]) {
                                swapStrings(nc, i, t);
                                // console.log(`Меняем местами ${t + 1} и ${i + 1} строки`);
                                // for (var i = 0; i < nc.length; i++) {
                                //     console.log(nc[i].join(' '));
                                // }
                                // console.log('\n');
                                break;
                            } else if (math.nod.apply(math, nc[i]) === nc[i][t]) {
                                // console.log(`Делим строку ${i + 1} на ${nc[i][t]} и меняем местами с ${t + 1} строкой`);
                                edit(nc[i], nc[i][t], '/');
                                swapStrings(nc, i, t);
                                // for (var i = 0; i < nc.length; i++) {
                                //     console.log(nc[i].join(' '));
                                // }
                                // console.log('\n');
                                break;
                            }
                        }
                    }
                    for (var i = t + 1; i < nc.length; i++) {
                        if (nc[i][t]) {
                            if (nc[t][t] !== -nc[i][t]) {
                                cop = this.createClone(nc[t]);
                                // console.log(`Умножаем строку ${t + 1} на ${-(nc[i][t] / nc[t][t])} и складываем с ${i+1} строкой`);
                                edit(cop, -(nc[i][t] / nc[t][t]), '*');
                                nc[i] = sum(nc[i], cop);
                            } else {
                                // console.log(`Строку ${t + 1} складываем с ${i+1} строкой`);
                                nc[i] = sum(nc[i], nc[t]);
                            }
                        }
                    }
                    // for (var i = 0; i < nc.length; i++) {
                    // console.log(nc[i].join(' '));
                    // }
                    // console.log('\n');
                }
                roots.push(+(nc[nc.length - 1][nc[0].length - 1] / nc[nc.length - 1][nc[0].length - 2]).toFixed(c));
                for (var i = nc.length - 2; i >= 0; i--) {
                    roots.push(+((nc[i][nc[0].length - 1] - rt(nc[i].slice(i + 1, nc[0].length - 1))) / nc[i][i]).toFixed(c));
                }

                function rt(arr) {
                    var sum = 0;
                    for (var i = 0; i < arr.length; i++) {
                        arr[i] = arr[i] * roots[roots.length - 1 - i];
                        sum += arr[i];
                    }
                    return sum;
                }

                function sum(arr1, arr2) {
                    var a = [];
                    for (var i = 0; i < arr1.length; i++) {
                        a[i] = +(arr1[i] + arr2[i]).toFixed(c);
                    }
                    return a;
                }

                function edit(arr, n, op) {
                    if (op === '/') {
                        for (var i = 0; i < arr.length; i++) {
                            if (n) {
                                arr[i] /= n;
                            }
                        }
                    } else if (op === '*') {
                        for (var i = 0; i < arr.length; i++) {
                            arr[i] *= n;
                        }
                    }
                }

                function swapStrings(arr, s1, s2) {
                    var c = arr[s2];
                    arr[s2] = arr[s1];
                    arr[s1] = c;
                }
                return p ? {
                    matrix: nc,
                    roots: roots.reverse()
                } : roots.reverse();
            },

            createClone(n) {
                var clone = [];
                for (var i = 0; i < n.length; i++) {
                    if (typeof n[i] === 'object') {
                        clone[i] = this.createClone(n[i]);
                    } else {
                        clone[i] = n[i];
                    }
                }
                return clone;
            },

            clip(n, a, b) {
                var d = [];
                for (var i = 0; i < n.length; i++) {
                    d[i] = [];
                    for (var j = 0; j < n.length; j++) {
                        d[i][j] = n[i][j];
                    }
                }
                d.splice(a, 1);
                for (var i = 0; i < d.length; i++) {
                    d[i].splice(b, 1);
                }
                return d;
            },

            checkSqr(n) {
                if (checkValueOn('object', n)) {
                    return erMsg;
                }
                var counter = 0;
                for (var i = 0; i < n.length; i++) {
                    if (n[i].length === n.length) {
                        counter++;
                    }
                }
                if (counter === n.length) {
                    return true;
                }
                return false;
            },

            checkSize(a, b) {
                if (checkValueOn('object', a, b) || this.checkOnNum(a) || this.checkOnNum(b)) {
                    return erMsg;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i].length !== b[i].length) {
                        return false;
                    }
                }
                return true;
            },

            checkColumn(n) {
                if (checkValueOn('object', n)) {
                    return erMsg;
                }
                for (var i = 0; i < n.length; i++) {
                    for (var j = 0; j < n.length; j++) {
                        if (n[i].length !== n[j].length) {
                            return false;
                        }
                    }
                }
                return true;
            },

            checkOnNum(n) {
                if (checkValueOn('object', n)) {
                    return erMsg;
                }
                for (var i = 0; i < n.length; i++) {
                    for (var j = 0; j < n[i].length; j++) {
                        if (checkValueOn('number', n[i][j])) {
                            return true;
                        }
                    }
                }
                return false;
            },

            checkOnMultiply(a, b) {
                if (checkValueOn('object', a, b)) {
                    return erMsg;
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i].length !== b.length) {
                        return false;
                    }
                }
                return true;
            },

        },

        //sort

        Qsort(A) {
            if (typeof A !== 'object') {
                return erMsg;
            }
            if (A.length === 0) {
                return [];
            }
            var a = [],
                b = [],
                p = A[Math.floor(A.length / 2)];
            for (var i = 0; i < A.length; i++) {
                if (i !== Math.floor(A.length / 2)) {
                    if (A[i] < p) {
                        a[a.length] = A[i];
                    } else {
                        b[b.length] = A[i];
                    }
                }
            }
            return this.Qsort(a).concat(p, this.Qsort(b));
        },

        JSsort(a) {
            if (typeof a !== 'object') {
                return erMsg;
            }

            function sort(a, b) {
                return a - b;
            }
            return a.sort(sort);
        },

        // number systems

        decToAny(n, b, c) {
            if (!n || n === 1) {
                return '' + n;
            }
            if (n === Infinity || n === -Infinity) {
                return n;
            }
            if (n < 0) {
                return '-' + this.decToAny(-n, b, c);
            }
            c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            b = b || 10;
            if (checkValueOn('number', n, b, c) || b < 2) {
                return erMsg;
            }
            if (b <= 36) {
                var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                if (this.fraction(n) === 0) {
                    var num = [];
                    while (n >= 1) {
                        num[num.length] = numbers[n % b];
                        n = Math.floor(n / b);
                    }
                    return num.reverse().join('');
                } else {
                    var fr = this.fraction(n),
                        num = (Math.floor(n) === 0) ? [0] : [];
                    n = Math.floor(n);
                    while (n >= 1) {
                        num[num.length] = n % b;
                        n = Math.floor(n / b);
                    }
                    return num.reverse().join('') + this.decFracToAny(fr, b, c).substring(1);
                }
            } else {
                if (this.fraction(n) === 0) {
                    var num = [];
                    while (n >= 1) {
                        num[num.length] = n % b + ' ';
                        n = Math.floor(n / b);
                    }
                    num[0] = num[0].slice(0, num[0].length - 1);
                    return num.reverse().join('');
                } else {
                    var fr = this.fraction(n),
                        num = (Math.floor(n) === 0) ? [0] : [];
                    n = Math.floor(n);
                    num = this.decToAny(n, b, c);
                    return num + this.decFracToAny(fr, b, c).substring(1);
                }
            }
        },

        anyToDec(n, b, c) {
            if (n === Infinity || n === -Infinity) {
                return n;
            }
            if (n.indexOf('-') !== -1) {
                return -this.anyToDec(n.substring(1), b);
            }
            c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            if (checkValueOn('string', n) || checkValueOn('number', b) || b < 2) {
                return erMsg;
            }
            var dec = 0,
                frac;
            if (b <= 36) {
                var number = {
                    '0': 0,
                    '1': 1,
                    '2': 2,
                    '3': 3,
                    '4': 4,
                    '5': 5,
                    '6': 6,
                    '7': 7,
                    '8': 8,
                    '9': 9,
                    'A': 10,
                    'B': 11,
                    'C': 12,
                    'D': 13,
                    'E': 14,
                    'F': 15,
                    'G': 16,
                    'H': 17,
                    'I': 18,
                    'J': 19,
                    'K': 20,
                    'L': 21,
                    'M': 22,
                    'N': 23,
                    'O': 24,
                    'P': 25,
                    'Q': 26,
                    'R': 27,
                    'S': 28,
                    'T': 29,
                    'U': 30,
                    'V': 31,
                    'W': 32,
                    'X': 33,
                    'Y': 34,
                    'Z': 35
                };
                if (n.indexOf('.') !== -1) {
                    frac = n.substring(n.indexOf('.') + 1);
                    n = n.substring(0, n.indexOf('.'));
                    for (var i = 0; i < frac.length; i++) {
                        if ((frac).charAt(i) !== '0') {
                            dec += number[(frac).charAt(i)] * Math.pow(b, -i - 1);
                        }
                    }
                }
                n = n.split('').reverse().join('');
                for (var i = 0; i < n.length; i++) {
                    if ((n).charAt(i) !== '0') {
                        dec += number[(n).charAt(i)] * Math.pow(b, i);
                    }
                }
            } else {
                if (n.indexOf('.') !== -1) {
                    frac = n.substring(n.indexOf('.') + 1);
                    n = n.substring(0, n.indexOf('.'));
                    frac = frac.split(' ');
                    for (var i = 0; i < frac.length; i++) {
                        if (frac[i] !== '0') {
                            dec += frac[i] * Math.pow(b, -i - 1);
                        }
                    }
                }
                n = n.split(' ').reverse();
                for (var i = 0; i < n.length; i++) {
                    if (n[i] !== '0') {
                        dec += n[i] * Math.pow(b, i);
                    }
                }
            }
            return +(dec).toFixed(c);
        },

        anyToAny(n, b1, b2, c) {
            c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            if (checkValueOn('string', n) || checkValueOn('number', b1, b2, c) || b1 < 2 || b2 < 2) {
                return erMsg;
            }
            return this.decToAny(this.anyToDec(n, b1, c), b2, c);
        },

        opWithNums(n1, b1, n2, b2, operation, b3, c) {
            c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            if (checkValueOn('string', n1, n2, operation) || checkValueOn('number', b1, b2, b3, c) || checkStringOn('+-*/%d', operation) || operation.length > 2) {
                return erMsg;
            }
            if (operation === '+') {
                return this.decToAny(this.anyToDec(n1, b1, c) + this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === '-') {
                return this.decToAny(this.anyToDec(n1, b1, c) - this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === '*') {
                return this.decToAny(this.anyToDec(n1, b1, c) * this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === '/') {
                return this.decToAny(this.anyToDec(n1, b1, c) / this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === '**') {
                return this.decToAny(this.anyToDec(n1, b1, c) ** this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === '%') {
                return this.decToAny(this.anyToDec(n1, b1, c) % this.anyToDec(n2, b2, c), b3, c);
            } else if (operation === 'd') {
                return this.decToAny(Math.floor(this.anyToDec(n1, b1, c) / this.anyToDec(n2, b2, c)), b3, c);
            } else {
                return erMsg;
            }
        },

        decFracToAny(n, b, c) {
            if (!n) {
                return '' + n;
            }
            if (n < 0) {
                return '-' + this.decFracToAny(-n, b, c);
            }
            c = (c === 0) ? 0 : c || DEFAULT_ACCURACY;
            if (checkValueOn('number', n, c, b) || Math.floor(n) !== 0 || b < 2) {
                return erMsg;
            }
            var frac = '0.';
            if (b <= 36) {
                var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                for (i = 0; i < c; i++) {
                    frac += numbers[Math.floor(n * b)];
                    n = this.fraction(n * b);
                    if (n === 0) {
                        break;
                    }
                }
            } else {
                for (i = 0; i < c; i++) {
                    frac += Math.floor(n * b) + ' ';
                    n = this.fraction(n * b);
                    if (n === 0) {
                        break;
                    }
                }
                frac = frac.slice(0, frac.length - 1);
            }
            return frac;
        },

        bigNum: {
            sum(a, b) {
                if (checkValueOn('string', a, b) || checkStringOn('-.0123456789', a + b)) {
                    return erMsg;
                }
                if (~a.indexOf('-') && !~b.indexOf('-')) {
                    return this.dif(b, a.slice(1));
                } else if (!~a.indexOf('-') && ~b.indexOf('-')) {
                    return this.dif(a, b.slice(1));
                } else if (~a.indexOf('-') && ~b.indexOf('-')) {
                    return '-' + this.sum(a.slice(1), b.slice(1));
                }
                if (a.length < b.length) {
                    return this.sum(b, a);
                }
                var t = {},
                    shift,
                    num = [];
                shift = a.length - b.length;
                for (var i = a.length - 1; i >= 0; i--) {
                    if (!b[i - shift]) {
                        if (+a[i] + (t[i] ? +t[i] : 0) < 10) {
                            num[num.length] = +a[i] + (t[i] ? +t[i] : 0);
                        } else {
                            num[num.length] = (+a[i] + (t[i] ? +t[i] : 0)) % 10;
                            t[i - 1] = (+a[i] + (t[i] ? +t[i] : 0)).toString()[0];
                        }
                    } else if (+a[i] + +b[i - shift] + (t[i] ? +t[i] : 0) < 10) {
                        num[num.length] = +a[i] + +b[i - shift] + (t[i] ? +t[i] : 0);
                    } else {
                        num[num.length] = (+a[i] + +b[i - shift] + (t[i] ? +t[i] : 0)) % 10;
                        t[i - 1] = (+a[i] + +b[i - shift] + (t[i] ? +t[i] : 0)).toString()[0];
                    }
                }
                if (t[-1]) {
                    num[num.length] = t[-1];
                }
                return num.reverse().join('').replace(/^0+/, '');
            },
            dif(a, b) {
                if (checkValueOn('string', a, b) || checkStringOn('-.0123456789', a + b)) {
                    return erMsg;
                }
                if (a === b) {
                    return '0';
                }
                if (~a.indexOf('-') && !~b.indexOf('-')) {
                    return '-' + this.sum(b, a.slice(1));
                } else if (!~a.indexOf('-') && ~b.indexOf('-')) {
                    return this.sum(a, b.slice(1));
                } else if (~a.indexOf('-') && ~b.indexOf('-')) {
                    return this.dif(b.slice(1), a.slice(1));
                }
                if (!this.compare(a, b)) {
                    return '-' + this.dif(b, a);
                }
                var shift, s,
                    num = [];
                if (a.length < b.length) {
                    s = b;
                    b = a;
                    a = s;
                }
                a = a.split('');
                b = b.split('');
                shift = a.length - b.length;
                for (var i = a.length - 1; i >= 0; i--) {
                    if (!b[i - shift]) {
                        if (!(~a[i])) {
                            num[num.length] = +a[i] + 10;
                            a[i - 1] = +a[i - 1] - 1;
                        } else {
                            num[num.length] = +a[i];
                        }
                    } else if (+a[i] - +b[i - shift] >= 0) {
                        num[num.length] = +a[i] - +b[i - shift];
                    } else {
                        num[num.length] = +a[i] + 10 - +b[i - shift];
                        a[i - 1] = +a[i - 1] - 1;
                    }
                }
                return num.reverse().join('').replace(/^0+/, '');
            },
            mul(a, b) {
                if (checkValueOn('string', a, b) || checkStringOn('-.0123456789', a + b)) {
                    return erMsg;
                }

                function mulOnDig(a, b, n) {
                    var r = [],
                        t = {};
                    a = a.split('');
                    for (var i = a.length - 1; i >= 0; i--) {
                        if (a[i] * b + (t[i] ? t[i] : 0) < 10) {
                            r[r.length] = a[i] * b + (t[i] ? t[i] : 0);
                        } else {
                            r[r.length] = (a[i] * b + (t[i] ? t[i] : 0)) % 10;
                            t[i - 1] = +(a[i] * b + (t[i] ? t[i] : 0)).toString()[0];
                        }
                    }
                    if (t[-1]) {
                        r[r.length] = t[-1];
                    }

                    function addZero() {
                        var str = '';
                        for (var i = 0; i < n; i++) {
                            str += '0';
                        }
                        return str;
                    }
                    return r.reverse().join('') + addZero();
                }
                var q = [],
                    r = '0';
                for (var i = b.length - 1; i >= 0; i--) {
                    q[q.length] = mulOnDig(a, +b[i], b.length - 1 - i);
                    r = this.sum(r, q[q.length - 1]);
                }
                return r;
            },
            compare(a, b) {
                if (checkValueOn('string', a, b) || checkStringOn('-.0123456789', a + b)) {
                    return erMsg;
                }
                if (a === b || b.length > a.length) {
                    return false;
                }
                if (a.length > b.length) {
                    return true;
                }
                for (var i = 0; i < a.length; i++) {
                    if (+a[i] > +b[i]) {
                        return true;
                    } else if (+a[i] < +b[i]) {
                        return false;
                    }
                }
            },
        },

        //Service methods

        fraction(n, c) {
            c = c || (((n).toString().indexOf('.') === -1) ? 0 : (n).toString().length - 1 - (n).toString().indexOf('.'));
            return (checkValueOn('number', n, c)) ? erMsg : (n === Infinity || n === -Infinity) ? 0 : (n > 0) ? +(n % 1).toFixed(c) : +(-n % 1).toFixed(c);
        },

        toString() {
            return 'Math JavaScript Library v' + version + '.';
        },

        valueOf() {
            return version;
        },
    }
    window.math = math;
}();
console.log(math);
