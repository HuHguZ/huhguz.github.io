window.addEventListener('load', () => {
    let getElem = el => document.getElementById(el),
        data = getElem(`data`),
        groups = getElem(`groups`),
        start = getElem(`start`),
        accuracy = getElem(`accuracy`),
        out = getElem(`out`),
        input = getElem(`input`),
        checkValue = num => function() {
            this.value = +this.value <= num ? num : this.value;
        },
        calc = () => {
            let dt = new Function(``, data.value)(),
                grpscount = +groups.value,
                acc = +accuracy.value,
                min = Math.min(...dt),
                max = Math.max(...dt),
                grps = [min],
                h = (max - min) / grpscount,
                res = `min = ${min}<br>max = ${max}<br>h = ${h.toFixed(acc)}<br>`;
            for (let i = 1; i <= grpscount; i++) {
                grps[i] = grps[i - 1] + h;
            }

            for (let i = 0; i <= grpscount; i++) {
                grps[i] = grps[i].toFixed(acc);
            }
            for (let i = 0; i < grpscount; i++) {
                res += `Группа ${i + 1}: ${grps[i]}-${grps[i + 1]}<br>`;
            }
            out.innerHTML = res;
            let s = `Исходные данные с индексами<br>`;
            for (let i = 0; i < dt.length; i++) {
                s += `${i + 1}: ${dt[i]}<br>`
            }
            input.innerHTML = s;
        };
    calc();
    start.addEventListener(`click`, calc);
    groups.addEventListener(`input`, checkValue(1));
    accuracy.addEventListener(`input`, checkValue(0));
});