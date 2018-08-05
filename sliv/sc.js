window.addEventListener('load', () => {
    let getElem = id => document.getElementById(id),
    content = getElem(`content`),
    run = getElem(`run`),
    list = getElem(`list`);
    run.addEventListener(`click`, () => {
        let elements = content.value.split(/\s/);
        for (let i = 0; i < elements.length; i += 2) {
            let img = new Image();
            img.src = elements[i];
            // img.onload = () => {
                let li = document.createElement('li');
                li.appendChild(img);
                li.innerHTML += `<br>${elements[i + 1]}`;
                list.appendChild(li);
            // };
        }
    });
});