window.addEventListener('load', function() {
	let js = document.getElementById('js'), 
	vbs = document.getElementById('vbs'), 
	convert = document.getElementById('convert'),
	alphabet = {
		'а': 'f',
		'б': ',',
		'в': 'd',
		'г': 'u',
		'д': 'l',
		'е': 't',
		'ё': '`',
		'ж': ';',
		'з': 'p',
		'и': 'b',
		'й': 'q',
		'к': 'r',
		'л': 'k',
		'м': 'v',
		'н': 'y',
		'о': 'j',
		'п': 'g',
		'р': 'h',
		'с': 'c',
		'т': 'n',
		'у': 'e',
		'ф': 'a',
		'х': '[',
		'ц': 'w',
		'ч': 'x',
		'ш': 'i',
		'щ': 'o',
		'ъ': ']',
		'ы': 's',
		'ь': 'm',
		'э': '\'',
		'ю': '.',
		'я': 'z',
	},
	res = `Set wshell = CreateObject("WScript.Shell")
Dim delay
delay = 1
Sub t(symbol, del)
	wshell.SendKeys(symbol)
	WScript.Sleep del
End Sub
WScript.Sleep 1500`,
	reg = /[а-яё]+/gi,
	result = res;
	vbs.value = result;
	convert.addEventListener('click', function() {
		if (js.value) {
			let ret, posb = [], pose = [];
			while (ret = reg.exec(js.value)) {
				// words.push(ret[0]);
				posb.push(ret.index);
				pose.push(reg.lastIndex);
				// wordsLength.push(reg.lastIndex - res.index);
			}
			for (let i = 0; i < pose.length; i++) {
				if (pose[i] + 1 == posb[i + 1] && js.value[pose[i]].match(/[\s.,!?]/)) {
					// words[i] += js.value[pose[i]] + words[i + 1];
					// words.splice(i + 1, 1);
					posb.splice(i + 1, 1);
					pose.splice(i, 1);
					i--;
				}
			}
			for (let i = 0; i < js.value.length; i++) {
				if (~posb.indexOf(i) || ~pose.indexOf(i)) {
					result += `\nt "+(%)", delay`;
				}
				if (js.value[i] == '{') {
					result += `\nt "+([)", delay`;
				} else if (js.value[i] == '}') {
					result += `\nt "+(])", delay`;
				} else if (js.value[i] == '(') {
					result += `\nt "+(9)", delay`;
				} else if (js.value[i] == ')') {
					result += `\nt "+(0)", delay`;
				} else if (js.value[i] == '\n') {
					result += `\nt "~", delay`;
					result += `\nt "+({TAB 10})", delay`;
				} else if (js.value[i] == '"') {
					result += `\nt "+(')", delay`;
				} else if (js.value[i] == '+') {
					result += `\nt "+(=)", delay`;
				} else if (js.value[i] == '_') {
					result += `\nt "+(-)", delay`;
				} else if (js.value[i] == '~') {
					result += `\nt "+(\`)", delay`;
				} else if (js.value[i] == '%') {
					result += `\nt "+(5)", delay`;
				} else if (js.value[i] == '^') {
					result += `\nt "+(6)", delay`;
				} else if (js.value[i] == '№') {
					result += `\nt "+(%)", delay`;
					result += `\nt "+(3)", delay`;
					result += `\nt "+(%)", delay`;
				} else if (js.value[i].match(/[а-яё]/)) {
					// result += `\nt "+(%)", delay`;
					result += `\nt "${alphabet[js.value[i]]}", delay`;
					// result += `\nt "+(%)", delay`;
				} else if (js.value[i].match(/[А-ЯЁ]/)) {
					// result += `\nt "+(%)", delay`;
					result += `\nt "+(${alphabet[js.value[i].toLowerCase()]})", delay`;
					// result += `\nt "+(%)", delay`;
				} else {
					result += `\nt "${js.value[i]}", delay`;
				}
			}
			vbs.value = result;
			result = res;
		}
	});
});