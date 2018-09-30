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
        tablex2 = [3.84, 5.99, 7.82, 9.49, 11.07, 12.59, 14.07, 15.51, 16.92, 18.31, 19.68, 21, 22.4, 23.7, 25, 26.3, 27.6, 28.9, 30.1, 31.4, 32.7, 33.9, 35.2, 36.4, 37.7, 38.9, 40.1, 41.3, 42.6, 43.8], //p = 0.05
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
                t3 = [`<table class="t"><tr><td>Интервалы<br><b>X<sub>i</sub>;X<sub>i+1</sub></b></td><td>Частота<br><b>m<sub>i</sub></b></td><td><b>Z<sub>i</sub> = (X<sub>i</sub>-X<sub>в</sub>)/σ<sub>в</sub></b></td><td><b>Z<sub>i+1</sub> = (X<sub>i+1</sub>-X<sub>в</sub>)/σ<sub>в</sub></b></td><td><b>Ф(Z<sub>i</sub>)</b></td><td><b>Ф(Z<sub>i+1</sub>)</b></td><td><b>P<sub>i</sub></b></td><td><b>nP<sub>i</sub></b></td><td><b>χ<sup>2</sup></b></td></tr>`, ``, `</table>`],
                grps = [min], //χ
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
            res += `<table class="t"><tr><td>Выборочная средняя <b>X<sub>в</sub></b></td><td>Выборочная дисперсия <b>σ<sup>2</sup><sub>в</sub></b></td><td>Выборочное среднеквадратическое отклонение <b>σ<sub>в</sub></b></td><td>Исправленная выборочная дисперсия <b>σ<sup>2</sup><sub>в испр.</sub></b></td><td>Исправленное выборочное среднеквадратическое отклонение <b>σ<sub>в испр.</sub></b></td></tr><tr><td>${xv.toFixed(acc)}</td><td>${vd.toFixed(acc)}</td><td>${vsd.toFixed(acc)}</td><td>${ivd.toFixed(acc)}</td><td>${ivso.toFixed(acc)}</td></tr></table><p class="h">Доверительный интервал</p>J<sub>β</sub> = (X<sub>в</sub>-t<sub>β</sub>∙(σ<sub>в</sub>/√n);X<sub>в</sub>+t<sub>β</sub>∙(σ<sub>в</sub>/√n))<br>J<sub>β</sub> = (${(xv - t * vsd / l ** 0.5).toFixed(acc)};${(xv + t * vsd / l ** 0.5).toFixed(acc)})<br><br>`;
            let x2sum = 0;
            for (let i = 0; i < frequencies.length; i++) {
                let s = `<span style="font-family:Verdana;font-size:12px">∞</span>`,
                    zi = (grps[i] - xv) / vsd,
                    zi1 = (grps[i + 1] - xv) / vsd,
                    fzi = !i ? -.5 : getErf(zi),
                    fzi1 = i == frequencies.length - 1 ? 0.5 : getErf(zi1),
                    pi = fzi1 - fzi,
                    npi = l * pi,
                    x2 = (frequencies[i] - npi) ** 2 / npi;
                x2sum += x2;
                t3[1] += `<tr><td>${grps[i].toFixed(acc)}-${grps[i + 1].toFixed(acc)}</td><td>${frequencies[i]}</td><td>${!i ? `-${s}` : zi.toFixed(acc)}</td><td>${i == frequencies.length - 1 ? `+${s}` : zi1.toFixed(acc)}</td><td>${fzi.toFixed(acc)}</td><td>${fzi1.toFixed(acc)}</td><td>${pi.toFixed(acc)}</td><td>${npi.toFixed(acc)}</td><td>${x2.toFixed(acc)}</td></tr>`;
            }
            let k = frequencies.length - 1 - 2,
                x2c = tablex2[k - 1];
            res += t3.join(``) + `χ<sup>2</sup> = ${x2sum.toFixed(acc)}<br>Вычисляем число степеней свободы K = S - 1 - r, где<br>S - число интервалов<br>r - число параметров распределения<br>S = ${frequencies.length}<br>r = 2<br>K = ${frequencies.length} - 1 - 2 = ${k}<br>Имя число степеней свободы K = ${k} и задавшись уровнем значимости q = 5%, находим χ<sup>2</sup> критическое (табличное).<br>χ<sup>2</sup><sub>${k};0.05</sub> = ${x2c}<br>χ<sup>2</sup> наблюдаемое ${x2sum < x2c ? `<` : `>`} χ<sup>2</sup> критическое - гипотеза ${x2sum < x2c ? `принимается` : `отвергается`}.`;
            return {
                txtData: res.replace(/(\d)\./g, `$1,`),
                data: {grps}
            };
        },
        f = () => {
            let d1 = new Function(``, data.value)(),
                d2 = new Function(``, data2.value)(),
                acc = +accuracy.value, s,
                r1 = calc(d1),
                r2 = calc(d2),
                field = [],
                correlationField = [`<table class="t"><tr><td rowspan="3"><b>X</b></td><td rowspan="3"><b>X<sub>i</sub></b></td><td colspan="${(r2.data.grps.length - 1) * 2 + 1}"><b>Y</b></td></tr><tr>`, ``, `<td rowspan="2">fix</td></tr><tr>`, ``, `</tr>`, ``, `</table>`];
            localStorage.setItem(`d1`, data.value);
            localStorage.setItem(`d2`, data2.value);
            if (d1.length == d2.length) {
                for (let i = 0; i < r2.data.grps.length - 1; i++) {
                    correlationField[1] += `<td>${r2.data.grps[i].toFixed(acc)}</td><td>${r2.data.grps[i + 1].toFixed(acc)}</td>`;
                    correlationField[3] += `<td colspan="2">${((r2.data.grps[i] + r2.data.grps[i + 1]) / 2).toFixed(acc)}</td>`;
                }
                for (let i = 0; i < r1.data.grps.length - 1; i++) {
                    field[i] = [];
                }
                for (let i = 0; i < d1.length; i++) {
                    let p1, p2;
                    for (let j = 0; j < r1.data.grps.length - 1; j++) {
                        if (d1[i] >= r1.data.grps[j] && d1[i] < r1.data.grps[j + 1] || (j == r1.data.grps.length - 2 && d1[i] >= r1.data.grps[j + 1])) {
                            p1 = j;
                            break;
                        }
                    }
                    for (let j = 0; j < r2.data.grps.length - 1; j++) {
                        if (d2[i] >= r2.data.grps[j] && d2[i] < r2.data.grps[j + 1] || (j == r2.data.grps.length - 2 && d2[i] >= r2.data.grps[j + 1])) {
                            p2 = j;
                            break;
                        }
                    }
                    field[p1][p2] = ++field[p1][p2] || 1;
                }
                let ygs = [],
                    xgs = [];
                for (let i = 0; i < r1.data.grps.length - 1; i++) {
                    correlationField[5] += `<tr><td>${r1.data.grps[i].toFixed(acc)}-${r1.data.grps[i + 1].toFixed(acc)}</td><td>${((r1.data.grps[i] + r1.data.grps[i + 1]) / 2).toFixed(acc)}</td>`;
                    for (let j = 0; j < r2.data.grps.length - 1; j++) {
                        correlationField[5] += `<td colspan="2">${field[i][j] || ``}</td>`;
                        ygs[j] = (ygs[j] + field[i][j]) || ygs[j] || field[i][j] || 0;
                        xgs[i] = (xgs[i] + field[i][j]) || xgs[i] || field[i][j] || 0;
                    }
                    correlationField[5] += `<td>${xgs[i]}</td></tr>`;
                }
                correlationField[5] += `<tr><td>fiy</td><td></td>`;
                for (let i = 0; i < r2.data.grps.length - 1; i++) {
                    correlationField[5] += `<td colspan="2">${ygs[i]}</td>`; 
                }
                correlationField[5] += `<td>${d1.length}</td></tr>`;
            } else {
                correlationField = [`<b>Error</b>: Обе выборочных совокупности должны иметь одинаковое количество чисел, чтобы построить поле корреляции. (У вас в первой совокупности ${d1.length} чисел и ${d2.length} чисел во второй)`];
            }
            s = `${r1.txtData}<br><br>${r2.txtData}<p class="h">Поле корреляции</p>${correlationField.join(``)}`;
            out.innerHTML = s;
            if (showInitialData.checked) {
                if (d1.length == d2.length) {
                    d1.sort((a, b) => a - b);
                    d2.sort((a, b) => a - b);
                    let table = [`<table class="t"><tr><td><b>№</b></td><td><b>x</b></td><td><b>y</b></td><td><b>x^2</b></td><td><b>y^2</b></td><td><b>x∙y</b></td></tr>`, ``, `</table>`];
                    for (let i = 0; i < d1.length; i++) {
                        table[1] += `<tr><td>${i + 1}</td><td>${d1[i].toFixed(acc)}</td><td>${d2[i].toFixed(acc)}</td><td>${(d1[i] ** 2).toFixed(acc)}</td><td>${(d2[i] ** 2).toFixed(acc)}</td><td>${(d1[i] * d2[i]).toFixed(acc)}</td></tr>`;
                    }
                    input.innerHTML = table.join(``).replace(/(\d)\./g, `$1,`);
                } else {
                    input.innerHTML = `<b>Error</b>: Обе выборочных совокупности должны иметь одинаковое количество чисел, чтобы построить таблицу входных данных. (У вас в первой совокупности ${d1.length} чисел и ${d2.length} чисел во второй)`;
                }
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