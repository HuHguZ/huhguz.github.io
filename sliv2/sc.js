window.addEventListener('load', () => {
    let getElem = id => document.getElementById(id),
        content = getElem(`content`),
        run = getElem(`run`),
        list = getElem(`list`);
    run.addEventListener(`click`, () => {
        let elements = content.value.split(/\s/);
        for (let i = 0; i < elements.length; i += 2) {
            let audio = new Audio();
            audio.src = elements[i];
            audio.controls = true;
            let li = document.createElement('li');
            li.appendChild(audio);
            li.innerHTML += `<br>${elements[i + 1]}`;
            list.appendChild(li);
        }
    });
});