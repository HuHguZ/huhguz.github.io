﻿window.addEventListener('load', function() {
    var canvas = getElem('canvas'), // Канвас
        ctx = canvas.getContext('2d'), // Контекст
        elements = {
            graph: getElem('graph'),
            mn: getElem('main'),
            dist1: getElem('dist1'),
            dist2: getElem('dist2'),
            fntsize: getElem('fntsize'),
            maxX: getElem('maxX'),
            GraphLineThickness: getElem('GraphLineThickness'),
            ThicknessOfAxesLines: getElem('ThicknessOfAxesLines'),
            interval: getElem('interval'),
            graphColor: getElem('graphColor'),
            upd: getElem('upd'),
            rndclr: getElem('rndclr'),
            accuracy: getElem('accuracy'),
            graph2: getElem('graph2'),
            on: getElem('on')
        },
        graphics = [],
        fl = false,
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        in1 = w / 2,
        y, t,
        dist = 50,
        size = 4,
        accuracy = 2,
        fntsize = 12,
        k = 1,
        xc = Math.floor(w / dist),
        func,
        yc = Math.floor(h / dist),
        d1 = (w / 2 - Math.floor(xc / 2) * dist) - ((Math.floor(xc / 2) + 1) * dist - w / 2),
        d2 = (h / 2 - Math.floor(yc / 2) * dist) - ((Math.floor(yc / 2) + 1) * dist - h / 2),
        maxX = +(k * (xc * dist - w / 2 + d1)).toFixed(accuracy),
        interval = 0.002,
        thickness1 = 1;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'red';
    elements.graph.value = 'Math.sin(x)';
    ctx.fillStyle = 'red';
    showElem(elements.mn);
    elements.dist1.value = dist;
    elements.dist2.value = size;
    elements.fntsize.value = fntsize;
    elements.maxX.value = maxX;
    elements.GraphLineThickness.value = thickness1;
    elements.ThicknessOfAxesLines.value = ctx.lineWidth;
    elements.interval.value = interval;
    elements.graphColor.value = ctx.fillStyle;
    elements.accuracy.value = accuracy;

    function log(a, b, c = 3) {
        return a === 0 && b === 0 || a === 1 || a < 0 || b < 0 ? 0 : +(Math.log(b) / Math.log(a)).toFixed(accuracy);
    }

    function getElem(el) {
        return document.getElementById(el);
    }

    function showElem(e) {
        e.style.opacity = 1;
        e.style.transform = 'scale(1, 1)';
    }

    function hideElem(e) {
        e.style.opacity = 0;
        e.style.transform = 'scale(0, 0)';
    }

    function getRndColor() {
        var a, b = "#",
            color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (var i = 1; i <= 6; i++) {
            a = Math.random() * color.length ^ 0;
            b += color[a];
        }
        return b;
    }

    function clear() {
        ctx.clearRect(0, 0, w, h);
        drawAxis();
        graphics = [];
    }
    document.addEventListener('keypress', function(e) {
        if (e.key.match(/[rк]/i)) {
            clear();
        } else if (e.key.match(/[eу]/i) && fl) {
            fl = !fl;
            showElem(elements.mn);
        }
    });
    document.addEventListener('mousedown', function(e) {
        try {
            if (fl) {
                for (var i = 0; i < graphics.length; i++) {
                    if (graphics[i].complexFunction) {
                        continue;
                    }
                    var x = (e.clientX - w / 2),
                        y = -(graphics[i].func(k * x));
                    ctx.beginPath();
                    ctx.textAlign = 'left';
                    ctx.fillStyle = getRndColor();
                    ctx.arc(w / 2 + x, h / 2 + (1 / k * y), thickness1 + 3, 0, Math.PI * 2);
                    ctx.fillText(`(${+(k * x).toFixed(accuracy)}; ${+((-y)).toFixed(accuracy)})`, w / 2 + x + fntsize, h / 2 + (1 / k * y));
                    ctx.fill();
                }
            }
        } catch (e) {
            alert('С вашей функцией что-то не так! Попробуйте ввести ещё раз и повторите попытку.');
        }
    });
    getElem('ok').addEventListener('click', function() {
        fl = !fl;
        hideElem(elements.mn);
        if (elements.upd.checked) {
            dist = +elements.dist1.value;
            xc = Math.floor(w / dist);
            yc = Math.floor(h / dist);
            size = +elements.dist2.value;
            fntsize = +elements.fntsize.value;
            k = +elements.maxX.value / maxX;
            thickness1 = +elements.GraphLineThickness.value;
            ctx.lineWidth = +elements.ThicknessOfAxesLines.value;
            interval = +elements.interval.value;
            accuracy = +elements.accuracy.value;
            clear();
            graphics = [];
        }
        if (elements.rndclr.checked) {
            ctx.fillStyle = getRndColor();
            elements.graphColor.value = ctx.fillStyle;
        } else {
            ctx.fillStyle = elements.graphColor.value;
        }
        graphics.push({
            func: new Function('x', 'return ' + elements.graph.value + ';'),
            x: -w / 2,
            fillStyle: ctx.fillStyle,
            complexFunction: elements.on.checked
        });
        graphics[graphics.length - 1].func2 = graphics[graphics.length - 1].complexFunction ? new Function('y', 'return ' + elements.graph2.value + ';') : false;
    });

    function drawAxis() {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold ' + fntsize + 'px Verdana';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        var tmp1;
        for (var i = 0; i < xc + 1; i++) {
            tmp1 = i * dist;
            if (i < (Math.floor(xc / 2) + 1)) {
                ctx.moveTo(tmp1, h / 2 - size);
                ctx.lineTo(tmp1, h / 2 + size);
                ctx.fillText(+(k * (tmp1 - w / 2)).toFixed(accuracy), tmp1, h / 2 - fntsize - size);
            } else {
                ctx.moveTo(tmp1 + d1, h / 2 - size);
                ctx.lineTo(tmp1 + d1, h / 2 + size);
                ctx.fillText(+(k * (tmp1 + d1 - w / 2)).toFixed(accuracy), tmp1 + d1, h / 2 - fntsize - size);
            }
        }
        for (var i = 0; i < yc + 3; i++) {
            tmp1 = i * dist;
            if (i < (Math.floor(yc / 2) + 1)) {
                ctx.moveTo(w / 2 - size, tmp1);
                ctx.lineTo(w / 2 + size, tmp1);
                ctx.fillText(-(k * (tmp1 - h / 2)).toFixed(accuracy), w / 2 + size + 1.5 * fntsize, tmp1);
            } else {
                ctx.moveTo(w / 2 - size, tmp1 + d2);
                ctx.lineTo(w / 2 + size, tmp1 + d2);
                ctx.fillText(-(k * (tmp1 + d2 - h / 2)).toFixed(accuracy), w / 2 + size + 1.5 * fntsize, tmp1 + d2);
            }

        }
        ctx.moveTo(w, h / 2);
        ctx.lineTo(w - 2 * size, h / 2 - 2 * size);
        ctx.moveTo(w, h / 2);
        ctx.lineTo(w - 2 * size, h / 2 + 2 * size);
        ctx.fillText('x', w - fntsize / 2, h / 2 + fntsize);
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2 - 2 * size, 2 * size);
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2 + 2 * size, 2 * size);
        ctx.fillText('y', w / 2 - fntsize, fntsize / 2);
        ctx.stroke();
    }
    drawAxis();
    var x = -w / 2;

    function draw() {
        try {
            for (var j = 0; j < graphics.length; j++) {
                if (graphics[j].ready) {
                    continue;
                }
                if (!graphics[j].complexFunction) {
                    if (graphics[j].x < w / 2) {
                        ctx.fillStyle = graphics[j].fillStyle;
                        for (var i = 0; i < 1e3; i++) {
                            t = k * graphics[j].x;
                            y = -(graphics[j].func(t));
                            ctx.beginPath();
                            ctx.arc(graphics[j].x + w / 2, h / 2 + (1 / k * y), thickness1, 0, Math.PI * 2);
                            ctx.fill();
                            graphics[j].x += interval;
                        }
                    } else {
                        graphics[j].ready = true;
                    }
                } else {
                    if (graphics[j].x < w / 2) {
                        ctx.fillStyle = graphics[j].fillStyle;
                        for (var i = 0; i < 1e3; i++) {
                            t = k * graphics[j].x;
                            y = -(graphics[j].func(t));
                            var st = graphics[j].func2(t);
                            ctx.beginPath();
                            ctx.arc(1 / k * st + w / 2, h / 2 + (1 / k * y), thickness1, 0, Math.PI * 2);
                            ctx.fill();
                            graphics[j].x += interval;
                        }
                    } else {
                        graphics[j].ready = true;
                    }
                }
            }
        } catch (e) {}
        nextGameStep(draw);
    }
    var nextGameStep = (function() {
        return requestAnimationFrame ||
            mozRequestAnimationFrame ||
            webkitRequestAnimationFrame ||
            oRequestAnimationFrame ||
            msRequestAnimationFrame;﻿
    })();
    draw();
});