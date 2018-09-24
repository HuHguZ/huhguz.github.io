window.addEventListener('load', () => {
    let getElem = el => document.getElementById(el),
        data = getElem(`data`),
        data2 = getElem(`data2`),
        groups = getElem(`groups`),
        start = getElem(`start`),
        accuracy = getElem(`accuracy`),
        minobs = getElem(`minobs`),
        out = getElem(`out`),
        input = getElem(`input`),
        showInitialData = getElem(`showInitialData`),
        checkValue = num => function() {
            this.value = +this.value <= num ? num : this.value;
        },
        findMin = arr => {
            let min = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < min) {
                    min = arr[i];
                }
            }
            return min;
        },
        findMax = arr => {
            let max = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] > max) {
                    max = arr[i];
                }
            }
            return max;
        },
        getErf = x => .5 * math.erf(x / 2 ** 0.5),
        calc = data => {
            let grpscount = +groups.value,
                acc = +accuracy.value,
                minbs = +minobs.value,
                min = findMin(data),
                max = findMax(data),
                frequencies = [],
                tableOfFrequencies = [`<table class="t"><tr><td><b>X<sub>i</sub></b></td>`, ``, `</tr><tr><td>Частота <b>n<sub>i</sub></b></td>`, ``, `</tr></table><br>`],
                tableOfFullFrequencies = [`<table class="t"><tr><td><b>X<sub>i</sub></b></td>`, ``, `</tr><tr><td>Частота <b>f<sub>i</sub></b></td>`, ``, `</tr><tr><td>Относительная частота <b>w = f<sub>i</sub>/n</b></td>`, ``, `</tr><tr><td>Плотность относительной частоты <b>w<sub>i</sub>/(X<sub>i+1</sub>-X<sub>i</sub>)</b></td>`, ``, `</tr></table><br>`],
                t3 = [`<table class="t"><tr><td>Интервалы<br><b>X<sub>i</sub>;X<sub>i+1</sub></b></td><td>Частота<br><b>m</b></td><td><b>Z<sub>i</sub> = (X<sub>i</sub>-X<sub>в</sub>)/σ<sub>в</sub></b></td><td><b>Z<sub>i+1</sub> = (X<sub>i+1</sub>-X<sub>в</sub>)/σ<sub>в</sub></b></td><td><b>Ф(Z<sub>i</sub>)</b></td><td><b>Ф(Z<sub>i+1</sub>)</b></td><td><b>P<sub>i</sub></b></td><td><b>nP<sub>i</sub></b></td><td></td></tr>`, ``, `</table>`],
                grps = [min],
                integrate = (p1, p2, f) => {
                    frequencies[p1] = (frequencies[p1 - +!!f] || 0) + (frequencies[p2] || 0);
                    frequencies.splice(f ? p1 - 1 : p2, 1);
                    grps.splice(p2, 1);
                },
                h = (max - min) / grpscount,
                l = data.length,
                res = `<b>X<sub>min</sub></b> = ${min}<br><b>X<sub>max</sub></b> = ${max}<br><b>h</b> = ${h.toFixed(acc)}<br><b>n</b> = ${l}<br><br>`;
            for (let i = 1; i <= grpscount; i++) {
                grps[i] = grps[i - 1] + h;
            }
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < grpscount; j++) {
                    if (data[i] >= grps[j] && data[i] < grps[j + 1] || (j == grpscount - 1 && data[i] >= grps[j + 1])) {
                        frequencies[j] = ++frequencies[j] || 1;
                        break;
                    }
                }
            }
            for (let i = 1; i <= grpscount; i++) {
                tableOfFrequencies[1] += `<td>${grps[i - 1].toFixed(acc)}-${grps[i].toFixed(acc)}</td>`;
                tableOfFrequencies[3] += `<td>${frequencies[i - 1] || 0}</td>`;
            }
            res += tableOfFrequencies.join(``);
            for (let i = 0; i < frequencies.length; i++) {
                for (let j = i + 1; j < frequencies.length; j++) {
                    if ((frequencies[i] || 0) < minbs) {
                        integrate(i, j--);
                        if (frequencies[j] < minbs && j == frequencies.length - 1) {
                            integrate(i, j, 1);
                        }
                    } else {
                        if (j == frequencies.length - 1 && frequencies[j] < minbs) {
                            integrate(i, j);
                        }
                        break;
                    }
                }
            }
            for (let i = 0; i < frequencies.length; i++) {
                let relativeFrequency = frequencies[i] / l,
                    relativeFrequencyDensity = relativeFrequency / (grps[i + 1] - grps[i]);
                tableOfFullFrequencies[1] += `<td>${grps[i].toFixed(acc)}-${grps[i + 1].toFixed(acc)}</td>`;
                tableOfFullFrequencies[3] += `<td>${frequencies[i]}</td>`;
                tableOfFullFrequencies[5] += `<td>${relativeFrequency.toFixed(acc)}</td>`;
                tableOfFullFrequencies[7] += `<td>${relativeFrequencyDensity.toFixed(acc)}</td>`;
            }
            res += tableOfFullFrequencies.join(``);
            let xv = data.reduce((sum, e) => sum + e) / l,
                vd = data.reduce((sum, e) => sum + e ** 2, 0) / l - xv ** 2,
                vsd = vd ** 0.5,
                ivd = l / (l - 1) * vd,
                ivso = ivd ** 0.5,
                t = 2;
            res += `<table class="t"><tr><td>Выборочная средняя <b>X<sub>в</sub></b></td><td>Выборочная дисперсия <b>σ<sup>2</sup><sub>в</sub></b></td><td>Выборочное среднеквадратическое отклонение <b>σ<sub>в</sub></b></td><td>Исправленная выборочная дисперсия <b>σ<sup>2</sup><sub>в испр.</sub></b></td><td>Исправленное выборочное среднеквадратическое отклонение <b>σ<sub>в испр.</sub></b></td></tr><tr><td>${xv.toFixed(acc)}</td><td>${vd.toFixed(acc)}</td><td>${vsd.toFixed(acc)}</td><td>${ivd.toFixed(acc)}</td><td>${ivso.toFixed(acc)}</td></tr></table><p class="h">Доверительный интервал</p>J<sub>β</sub> = (X<sub>в</sub>-t<sub>β</sub>*(σ<sub>в</sub>/√n);X<sub>в</sub>+t<sub>β</sub>*(σ<sub>в</sub>/√n))<br>J<sub>β</sub> = (${(xv - t * vsd / l ** 0.5).toFixed(acc)};${(xv + t * vsd / l ** 0.5).toFixed(acc)})<br><br>`;
            for (let i = 0; i < frequencies.length; i++) {
                let s = `<span style="font-family:Verdana;font-size:12px">∞</span>`,
                    zi = (grps[i] - xv) / vsd,
                    zi1 = (grps[i + 1] - xv) / vsd,
                    fzi = !i ? -.5 : getErf(zi),
                    fzi1 = i == frequencies.length - 1 ? 0.5 : getErf(zi1),
                    pi = fzi1 - fzi,
                    npi = l * pi;
                t3[1] += `<tr><td>${grps[i].toFixed(acc)}-${grps[i + 1].toFixed(acc)}</td><td>${frequencies[i]}</td><td>${!i ? `-${s}` : zi.toFixed(acc)}</td><td>${i == frequencies.length - 1 ? `+${s}` : zi1.toFixed(acc)}</td><td>${fzi.toFixed(acc)}</td><td>${fzi1.toFixed(acc)}</td><td>${pi.toFixed(acc)}</td><td>${npi.toFixed(acc)}</td><td>?</td></tr>`;
            }
            res += t3.join(``);
            return res.replace(/(\d)\./g, `$1,`);
        },
        f = () => {
            let d1 = new Function(``, data.value)(),
                d2 = new Function(``, data2.value)(),
                acc = +accuracy.value;
            localStorage.setItem(`d1`, data.value);
            localStorage.setItem(`d2`, data2.value);
            let r = calc(d1);
            r += `<br><br>${calc(d2)}`;
            out.innerHTML = r;
            if (showInitialData.checked && d1.length == d2.length) {
                let table = [`<table class="t"><tr><td><b>№</b></td><td><b>x</b></td><td><b>x^2</b></td><td><b>y</b></td><td><b>y^2</b></td></tr>`, ``, `</table>`];
                for (let i = 0; i < d1.length; i++) {
                    table[1] += `<tr><td>${i + 1}</td><td>${d1[i].toFixed(acc)}</td><td>${(d1[i] ** 2).toFixed(acc)}</td><td>${d2[i].toFixed(acc)}</td><td>${(d2[i] ** 2).toFixed(acc)}</td></tr>`;
                }
                input.innerHTML = table.join(``);
            } else {
                input.innerHTML = ``;
            }
        };
    let d1 = localStorage.getItem(`d1`),
        d2 = localStorage.getItem(`d2`);
    if (d1 && d2) {
        data.value = d1;
        data2.value = d2;
    }
    f();
    start.addEventListener(`click`, f);
    groups.addEventListener(`input`, checkValue(1));
    accuracy.addEventListener(`input`, checkValue(0));
    minobs.addEventListener(`input`, checkValue(1));
});