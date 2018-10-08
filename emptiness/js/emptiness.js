window.addEventListener(`load`, () => {
    let getElem = el => document.getElementById(el),
        data = getElem(`data`),
        out = getElem(`out`),
        encode = getElem(`encode`),
        decode = getElem(`decode`),
        symbols = [
            8204, // нулевой бит
            8203, // единичный бит
        ],
        separator = 8205;  // разделитель двоичных цифр
    encode.addEventListener(`click`, () => { //Шифруем и копируем в буффер обмена
        let r = ``,
            sep = String.fromCharCode(separator);
        for (let i = 0; i < data.value.length; i++) {
            r += `${data.value[i].charCodeAt(0).toString(2).split(``).map(e => String.fromCharCode(symbols[+e])).join(``)}${i == data.value.length - 1 ? `` : sep}`;
        }
        out.value = r || `Нечего зашифровывать`;
        if (r) {
            out.select();
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    });
    decode.addEventListener(`click`, () => {
        let r = ``,
            syms = out.value.split(String.fromCharCode(separator));
        for (let i = 0; i < syms.length; i++) {
            r += String.fromCharCode(parseInt(syms[i].split(``).map(e => e.charCodeAt(0) == symbols[1] ? `1` : `0`).join(``), 2));
        }
        data.value = r || `Нечего расшифровывать`;
        if (r) {
            data.select();
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        }
    });
});