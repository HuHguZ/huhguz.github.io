
window.addEventListener('load', function() {
    var canvas = getElem('canvas'), // Канвас
        ctx = canvas.getContext('2d'), // Контекст
        cns = getElem('skin'),
        ctx2 = cns.getContext('2d'),
        w = canvas.width = window.innerWidth, // Ширина канваса
        h = canvas.height = window.innerHeight, // Высота санваса
        balls = [], // Массив для хранения мячей
        blocks = [], // Массив для хранения блоков
        you = 0, // Номер текущего мяча
        skinAngle = 0, //угол поворота скина в меню настроек
        setgs = false, // Для настроек
        ballsCount = 1, // Количество мячей
        mouse = {}, // Объект координат, скорости мыши
        images = [], // Массив изображений
        screenX = window.screenX, //Координаты верхнего угла окна браузера
        screenY = window.screenY, //Координаты верхнего угла окна браузера
        uploaded = false, //Загружены или нет все изображения мячей
        loadCount = 0, //Кол-во загруженных изображений
        totalCount = 78, //Общее кол-во изображений
        handlers = [function(obj) { // Массив обработчиков для проверки состояния мяча (на земле или в воздухе). Важно, т.к. без этого мяч будет бесконечно биться о землю
            return obj.position.y >= h - obj.r - 1;
        }, function(obj) {
            return obj.position.y <= obj.r + 1;
        }, function(obj) {
            return obj.position.x <= obj.r + 1;
        }, function(obj) {
            return obj.position.x >= w - obj.r - 1;
        }],
        world = {
            gravity: new Vector2(0, 0.4), // Гравитация
            deceleration: new Vector2(0.08, 0.08), // Сила трения и сопротивления воздуха
            loss: 0.95, // Потеря скорости при ударе об стены
            collisionLoss: 0.97, // Потеря при соударении мячей
            checkCoords(obj) {
                if (obj.position.x >= w - obj.r) {
                    obj.velocity.x *= -1;
                    obj.position.x = w - obj.r;
                    this.lose(obj);
                } else if (obj.position.x <= obj.r) {
                    obj.velocity.x *= -1;
                    obj.position.x = obj.r;
                    this.lose(obj);
                }
                if (obj.position.y >= h - obj.r) {
                    obj.velocity.y *= -1;
                    obj.position.y = h - obj.r;
                    this.lose(obj);
                } else if (obj.position.y <= obj.r) {
                    obj.velocity.y *= -1;
                    obj.position.y = obj.r;
                    this.lose(obj);
                }
                var a = Math.abs((obj.gravity.x + obj.gravity.y) / 2 + (obj.deceleration.x + obj.deceleration.y) / 2);
                obj.velocity.x = Math.abs(obj.velocity.x) <= a ? 0 : obj.velocity.x;
                obj.velocity.y = Math.abs(obj.velocity.y) <= a ? 0 : obj.velocity.y;
                return this;
            },
            addGravity(obj) {
                if (obj.canCallHand) {
                    obj.onGround = handlers[obj.numHand](obj);
                }
                if (!obj.onGround) {
                    obj.velocity.add(obj.gravity);
                }
                return this;
            },
            resistance(obj) {
                obj.velocity.add((() => {
                    var xml, yml;
                    if (obj.velocity.x < 0) {
                        xml = 1;
                    } else {
                        xml = -1;
                    }
                    if (obj.velocity.y < 0) {
                        yml = 1;
                    } else {
                        yml = -1;
                    }
                    return {
                        x: xml * obj.deceleration.x,
                        y: yml * obj.deceleration.y,
                        __proto__: Vector2.prototype
                    };
                })());
                return this;
            },
            resolveCollision(ball, otherball) {
                var xVelocityDiff = ball.velocity.x - otherball.velocity.x,
                    yVelocityDiff = ball.velocity.y - otherball.velocity.y,
                    xDist = otherball.position.x - ball.position.x,
                    yDist = otherball.position.y - ball.position.y;
                if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
                    var angle = -Math.atan2(yDist, xDist),
                        m1 = ball.mass,
                        m2 = otherball.mass,
                        u1 = this.rotate(ball.velocity, angle),
                        u2 = this.rotate(otherball.velocity, angle),
                        v1 = {
                            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
                            y: u1.y
                        },
                        v2 = {
                            x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2),
                            y: u2.y
                        },
                        vFinal1 = this.rotate(v1, -angle),
                        vFinal2 = this.rotate(v2, -angle);
                    ball.velocity.x = this.collisionLoss * vFinal1.x;
                    ball.velocity.y = this.collisionLoss * vFinal1.y;
                    otherball.velocity.x = this.collisionLoss * vFinal2.x;
                    otherball.velocity.y = this.collisionLoss * vFinal2.y;
                }
                return this;
            },
            rotate(velocity, angle) {
                return {
                    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
                    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
                };
            },
            collisionWithBall(obj1, obj2) {
                if (getDistance(obj1.position.x, obj1.position.y, obj2.position.x, obj2.position.y) <= obj1.r + obj2.r) {
                    this.resolveCollision(obj1, obj2);
                }
                return this;
            },
            collisionDetWithBlock(block, ball) {
                var DeltaX = ball.position.x - Math.max(block.x, Math.min(ball.position.x, block.x + block.w)),
                    DeltaY = ball.position.y - Math.max(block.y, Math.min(ball.position.y, block.y + block.h));
                return (DeltaX * DeltaX + DeltaY * DeltaY) < (ball.r * ball.r);
            },
            collisionWithBlock(block, ball) {
                if (this.collisionDetWithBlock(block, ball)) {
                    if (ball.position.y <= block.y) {
                        ball.position.y = block.y - ball.r;
                        ball.velocity.y *= -1;
                        this.lose(ball);
                    } else if (ball.position.x <= block.x) {
                        ball.position.x = block.x - ball.r;
                        ball.velocity.x *= -1;
                        this.lose(ball);
                    } else if (ball.position.x >= block.x + block.w) {
                        ball.position.x = block.x + block.w + ball.r;
                        ball.velocity.x *= -1;
                        this.lose(ball);
                    } else if (ball.position.y >= block.y + block.h) {
                        ball.position.y = block.y + block.h + ball.r;
                        ball.velocity.y *= -1;
                        this.lose(ball);
                    }
                }
                return this;
            },
            lose(obj) {
                obj.velocity.mult(obj.loss);
                return this;
            }
        },
        progressBar = new Block(w / 2 - 250, h / 2 - 50, 500, 50, '#000000'),
        elements = {
            r: getElem('r'),
            mass: getElem('mass'),
            x: getElem('x'),
            y: getElem('y'),
            xspeed: getElem('xspeed'),
            yspeed: getElem('yspeed'),
            gravity: getElem('gravity'),
            deceleration: getElem('deceleration'),
            loss: getElem('loss'),
            you: getElem('you'),
            balls: getElem('balls'),
            settings: getElem('settings'),
            chgimg: getElem('chgimg')
        },
        buttons = document.getElementsByClassName('forAll'),
        properties = [
            'img',
            'r',
            'mass',
            {
                fp: 'position',
                sp: 'x'
            },
            {
                fp: 'position',
                sp: 'y'
            },
            {
                fp: 'velocity',
                sp: 'x'
            },
            {
                fp: 'velocity',
                sp: 'y'
            },
            {
                fp: 'gravity',
                sp: 'x',
                tp: 'y'
            },
            {
                fp: 'deceleration',
                sp: 'x',
                tp: 'y'
            },
            'loss'
        ];
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = buttonsHandlers(i);
    }
    elements.you.oninput = function() {
        you = +this.value < 0 ? (this.value = 0, 0) : +this.value > balls.length - 1 ? (this.value = balls.length - 1, balls.length - 1) : +this.value;
        updateInfo();
    }
    elements.chgimg.oninput = function() {
        if (balls[you] && isNumeric(parseFloat(this.value))) {
            balls[you].img = images[+this.value < 0 ? (this.value = 0, 0) : +this.value > images.length - 1 ? (this.value = images.length - 1, images.length - 1) : +this.value];
        }
    }
    cns.width = 120;
    cns.height = 120;
    progressBar.textColor = generateRndcolor();
    for (var i = 0; i <= totalCount; i++) {
        var img = new Image();
        img.src = `resources/ball${i}.png`;
        img.onload = function() {
            loadCount++;
            if (loadCount === totalCount + 1) {
                uploaded = !uploaded;
            }
            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = progressBar.color;
            ctx.stroke();
            ctx.strokeRect(progressBar.x - ctx.lineWidth / 2, progressBar.y - ctx.lineWidth / 2, progressBar.w + ctx.lineWidth, progressBar.h + ctx.lineWidth);
            ctx.fillStyle = 'rgb(255, 161, 0)';
            ctx.fillRect(progressBar.x, progressBar.y, progressBar.w * (loadCount / (totalCount + 1)), progressBar.h);
            ctx.fillStyle = 'rgb(255, 161, 0)';
            ctx.textAlign = "center";
            ctx.font = "normal 25px Verdana";
            ctx.fillText(`Загрузка: ${(100 * loadCount / (totalCount + 1)).toFixed(3)}%`, w / 2, h / 2 + 30 + ctx.lineWidth);
            ctx.closePath();
        }
        images.push(img);
    }
    for (var i = 0; i < ballsCount; i++) { //Добавляем мячи
        addBall();
    }

    function addBall() {
        var rnd = [(Math.random() * 2 ^ 0) ? 1 : -1, (Math.random() * 2 ^ 0) ? 1 : -1],
            r = Math.random() * 15 + 10 ^ 0,
            ball = new Ball(new Vector2(isNumeric(arguments[0]) ? arguments[0] : Math.random() * w, isNumeric(arguments[1]) ? arguments[1] : Math.random() * h), r, generateRndcolor(), new Vector2(rnd[0] * Math.random() * 10, rnd[1] * Math.random() * 10), r);
        if (arguments.length) {
            balls.push(ball);
        } else {
            balls.push(generateNewBall(ball));
        }
    }

    function generateNewBall(b) {
        for (var i = 0; i < balls.length; i++) {
            if (b === balls[i]) {
                continue;
            }
            if (getDistance(b.position.x, b.position.y, balls[i].position.x, balls[i].position.y) < b.r + balls[i].r) {
                b.position.x = Math.random() * w;
                b.position.r = Math.random() * h;
            }
        }
        return b;
    }

    function Ball(position, r, color, velocity, mass) {
        this.position = position;
        this.r = r;
        this.color = color;
        this.velocity = velocity;
        this.mass = mass;
        this.gravity = new Vector2(world.gravity.x, world.gravity.y);
        this.numHand = 0;
        this.deceleration = new Vector2(world.deceleration.x, world.deceleration.y);
        this.loss = world.loss;
        this.canCallHand = true;
        this.angle = 0;
        this.canMove = true;
        this.img = images[Math.random() * images.length ^ 0];
    }

    Ball.prototype.draw = function() {
        if (this.canMove) {
            this.angle += this.velocity.x + this.velocity.y;
        }
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, -this.r, -this.r, this.r * 2, this.r * 2);
        ctx.restore();
        ctx.closePath();
    }

    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector2.prototype.add = function(Vector2) {
        this.x += Vector2.x;
        this.y += Vector2.y;
    }
    Vector2.prototype.mult = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    Vector2.prototype.toString = function() {
        return `${this.x};${this.y}`;
    }

    function Block(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    Block.prototype.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    function generateRndcolor() {
        var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
            b = "#";
        for (var i = 1; i <= 6; i++) {
            b += a[Math.random() * a.length ^ 0];
        }
        return b;
    }

    function buttonsHandlers(num) {
        return function() {
            var values = [
                isNumeric(+elements.chgimg.value) ? images[+elements.chgimg.value] : balls[you].img ? balls[you].img : images[Math.random() * images.length ^ 0],
                isNumeric(parseFloat(elements.r.value)) ? +elements.r.value : Math.random() * 100 ^ 0,
                isNumeric(parseFloat(elements.mass.value)) ? +elements.mass.value : Math.random() * 100 ^ 0,
                {
                    sp: isNumeric(parseFloat(elements.x.value)) ? +elements.x.value : Math.random() * w ^ 0
                },
                {
                    sp: isNumeric(parseFloat(elements.y.value)) ? +elements.y.value : Math.random() * h ^ 0
                },
                {
                    sp: isNumeric(parseFloat(elements.xspeed.value)) ? +elements.xspeed.value : Math.random() * 20 ^ 0
                },
                {
                    sp: isNumeric(parseFloat(elements.yspeed.value)) ? +elements.yspeed.value : Math.random() * 20 ^ 0
                },
                {
                    get sp() {
                        var gx = +elements.gravity.value.match(/[\d.-]+/)[0];
                        return isNumeric(gx) ? gx : world.gravity.x;
                    },
                    get tp() {
                        gy = +elements.gravity.value.match(/[\d.-]+/g)[1];
                        return isNumeric(gy) ? gy : world.gravity.y;
                    }
                },
                {
                    get sp() {
                        var dcx = +elements.deceleration.value.match(/[\d.-]+/)[0];
                        return isNumeric(dcx) ? dcx : world.deceleration.x;
                    },
                    get tp() {
                        dcy = +elements.deceleration.value.match(/[\d.-]+/g)[1];
                        return isNumeric(dcy) ? dcy : world.deceleration.y;
                    }
                },
                isNumeric(parseFloat(elements.loss.value)) ? +elements.loss.value : world.loss,
            ];
            if (arguments.length) {
                for (var i = 0; i < balls.length; i++) {
                    setProperty(balls[i], properties[num], values[num]);
                }
            } else {
                setProperty(balls[you], properties[num], values[num]);
            }
        }
    }

    function setProperty(obj, prop, value) {
        if (typeof prop === 'string') {
            obj[prop] = value;
        } else {
            for (var p in prop) {
                if (p == 'fp') {
                    continue;
                }
                obj[prop['fp']][prop[p]] = value[p];
                if (prop['fp'] === 'gravity') {
                    checkGravity(obj);
                }
            }
        }
    }

    function getDistance(x1, y1, x2, y2) {
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    }

    function getElem(id) {
        return document.getElementById(id);
    }
    getElem('ok').onclick = function() {
        hideElem(getElem('guide'));
    }

    function updateInfo() {
        elements.you.value = you;
        elements.chgimg.value = images.indexOf(balls[you].img);
        elements.r.value = +(balls[you].r).toFixed(3);
        elements.mass.value = +(balls[you].mass).toFixed(3);
        elements.x.value = +(balls[you].position.x).toFixed(3);
        elements.y.value = +(balls[you].position.y).toFixed(3);
        elements.xspeed.value = +(balls[you].velocity.x).toFixed(3);
        elements.yspeed.value = +(balls[you].velocity.y).toFixed(3);
        elements.gravity.value = balls[you].gravity;
        elements.deceleration.value = balls[you].deceleration;
        elements.loss.value = balls[you].loss;
        elements.balls.value = ballsCount;
    }

    function setInfo() {
        for (var i = 1; i < buttons.length; i++) {
            buttons[i].onclick();
        }
        ballsCount = +elements.balls.value;
        if (ballsCount > balls.length) {
            for (var i = balls.length; i < ballsCount; i++) {
                addBall();
            }
        } else if (ballsCount < balls.length) {
            balls = balls.slice(0, ballsCount < 0 ? (ballsCount = 0, 0) : ballsCount);
        }
    }

    function checkGravity(obj) {
        if ((obj.gravity.x || !obj.gravity.x) && obj.gravity.y > 0) {
            obj.numHand = 0;
        } else if ((obj.gravity.x || !obj.gravity.x) && obj.gravity.y < 0) {
            obj.numHand = 1;
        } else if (obj.gravity.x > 0 && !obj.gravity.y) {
            obj.numHand = 3;
        } else if (obj.gravity.x < 0 && !obj.gravity.y) {
            obj.numHand = 2;
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function showElem(e) {
        e.style.opacity = 1;
        e.style.transform = 'scale(1, 1)';
    }

    function hideElem(e) {
        e.style.opacity = 0;
        e.style.transform = 'scale(0, 0)';
    }
    document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.oncontextmenu = function() {
        return false;
    }
    document.onmousedown = function(e) {
        if (e.which === 1) {
            var m = false;
            mouse.oldX = e.clientX;
            mouse.oldY = e.clientY;
            for (var i = 0; i < balls.length; i++) {
                if (getDistance(balls[i].position.x, balls[i].position.y, mouse.x, mouse.y) <= balls[i].r) {
                    var c = balls[you];
                    balls[you] = balls[i];
                    balls[i] = c;
                    m = true;
                    balls[you].onGround = true;
                    balls[you].canCallHand = false;
                    balls[you].canMove = false;
                    var shiftX = e.clientX - balls[you].position.x,
                        shiftY = e.clientY - balls[you].position.y;
                    updateInfo();
                    break;
                }
            }
            if (m) {
                this.onmousemove = function(e) {
                    var ball = balls[you],
                        x = e.clientX,
                        y = e.clientY;
                    mouse.velocity = new Vector2(x - mouse.oldX, y - mouse.oldY);
                    ball.position = new Vector2(x - shiftX, y - shiftY);
                    ball.velocity = mouse.velocity;
                    mouse.oldX = x;
                    mouse.oldY = y;
                }
                this.onmouseup = function() {
                    this.onmousemove = null;
                    this.onmouseup = null;
                    balls[you].canCallHand = true;
                    balls[you].canMove = true;
                }
            }
        } else {
            for (var i = 0; i < balls.length; i++) {
                if (getDistance(balls[i].position.x, balls[i].position.y, mouse.x, mouse.y) <= balls[i].r) {
                    var c = balls[you];
                    balls[you] = balls[i];
                    balls[i] = c;
                    if (e.which === 3) {
                        balls[you].gravity = new Vector2(0, 0);
                    } else {
                        balls[you].deceleration = new Vector2(0, 0);
                    }
                    updateInfo();
                    break;
                }
            }
        }
    }

    document.addEventListener('wheel', function(e) {
        for (var i = 0; i < balls.length; i++) {
            if (getDistance(balls[i].position.x, balls[i].position.y, mouse.x, mouse.y) <= balls[i].r) {
                balls[i].r += e.deltaY < 0 ? -1 : 1;
                balls[i].mass += e.deltaY < 0 ? -1 : 1;
            }
        }
    });

    document.addEventListener('keypress', function(event) {
        var key = event.key;
        if (key === 'e' || key === 'E' || key === 'у' || key === 'У') {
            // blocks.push(new Block(world.x, world.y, 10, 10, generateRndcolor()));
            balls = [];
            for (var i = 1; i <= ballsCount; i++) {
                addBall();
            }
        } else if ((key === '+' || key === '=') && !setgs) {
            ballsCount++;
            addBall(mouse.x, mouse.y);
        } else if ((key === '-' || key === '_') && !setgs) {
            if (balls.length) {
                ballsCount--;
                balls.pop();
            }
        } else if (key === '`' || key === '~' || key === 'ё' || key === 'Ё') {
            if (balls.length) {
                setgs = !setgs;
                if (setgs) {
                    showElem(elements.settings);
                    updateInfo();
                } else {
                    hideElem(elements.settings);
                    setInfo();
                }
            }
        }
    });

    function game() {
        var hb = h - window.innerHeight > 0,
            wb = w - window.innerWidth > 0,
            sX = window.screenX - screenX !== 0,
            sY = window.screenY - screenY !== 0;
        if (setgs && balls[you]) {
            skinAngle++;
            ctx2.clearRect(0, 0, cns.width, cns.height);
            ctx2.beginPath();
            ctx2.save();
            ctx2.translate(64, 64);
            ctx2.rotate(skinAngle * Math.PI / 180);
            ctx2.drawImage(balls[you].img, -40, -40, 80, 80);
            ctx2.restore();
            ctx2.closePath();
        }
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < balls.length; i++) {
            if (!hb && !wb && !sX && !sY) {
                break;
            }
            if (sX) {
                balls[i].velocity.x += (window.screenX - screenX) / 20;
            }
            if (sY) {
                balls[i].velocity.y += (window.screenY - screenY) / 20;
            }
            if (hb) {
                if (balls[i].position.y >= window.innerHeight - balls[i].r) {
                    balls[i].velocity.y -= (h - window.innerHeight - (h - (balls[i].position.y + balls[i].r))) / 5;
                } else if (balls[i].position.y <= balls[i].r) {
                    balls[i].velocity.y += (h - window.innerHeight - (0 - balls[i].position.y - balls[i].r)) / 5;
                }
            }
            if (wb) {
                if (balls[i].position.x >= window.innerWidth - balls[i].r) {
                    balls[i].velocity.x -= (w - window.innerWidth - (w - (balls[i].position.x + balls[i].r))) / 5;
                } else if (balls[i].position.x <= balls[i].r) {
                    balls[i].velocity.x += (w - window.innerWidth - (0 - balls[i].position.x - balls[i].r)) / 5;
                }
            }
        }
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight
        screenX = window.screenX;
        screenY = window.screenY;
        for (var i = 0; i < balls.length; i++) {
            for (var j = i + 1; j < balls.length; j++) {
                world.collisionWithBall(balls[i], balls[j]);
            }
            if (balls[i].canMove) {
                balls[i].position.add(balls[i].velocity);
            }
            world.resistance(balls[i]).addGravity(balls[i]).checkCoords(balls[i]);
            balls[i].draw();
        }
        for (i = 0; i < blocks.length; i++) {
            blocks[i].draw();
            for (j = 0; j < balls.length; j++) {
                world.collisionWithBlock(blocks[i], balls[j]);
            }
        }
        nextGameStep(game);
    }
    var nextGameStep = (function() {
        return requestAnimationFrame ||
            mozRequestAnimationFrame ||
            webkitRequestAnimationFrame ||
            oRequestAnimationFrame ||
            msRequestAnimationFrame;﻿
    })();
    var upl = function() {
        if (uploaded) {
            game();
            showElem(getElem('guide'));
            clearInterval(upl);
        }
    }
    upl = setInterval(upl, 1000);
});
