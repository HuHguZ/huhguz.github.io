window.addEventListener(`load`, () => {
    let getElem = id => document.getElementById(id),
        nextGameStep = (function() {
            return requestAnimationFrame ||
                mozRequestAnimationFrame ||
                webkitRequestAnimationFrame ||
                oRequestAnimationFrame ||
                msRequestAnimationFrame;
        })(),
        canvas = getElem(`canvas`), // Канвас
        ctx = canvas.getContext(`2d`), // Контекст
        w = canvas.width = window.innerWidth, // Ширина канваса
        h = canvas.height = window.innerHeight; // Высота канваса


    let r1 = 200,
        r2 = 200,
        m1 = 40,
        m2 = 40,
        a1 = Math.random() * 180 / 180 * Math.PI,
        a2 = Math.random() * 180 / 180 * Math.PI,
        a1_v = 0,
        a2_v = 0,
        a1_a = 0,
        a2_a = 0,
        bx = w / 2,
        by = h / 2,
        g = 1,
        x1, y1, x2, y2;
    game();

    ctx.lineWidth = 5;

    function game() {
        ctx.clearRect(0, 0, w, h);
        x1 = r1 * Math.sin(a1);
        y1 = r1 * Math.cos(a1);
        x2 = bx + x1 + r2 * Math.sin(a2);
        y2 = by + y1 + r2 * Math.cos(a2);
        let den = 2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2);


        a1_a = (-g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(a1 - a2) * m2 * (a2_v ** 2 * r2 + a1_v ** 2 * r1 * Math.cos(a1 - a2))) / (r1 * den);
        a2_a = (2 * Math.sin(a1 - a2) * (a1_v ** 2 * r1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + a2_v ** 2 * r2 * m2 * Math.cos(a1 - a2))) / (r2 * den);

        a1_v += a1_a;
        a2_v += a2_a;

        a1 += a1_v;
        a2 += a2_v;

        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + x1, by + y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(bx + x1, by + y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `red`;
        ctx.arc(bx + x1, by + y1, m1, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `red`;
        ctx.arc(x2, y2, m2, 0, Math.PI * 2, true);
        ctx.fill();
        nextGameStep(game);
    }
});