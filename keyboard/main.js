const getElem = id => document.getElementById(id);
const elements = {
    words: getElem(`words`),
    input: getElem(`input`),
    timer: getElem(`timer`),
    refresh: getElem(`refresh`)
}
const maxWidth = elements.words.offsetWidth;
const maxLen = maxWidth / 1.5;
let lenOfTrain = 60000;
let lenStr = `00:${(lenOfTrain / 1000).toFixed(0).padStart(2, '0')}`;
const words = ['перед', 'уже', 'ответить', 'этот', 'сейчас', 'весь', 'или', 'между', 'лишь', 'случай', 'нога', 'твой', 'совсем', 'вот', 'хотеть', 'такой', 'год', 'без', 'увидеть', 'сразу', 'война', 'сделать', 'есть', 'более', 'снова', 'остаться', 'голос', 'после', 'ну', 'сам', 'там', 'раз', 'тот', 'вы', 'наш', 'просто', 'день', 'место', 'что', 'мой', 'дать', 'город', 'здесь', 'главный', 'делать', 'во', 'сидеть', 'рука', 'земля', 'мы', 'нет', 'стол', 'со', 'опять', 'ничто', 'человек', 'куда', 'к', 'спросить', 'стоять', 'сказать', 'дверь', 'казаться', 'чем', 'страна', 'по', 'хотя', 'сила', 'да', 'тоже', 'стать', 'очень', 'быть', 'дом', 'от', 'подумать', 'под', 'деньги', 'который', 'ведь', 'пока', 'так', 'они', 'какой', 'работать', 'ночь', 'оказаться', 'думать', 'старый', 'но', 'при', 'из', 'потому', 'взять', 'кто', 'только', 'ли', 'новый', 'голова', 'говорить', 'где', 'смотреть', 'работа', 'хорошо', 'вода', 'слово', 'для', 'конечный', 'свет', 'всегда', 'последний', 'значить', 'почему', 'вдруг', 'правда', 'еще', 'минута', 'теперь', 'она', 'вид', 'сторона', 'с', 'ряд', 'до', 'я', 'о'];

let state;

const getLine = n => {
    let curWidth = 0;
    while (curWidth < maxLen) {
        const word = document.createElement(`span`);
        word.className = 'sp';
        word.innerHTML = [...words[Math.random() * words.length ^ 0]].map(e => `<span class="letter">${e}</span>`).join('');
        elements.words.appendChild(word);
        curWidth += word.offsetWidth;
        if (curWidth > maxLen) {
            elements.words.removeChild(word);
        } else {
            state.lines[n].push(word);
        }
    }
};

const init = () => {
    elements.words.innerHTML = '';
    elements.input.value = '';
    elements.timer.textContent = lenStr;
    state = {
        inTaining: false,
        lines: [
            [],
            []
        ],
        currentWord: 0,
        keystrokes: 0,
        spaces: 0,
        wordsLen: 0,
    };
    for (let i = 0; i < 2; i++) {
        getLine(i);
        if (!i) {
            elements.words.appendChild(document.createElement(`br`));
        }
    }
    state.lines[0][0].style.backgroundColor = '#DDDDDD';
};

init();

const timer = () => {
    elements.timer.textContent = `00:${((state.endPoint - performance.now()) / 1000).toFixed(0).padStart(2, '0')}`;
};

const endTrain = () => {
    clearInterval(state.id);
    init();
};

elements.refresh.addEventListener('click', endTrain);

const keydown = e => {
    if (!state.inTaining) {
        state.inTaining = true;
        state.startingPoint = performance.now();
        state.endPoint = state.startingPoint + lenOfTrain;
        state.id = setInterval(timer, 100);
        setTimeout(() => {
            console.log(state);
            endTrain();
        }, lenOfTrain);
    }
    if (e.key == ' ') {
        const curInpValue = elements.input.value;
        const curWord = state.lines[0][state.currentWord].textContent;
        const style = state.lines[0][state.currentWord].style;
        style.backgroundColor = 'white';
        if (curInpValue.slice(0, -1) == curWord) {
            style.color = 'green';
        } else {
            style.color = 'red';
        }
        state.currentWord++;
        if (state.currentWord >= state.lines[0].length) {
            for (let i = 0; i < state.lines[0].length; i++) {
                elements.words.removeChild(state.lines[0][i]);
            }
            elements.words.removeChild(elements.words.getElementsByTagName('br')[0]);
            state.lines[0] = state.lines[1];
            state.lines[1] = [];
            state.currentWord = 0;
            elements.words.appendChild(document.createElement('br'));
            getLine(1);
        }
        state.lines[0][state.currentWord].style.backgroundColor = '#DDDDDD';
        state.spaces++;
        state.keystrokes++;
        elements.input.value = '';
    } else {
        const curInpValue = elements.input.value;
        const curWord = state.lines[0][state.currentWord].textContent;
        const letters = state.lines[0][state.currentWord].getElementsByClassName('letter');
        for (let i = 0; i < curWord.length; i++) {
            if (curInpValue.length > i) {
                if (curInpValue[i] == curWord[i]) {
                    letters[i].style.color = 'green';
                } else {
                    letters[i].style.color = 'red';
                }
            } else {
                letters[i].style.color = 'inherit';
            }
        }
        state.keystrokes++;
    }
};

elements.input.addEventListener(`keyup`, keydown);