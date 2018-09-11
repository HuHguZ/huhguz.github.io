window.addEventListener('load', () => {
    let getElem = el => document.getElementById(el),
        data = getElem(`data`),
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
        calc = () => {
            let dt = new Function(``, data.value)(),
                grpscount = +groups.value,
                acc = +accuracy.value,
                minbs = +minobs.value,
                min = findMin(dt),
                max = findMax(dt),
                frequencies = [],
                tableOfFrequencies = [`<table class="t"><tr><td>X<sub>i</sub></td>`, ``, `</tr><tr><td>Частота</td>`, ``, `</tr></table><br>`],
                tableOfFullFrequencies = [`<table class="t"><tr><td>X<sub>i</sub></td>`, ``, `</tr><tr><td>Частота</td>`, ``, `</tr><tr><td>Относительная частота</td>`, ``, `</tr><tr><td>Плотность относительной частоты</td>`, ``, `</tr></table><br>`], //1 3 5 7
                grps = [min],
                integrate = (p1, p2, f) => {
                    frequencies[p1] = (frequencies[p1 - +!!f] || 0) + (frequencies[p2] || 0);
                    frequencies.splice(f ? p1 - 1 : p2, 1);
                    grps.splice(p2, 1);
                },
                h = (max - min) / grpscount,
                l = dt.length,
                res = `min = ${min}<br>max = ${max}<br>h = ${h.toFixed(acc)}<br>Всего чисел: ${l}`;
            for (let i = 1; i <= grpscount; i++) {
                grps[i] = grps[i - 1] + h;
            }
            for (let i = 0; i < dt.length; i++) {
                for (let j = 0; j < grpscount; j++) {
                    if (dt[i] >= grps[j] && dt[i] < grps[j + 1] || (j == grpscount - 1 && dt[i] >= grps[j + 1])) {
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
            let xv = dt.reduce((sum, e) => sum + e) / l,
                vd = dt.reduce((sum, e) => sum + e ** 2, 0) / l - xv ** 2,
                vsd = vd ** 0.5,
                ivd = l / (l - 1) * vd,
                ivso = ivd ** 0.5;
            res += `<table class="t"><tr><td>Выборочная средняя X<sub>в</sub></td><td>Выборочная дисперсия</td><td>Выборочное среднеквадратическое отклонение</td><td>Исправленная выборочная дисперсия</td><td>Исправленное выборочное среднеквадратическое отклонение</td></tr><tr><td>${xv.toFixed(acc)}</td><td>${vd.toFixed(acc)}</td><td>${vsd.toFixed(acc)}</td><td>${ivd.toFixed(acc)}</td><td>${ivso.toFixed(acc)}</td></tr></table>`;
            out.innerHTML = res.replace(/\./g, `,`);
            let s = `Исходные данные с индексами<br>`;
            for (let i = 0; i < dt.length; i++) {
                s += `${i + 1}: ${dt[i]}<br>`
            }
            if (showInitialData.checked) {
                input.innerHTML = s.replace(/\./g, `,`);
            } else {
                input.innerHTML = ``;
            }
        };
    calc();
    start.addEventListener(`click`, calc);
    groups.addEventListener(`input`, checkValue(1));
    accuracy.addEventListener(`input`, checkValue(0));
    minobs.addEventListener(`input`, checkValue(1));
});