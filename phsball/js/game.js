
window.addEventListener('load', function() {
    var canvas = getElem('canvas'), // Канвас
        ctx = canvas.getContext('2d'), // Контекст
        cns = getElem('skin'),
        ctx2 = cns.getContext('2d'),
        cns2 = getElem('texture'),
        ctx3 = cns2.getContext('2d'),
        w = canvas.width = window.innerWidth, // Ширина канваса
        h = canvas.height = window.innerHeight, // Высота санваса
        balls = [], // Массив для хранения мячей
        blocks = [], // Массив для хранения блоков
        you = 0, // Номер текущего мяча
        blockTexture = 4, //Номер текстуры блока, используемой в данный момент
        skinAngle = 0, //угол поворота скина в меню настроек
        setgs = false, // Для настроек
        drawInfo = false, //Рисовать или нет на экране инфу о мяче
        ballsCount = 15, // Количество мячей в начале игры
        mouse = {}, // Объект координат, скорости мыши
        imagesForBalls = [], // Массив изображений мячей
        imagesForBlocks = [], //Массив изображений блоков
        screenX = window.screenX, //Координаты верхнего угла окна браузера
        screenY = window.screenY, //Координаты верхнего угла окна браузера
        uploaded = false, //Загружены или нет все изображения мячей
        loadCount = 0, //Кол-во загруженных изображений
        totalBallsCount = 79, //Общее кол-во изображений мячей
        totalBlocksCount = 193, //Общее количество изображений блоков
        acspeed = 5, //На это число ускорится мяч или мячи при нажатии клавиши Q или W
        blw = 32, //Ширина добавляемых блоков
        blh = 32, //Высота добавляемых блоков
        Black_hole = {
            radiusOfAction: 135,
            strength: 5,
            list: [],
            proto: {
                draw() {
                    this.angle += 1;
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(this.position.x, this.position.y);
                    ctx.rotate(this.angle * Math.PI / 180);
                    ctx.drawImage(imagesForBalls[17], -this.radiusOfAction, -this.radiusOfAction, this.radiusOfAction * 2, this.radiusOfAction * 2);
                    ctx.restore();
                    ctx.closePath();
                    return this;
                },
                interact() {
                    var distance;
                    for (var i = 0; i < balls.length; i++) {
                        distance = getDistance(this.position.x, this.position.y, balls[i].position.x, balls[i].position.y);
                        if (distance <= this.radiusOfAction + balls[i].r) {
                            balls[i].velocity.x += this.strength * (Math.abs(1 - distance / this.radiusOfAction)) * (this.position.x - balls[i].position.x) / distance;
                            balls[i].velocity.y += this.strength * (Math.abs(1 - distance / this.radiusOfAction)) * (this.position.y - balls[i].position.y) / distance;
                        }
                    }
                    return this;
                }
            },
            constructor(posX, posY) {
                this.list.push({
                    radiusOfAction: this.radiusOfAction,
                    position: new Vector2(posX, posY),
                    strength: this.strength,
                    angle: 0,
                    __proto__: this.proto
                });
            }
        }, //объёкт черных дыр
        fvx = getRandomInt(-5, 10),
        bvx = getRandomInt(-5, 10),
        fvy = getRandomInt(-5, 10),
        bvy = getRandomInt(-5, 10),
        handlers = [function(obj) { // Массив обработчиков для проверки состояния мяча (на земле или в воздухе). Важно, т.к. без этого мяч будет бесконечно биться о землю
            return obj.position.y >= h - obj.r - 1;
        }, function(obj) {
            return obj.position.y <= obj.r + 1;
        }, function(obj) {
            return obj.position.x <= obj.r + 1;
        }, function(obj) {
            return obj.position.x >= w - obj.r - 1;
        }],
        world = { //Объект мир со стандартными константами и основными игровыми функциями
            gravity: new Vector2(0, 0.4), // Гравитация
            deceleration: new Vector2(0.08, 0.08), // Сила трения и сопротивления воздуха
            loss: 0.95, // Потеря скорости при ударе об стены
            collisionLoss: 0.97, // Потеря при соударении мячей
            check(obj, axis, condition, expression, side) {
                if (condition) {
                    obj.velocity[axis] *= -1;
                    obj.position[axis] = expression;
                    this.lose(obj);
                    this.groundResistance(side, obj);
                    if (Math.abs(obj.velocity[axis]) < Math.abs(obj.gravity[axis]) && !obj.onGround) {
                        obj.velocity[axis] = obj.gravity[axis];
                    }
                }
            },
            checkCoords(obj) {
                this.check(obj, 'x', obj.position.x >= w - obj.r, w - obj.r, 1);
                this.check(obj, 'x', obj.position.x <= obj.r, obj.r, 3);
                this.check(obj, 'y', obj.position.y >= h - obj.r, h - obj.r, 0);
                this.check(obj, 'y', obj.position.y <= obj.r, obj.r, 2);
                if (obj.onGround) {
                    var a = Math.abs((obj.gravity.x + obj.gravity.y) / 2 + (obj.deceleration.x + obj.deceleration.y) / 2);
                    obj.velocity.x = Math.abs(obj.velocity.x) <= a ? 0 : obj.velocity.x;
                    obj.velocity.y = Math.abs(obj.velocity.y) <= a ? 0 : obj.velocity.y;
                }
                return this;
            },
            addGravity(obj) {
                if (obj.canCallHand) {
                    if (obj.isCollided) {
                        obj.onGround = true;
                    } else {
                        obj.onGround = + function() {
                            for (var i = 0; i < obj.handlers.length; i++) {
                                if (obj.handlers[i] && obj.handlers[i](obj)) {
                                    return true;
                                }
                            }
                            return false;
                        }();
                    }
                }
                if (!obj.onGround) {
                    obj.velocity.add(obj.gravity);
                }
                return this;
            },
            airResistance(obj) {
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
                    return new Vector2(xml * obj.deceleration.x, yml * obj.deceleration.y);
                })());
                return this;
            },
            groundResistance(side, obj) {
                if (!side || side === 2) {
                    if (obj.velocity.x > 0) {
                        obj.velocity.add(new Vector2(-obj.deceleration.x, 0));
                    } else {
                        obj.velocity.add(new Vector2(obj.deceleration.x, 0));
                    }
                } else {
                    if (obj.velocity.y > 0) {
                        obj.velocity.add(new Vector2(0, -obj.deceleration.y));
                    } else {
                        obj.velocity.add(new Vector2(0, obj.deceleration.y));
                    }
                }
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
                        vec1 = new Vector2(otherball.position.x - ball.position.x, otherball.position.y - ball.position.y),
                        vec2 = new Vector2(ball.r, 0);
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
                    if (!ball.gravity.x && !otherball.gravity.x) {
                        if (Math.abs(vec1.cos(vec2)) < 0.6981317007977318) {
                            collide();
                        }
                    } else if (!ball.gravity.y && !otherball.gravity.y) {
                        if (Math.abs(vec1.cos(vec2)) > 0.6981317007977318) {
                            collide();
                        }
                    } else {
                        if (Math.abs(vec1.cos(vec2)) > 0.3490658503988659 && Math.abs(vec1.cos(vec2)) < 0.8726646259971648) {
                            collide();
                        }
                    }

                    function collide() {
                        if (otherball.onGround) {
                            ball.isCollided = true;
                        }
                        if (ball.onGround) {
                            otherball.isCollided = true;
                        }
                    }
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
            resolveCollisionWithBlock(block, ball) {
                if (block.physical) {
                    for (var i = 0; i < block.parts.length; i++) {
                        if (this.collisionDetWithBlock(block.parts[i], ball)) {
                            if (!~ball.handlers.indexOf(block.handler.checkCollision)) {
                                ball.handlers.push(block.handler.checkCollision);
                            }
                            if (!i || i === 2 || i === 6 || i === 7) {
                                this.resolveCollision({
                                    position: new Vector2(block.parts[i].x + block.parts[i].w / 2, block.parts[i].y + block.parts[i].h / 2),
                                    velocity: new Vector2(-ball.velocity.x / 1.5, -ball.velocity.y / 1.5),
                                    mass: ball.mass
                                }, ball);
                            } else if (i === 1 || i === 4) {
                                ball.velocity.y *= -1;
                                this.lose(ball);
                            } else if (i === 3 || i === 5) {
                                ball.velocity.x *= -1;
                                this.lose(ball);
                            }
                            if (ball.canCallHand) {
                                ball.position.x += 2 * (ball.position.x - (block.parts[i].x + block.parts[i].w / 2)) / getDistance(ball.position.x, ball.position.y, block.parts[i].x + block.parts[i].w / 2, block.parts[i].y + block.parts[i].h / 2);
                                ball.position.y += 2 * (ball.position.y - (block.parts[i].y + block.parts[i].h / 2)) / getDistance(ball.position.x, ball.position.y, block.parts[i].x + block.parts[i].w / 2, block.parts[i].y + block.parts[i].h / 2);
                            }
                        }
                    }
                }
                return this;
            },
            lose(obj) {
                obj.velocity.mult(obj.loss);
                return this;
            }
        },
        progressBar = {
            x: w / 2 - 250,
            y: h / 2 - 50,
            w: 500,
            h: 50,
            color: '#000000'
        },
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
            chgimg: getElem('chgimg'),
            acspeed: getElem('acspeed'),
            blw: getElem('blw'),
            blh: getElem('blh'),
            txtr: getElem('txtr'),
            phys: getElem('phys'),
            fvx: getElem('fvx'),
            bvx: getElem('bvx'),
            fvy: getElem('fvy'),
            bvy: getElem('bvy'),
            lawOfMotion: getElem('lawOfMotion'),
            rnd: getElem('rnd'),
            rBlackHoles: getElem('rblackholes'),
            strengthBlackHoles: getElem('strengthblackholes')
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
            'loss',
            'lawOfMotion'
        ];
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = buttonsHandlers(i);
    }
    elements.rnd.onclick = function() {
        elements.lawOfMotion.value = 'if (!(Math.round(performance.now()/1000)%2)) {this.velocity.x+=Math.random()*getRandomInt(-10, 10);this.velocity.y+=Math.random()*getRandomInt(-10, 10);function getRandomInt(min, max){return Math.floor(Math.random()*(max-min))+min;}}';
    }
    elements.you.oninput = function() {
        you = +this.value < 0 ? (this.value = 0, 0) : +this.value > balls.length - 1 ? (this.value = balls.length - 1, balls.length - 1) : +this.value;
        updateInfo();
    }
    elements.chgimg.oninput = function() {
        if (balls[you] && isNumeric(parseFloat(this.value))) {
            balls[you].img = imagesForBalls[+this.value < 0 ? (this.value = 0, 0) : +this.value > imagesForBalls.length - 1 ? (this.value = imagesForBalls.length - 1, imagesForBalls.length - 1) : +this.value];
        }
    }
    elements.txtr.oninput = function() {
        blockTexture = +this.value < 1 ? (this.value = 1, 1) : +this.value > 193 ? (this.value = 193, 193) : +this.value;
        showTexture();
    }
    cns.width = cns.height = cns2.width = cns2.height = 120;
    for (var i = 0; i <= totalBallsCount; i++) {
        var img = new Image();
        img.src = `resources/balls/ball${i}.png`;
        img.onload = load;
        imagesForBalls.push(img);
    }
    for (var i = 1; i <= totalBlocksCount; i++) {
        var img = new Image();
        img.src = `resources/blocks/block (${i}).png`;
        img.onload = load;
        imagesForBlocks.push(img);
    }
    for (var i = 0; i < ballsCount; i++) { //Добавляем мячи
        addBall();
    }

    function load() {
        loadCount++;
        if (loadCount === totalBallsCount + totalBlocksCount + 1) {
            uploaded = !uploaded;
        }
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = progressBar.color;
        ctx.stroke();
        ctx.strokeRect(progressBar.x - ctx.lineWidth / 2, progressBar.y - ctx.lineWidth / 2, progressBar.w + ctx.lineWidth, progressBar.h + ctx.lineWidth);
        ctx.fillStyle = 'rgb(255, 161, 0)';
        ctx.fillRect(progressBar.x, progressBar.y, progressBar.w * (loadCount / (totalBallsCount + totalBlocksCount + 1)), progressBar.h);
        ctx.fillStyle = 'rgb(255, 161, 0)';
        ctx.textAlign = "center";
        ctx.font = "normal 25px Verdana";
        ctx.fillText(`Загрузка: ${(100 * loadCount / (totalBallsCount + totalBlocksCount + 1)).toFixed(3)}%`, w / 2, h / 2 + 30 + ctx.lineWidth);
        ctx.closePath();
    }

    function addBall() {
        var r = Math.random() * 15 + 10 ^ 0,
            ball = new Ball(new Vector2(isNumeric(arguments[0]) ? arguments[0] : Math.random() * w, isNumeric(arguments[1]) ? arguments[1] : Math.random() * h), r, generateRndcolor(), new Vector2(getRandomArbitrary(fvx, bvx), getRandomArbitrary(fvy, bvy)), r);
        if (arguments.length) {
            balls.push(ball);
        } else {
            balls.push(generateNewBall(ball));
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
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
        this.handlers = [handlers[0]];
        this.deceleration = new Vector2(world.deceleration.x, world.deceleration.y);
        this.loss = world.loss;
        this.canCallHand = true;
        this.angle = 0;
        this.canMove = true;
        this.img = imagesForBalls[Math.random() * imagesForBalls.length ^ 0];
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

    Vector2.prototype.length = function() {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    }
    Vector2.prototype.cos = function(Vector2) {
        return (this.x * Vector2.x + this.y * Vector2.y) / (this.length() * Vector2.length());
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

    function Block(x, y, w, h, img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.physical = elements.phys.checked;
        this.handler = {
            block: this,
            checkCollision: function(ball) {
                if (!ball.gravity.x && ball.gravity.y > 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[1].x,
                        y: this.block.parts[1].y - 2,
                        w: this.block.parts[1].w,
                        h: this.block.parts[1].h
                    }, ball);
                } else if (!ball.gravity.x && ball.gravity.y < 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[4].x,
                        y: this.block.parts[4].y,
                        w: this.block.parts[4].w,
                        h: this.block.parts[4].h + 2
                    }, ball);
                } else if (ball.gravity.x > 0 && !ball.gravity.y) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[3].x - 2,
                        y: this.block.parts[3].y,
                        w: this.block.parts[3].w,
                        h: this.block.parts[3].h
                    }, ball);
                } else if (ball.gravity.x < 0 && !ball.gravity.y) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[5].x,
                        y: this.block.parts[5].y,
                        w: this.block.parts[5].w + 2,
                        h: this.block.parts[5].h
                    }, ball);
                } else if (ball.gravity.x > 0 && ball.gravity.y > 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[1].x,
                        y: this.block.parts[1].y - 2,
                        w: this.block.parts[1].w,
                        h: this.block.parts[1].h
                    }, ball) || world.collisionDetWithBlock({
                        x: this.block.parts[3].x - 2,
                        y: this.block.parts[3].y,
                        w: this.block.parts[3].w,
                        h: this.block.parts[3].h
                    }, ball);
                } else if (ball.gravity.x > 0 && ball.gravity.y < 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[4].x,
                        y: this.block.parts[4].y,
                        w: this.block.parts[4].w,
                        h: this.block.parts[4].h + 2
                    }, ball) || world.collisionDetWithBlock({
                        x: this.block.parts[3].x - 2,
                        y: this.block.parts[3].y,
                        w: this.block.parts[3].w,
                        h: this.block.parts[3].h
                    }, ball);
                } else if (ball.gravity.x < 0 && ball.gravity.y > 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[5].x,
                        y: this.block.parts[5].y,
                        w: this.block.parts[5].w + 2,
                        h: this.block.parts[5].h
                    }, ball) || world.collisionDetWithBlock({
                        x: this.block.parts[1].x,
                        y: this.block.parts[1].y - 2,
                        w: this.block.parts[1].w,
                        h: this.block.parts[1].h
                    }, ball);
                } else if (ball.gravity.x < 0 && ball.gravity.y < 0) {
                    return world.collisionDetWithBlock({
                        x: this.block.parts[5].x,
                        y: this.block.parts[5].y,
                        w: this.block.parts[5].w + 2,
                        h: this.block.parts[5].h
                    }, ball) || world.collisionDetWithBlock({
                        x: this.block.parts[4].x,
                        y: this.block.parts[4].y,
                        w: this.block.parts[4].w,
                        h: this.block.parts[4].h + 2
                    }, ball);
                }
            }
        }
        var a = this.handler;
        a.checkCollision = a.checkCollision.bind(a);
        (Block.handlers ? Block.handlers : []).push(a);
    }
    Block.handlers = [];
    Block.prototype.draw = function() {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    Block.prototype.update = function() {
        var ww = 1 / 10 * this.w,
            hh = 1 / 10 * this.h,
            hhh = 1 / 2 * this.h;
        this.parts = [{
                x: this.x,
                y: this.y,
                w: ww,
                h: hh
            },
            {
                x: this.x + ww,
                y: this.y,
                w: 8 * ww,
                h: hhh
            },
            {
                x: this.x + 9 * ww,
                y: this.y,
                w: ww,
                h: hh
            },
            {
                x: this.x,
                y: this.y + hh,
                w: ww,
                h: 8 * hh
            },
            {
                x: this.x + ww,
                y: this.y + hhh,
                w: 8 * ww,
                h: hhh
            },
            {
                x: this.x + 9 * ww,
                y: this.y + hh,
                w: ww,
                h: 8 * hh
            },
            {
                x: this.x,
                y: this.y + 9 * hh,
                w: ww,
                h: hh
            },
            {
                x: this.x + 9 * ww,
                y: this.y + 9 * hh,
                w: ww,
                h: hh
            }
        ];
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
                isNumeric(+elements.chgimg.value) ? imagesForBalls[+elements.chgimg.value] : balls[you].img ? balls[you].img : imagesForBalls[Math.random() * imagesForBalls.length ^ 0],
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
                    sp: isNumeric(+elements.gravity.value.match(/[\d.-]+/)[0]) ? +elements.gravity.value.match(/[\d.-]+/)[0] : world.gravity.x,
                    tp: isNumeric(+elements.gravity.value.match(/[\d.-]+/g)[1]) ? +elements.gravity.value.match(/[\d.-]+/g)[1] : world.gravity.y,
                },
                {
                    sp: isNumeric(+elements.deceleration.value.match(/[\d.-]+/)[0]) ? +elements.deceleration.value.match(/[\d.-]+/)[0] : world.deceleration.x,
                    tp: isNumeric(+elements.deceleration.value.match(/[\d.-]+/g)[1]) ? +elements.deceleration.value.match(/[\d.-]+/g)[1] : world.deceleration.y
                },
                isNumeric(parseFloat(elements.loss.value)) ? +elements.loss.value : world.loss,
                new Function('', elements.lawOfMotion.value)
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
                if (prop['fp'] === 'deceleration') {
                    if (p === 'sp') {
                        world.deceleration.x = value[p];
                    } else {
                        world.deceleration.y = value[p];
                    }
                }
                if (prop['fp'] === 'gravity') {
                    if (p === 'sp') {
                        world.gravity.x = value[p];
                    } else {
                        world.gravity.y = value[p];
                    }
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
        elements.chgimg.value = imagesForBalls.indexOf(balls[you].img);
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
        elements.acspeed.value = acspeed;
        elements.blw.value = blw;
        elements.blh.value = blh;
        elements.txtr.value = blockTexture;
        elements.fvx.value = fvx;
        elements.bvx.value = bvx;
        elements.fvy.value = fvy;
        elements.bvy.value = bvy;
        elements.strengthBlackHoles.value = Black_hole.strength;
        elements.rBlackHoles.value = Black_hole.radiusOfAction;
    }

    function setInfo() {
        for (var i = 1; i < buttons.length; i++) {
            buttons[i].onclick();
        }
        acspeed = parseFloat(+elements.acspeed.value) ? +elements.acspeed.value : acspeed;
        ballsCount = +elements.balls.value;
        blw = parseFloat(+elements.blw.value) ? elements.blw.value : blw;
        blh = parseFloat(+elements.blh.value) ? elements.blh.value : blh;
        fvx = typeof parseFloat(+elements.fvx.value) == 'number' ? +elements.fvx.value : fvx;
        bvx = typeof parseFloat(+elements.bvx.value) == 'number' ? +elements.bvx.value : bvx;
        fvy = typeof parseFloat(+elements.fvy.value) == 'number' ? +elements.fvy.value : fvy;
        bvy = typeof parseFloat(+elements.bvy.value) == 'number' ? +elements.bvy.value : bvy;
        Black_hole.radiusOfAction = typeof parseFloat(+elements.rBlackHoles.value) == 'number' ? Math.abs(+elements.rBlackHoles.value) : Black_hole.radiusOfAction;
        Black_hole.strength = typeof parseFloat(+elements.strengthBlackHoles.value) == 'number' ? +elements.strengthBlackHoles.value : Black_hole.strength;
        if (ballsCount > balls.length) {
            for (var i = balls.length; i < ballsCount; i++) {
                addBall();
            }
        } else if (ballsCount < balls.length) {
            balls = balls.slice(0, ballsCount < 0 ? (ballsCount = 0, 0) : ballsCount);
        }
    }

    function checkGravity(obj) {
        obj.onGround = false;
        if (!obj.gravity.x && !obj.gravity.y) {
            obj.handlers = [function(obj) {
                return obj.deceleration.x + obj.deceleration.y;
            }];
        } else if (!obj.gravity.x && obj.gravity.y > 0) {
            obj.handlers = [handlers[0]];
        } else if (!obj.gravity.x && obj.gravity.y < 0) {
            obj.handlers = [handlers[1]];
        } else if (obj.gravity.x > 0 && !obj.gravity.y) {
            obj.handlers = [handlers[3]];
        } else if (obj.gravity.x < 0 && !obj.gravity.y) {
            obj.handlers = [handlers[2]];
        } else if (obj.gravity.x > 0 && obj.gravity.y > 0) {
            obj.handlers = [handlers[0], handlers[3]];
        } else if (obj.gravity.x > 0 && obj.gravity.y < 0) {
            obj.handlers = [handlers[1], handlers[3]];
        } else if (obj.gravity.x < 0 && obj.gravity.y > 0) {
            obj.handlers = [handlers[0], handlers[2]];
        } else if (obj.gravity.x < 0 && obj.gravity.y < 0) {
            obj.handlers = [handlers[1], handlers[2]];
        }
    }

    function clearGravity() {
        for (var i = 0; i < balls.length; i++) {
            checkGravity(balls[i]);
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function showTexture() {
        ctx3.clearRect(0, 0, cns2.width, cns2.height);
        ctx3.drawImage(imagesForBlocks[blockTexture - 1], 0, 0, cns2.width, cns2.height);
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
                    balls[you].onGround = false;
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
        if (key.match(/^[eУ]$/i)) {
            balls = [];
            for (var i = 1; i <= ballsCount; i++) {
                addBall();
            }
        } else if (key.match(/^[+=]$/i) && !setgs) {
            ballsCount++;
            addBall(mouse.x, mouse.y);
        } else if (key.match(/^[-_]$/i) && !setgs) {
            if (balls.length) {
                ballsCount--;
                balls.pop();
            }
        } else if (key.match(/^[ё`~]$/i)) {
            if (balls.length) {
                setgs = !setgs;
                if (setgs) {
                    showTexture();
                    showElem(elements.settings);
                    updateInfo();
                } else {
                    hideElem(elements.settings);
                    setInfo();
                }
            }
        } else if (key.match(/^[йq]$/i)) {
            for (var i = 0; i < balls.length; i++) {
                goToMouse(balls[i]);
                balls[i].onGround = false;
            }
        } else if (key.match(/^[цw]$/i)) {
            goToMouse(balls[you]);
        } else if (key.match(/^[}\]ъ]$/i)) {
            var block = new Block(mouse.x - blw / 2, mouse.y - blh / 2, blw, blh, imagesForBlocks[blockTexture - 1]);
            block.update();
            blocks.push(block);
        } else if (key.match(/^[{\[х]$/i) && blocks.length) {
            var ball = {
                    position: new Vector2(mouse.x, mouse.y),
                    r: 1
                },
                q = false;
            for (var i = 0; i < blocks.length; i++) {
                if (world.collisionDetWithBlock(blocks[i], ball)) {
                    Block.handlers.splice(Block.handlers.indexOf(blocks[i].handler), 1);
                    blocks.splice(i, 1);
                    clearGravity();
                    q = !q;
                    break;
                }
            }
            if (!q) {
                Block.handlers.splice(Block.handlers.indexOf(blocks[blocks.length - 1].handler), 1);
                blocks.pop();
                clearGravity();
            }
        } else if (key.match(/^[pз]$/i)) {
            for (var i = 0; i < blocks.length; i++) {
                blocks[i].x = Math.round(blocks[i].x / blocks[i].w) * blocks[i].w;
                blocks[i].y = Math.round(blocks[i].y / blocks[i].h) * blocks[i].h;
                blocks[i].update();
            }
        } else if (key.match(/^[rк]$/i)) {
            drawInfo = !drawInfo;
        } else if (key.match(/^[фa]$/i)) {
            Black_hole.constructor(mouse.x, mouse.y);
        } else if (key.match(/^[sы]$/i)) {
            Black_hole.list.pop();
        }

        function goToMouse(obj) {
            obj.velocity = new Vector2(obj.velocity.x + acspeed * (mouse.x - obj.position.x) / getDistance(obj.position.x, obj.position.y, mouse.x, mouse.y), obj.velocity.y + acspeed * (mouse.y - obj.position.y) / getDistance(obj.position.x, obj.position.y, mouse.x, mouse.y));
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
        for (var i = 0; i < Black_hole.list.length; i++) {
            Black_hole.list[i].draw().interact();
        }
        for (var i = 0; i < balls.length; i++) {
            balls[i].isCollided = false;
        }
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].lawOfMotion) {
                try {
                    balls[i].lawOfMotion();
                } catch (e) {
                    console.error('Your function is wrong! ' + e.message);
                }
            }
            for (var j = i + 1; j < balls.length; j++) {
                world.collisionWithBall(balls[i], balls[j]);
            }
            world.airResistance(balls[i]).addGravity(balls[i]).checkCoords(balls[i]);
            if (balls[i].canMove) {
                balls[i].position.add(balls[i].velocity);
            }
            balls[i].draw();
        }
        for (i = 0; i < blocks.length; i++) {
            blocks[i].draw();
            for (j = 0; j < balls.length; j++) {
                world.resolveCollisionWithBlock(blocks[i], balls[j]);
            }
        }
        if (drawInfo && balls.length) {
            ctx.beginPath();
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.font = "Bold 15px Verdana";
            ctx.fillText(`r: ${balls[you].r} m: ${balls[you].mass} x: ${(balls[you].position.x).toFixed(1)} y: ${(balls[you].position.y).toFixed(1)} xv: ${(balls[you].velocity.x).toFixed(1)} yv: ${(balls[you].velocity.y).toFixed(1)}`, w / 2, 20);
            ctx.closePath();
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
    upl = setInterval(upl, 100);
    setInterval(clearGravity, 60000);
});
