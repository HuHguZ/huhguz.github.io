
window.addEventListener('load', function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight - 40,
        msp = 200,
        balls = [],
        you = 0,
        c = false,
        moveAll = false,
        ballsCount = 10,
        world = {
            gravity: new Vector2(0, 0.4), // гравитация
            deceleration: new Vector2(0.08, 0.08), // сила трения и сопротивления воздуха
            loss: 0.95, // потеря скорости при ударе об стены
            collisionLoss: 0.97, //Потеря при соударении мячей
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
                var a = this.gravity.y / 2 + (this.deceleration.x + this.deceleration.y) / 2;
                obj.velocity.x = Math.abs(obj.velocity.x) <= a ? 0 : obj.velocity.x;
                obj.velocity.y = Math.abs(obj.velocity.y) <= a ? 0 : obj.velocity.y;
                return this;
            },
            addGravity(obj) {
                if (obj.position.y < h - obj.r - 1) {
                    obj.velocity.add(this.gravity);
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
                        x: xml * this.deceleration.x,
                        y: yml * this.deceleration.y,
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
                            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
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
            collision(obj1, obj2) {
                if (getDistance(obj1.position.x, obj1.position.y, obj2.position.x, obj2.position.y) <= obj1.r + obj2.r) {
                    this.resolveCollision(obj1, obj2);
                }
            },
            lose(obj) {
                obj.velocity.mult(this.loss);
                return this;
            }
        };
    balls.push(new Ball(new Vector2(Math.random() * w, Math.random() * h), 20, "red", new Vector2(5, 5), 20)); //Добавляем игрока
    for (var i = 0; i < ballsCount; i++) { //Добавляем ботов
        addBall();
    }

    function addBall() {
        var rnd = [(Math.random() * 2 ^ 0) ? 1 : -1, (Math.random() * 2 ^ 0) ? 1 : -1],
            r = Math.random() * 15 + 10 ^ 0,
            ball = new Ball(new Vector2(arguments[0] ? arguments[0] : Math.random() * w, arguments[1] ? arguments[1] : Math.random() * h), r, generateRndcolor(), new Vector2(rnd[0] * Math.random() * 10, rnd[1] * Math.random() * 10), r);
        balls.push(generateNewBall(ball));
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
    }

    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.sclml = function(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
    Vector2.len = function(vec) {
        return (vec.x ** 2 + vec.y ** 2) ** 0.5;
    }
    Vector2.cos = function(vec1, vec2) {
        return this.sclml(vec1, vec2) / this.len(vec1) * this.len(vec2);
    }
    Vector2.prototype.add = function(Vector2) {
        this.x += Vector2.x;
        this.y += Vector2.y;
        return this;
    }
    Vector2.prototype.mult = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    Vector2.prototype.toString = function() {
        return `${this.x};${this.y}`;
    }

    function generateRndcolor() {
        var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
            b = "#";
        for (var i = 1; i <= 6; i++) {
            b += a[Math.random() * a.length ^ 0];
        }
        return b;
    }

    function getDistance(x1, y1, x2, y2) {
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    }

    function showInfo(obj) {
        if (!c) {
            getElem('inp1').value = obj.r;
            getElem('inp2').value = (obj.position.x).toFixed(3);
            getElem('inp3').value = (obj.position.y).toFixed(3);
            getElem('inp4').value = (obj.velocity.x).toFixed(3);
            getElem('inp5').value = (obj.velocity.y).toFixed(3);
            getElem('inp6').value = world.gravity;
            getElem('inp7').value = world.deceleration;
            getElem('inp8').value = world.loss;
            getElem('inp9').value = ballsCount;
        }
    }

    function getElem(id) {
        return document.getElementById(id);
    }

    function settings() {
        c = !c;
        if (c) {
            getElem('but').innerHTML = 'Сохранить';
        } else {
            getElem('but').innerHTML = 'Изменить';
        }
        balls[you].r = parseFloat(getElem('inp1').value);
        balls[you].mass = balls[you].r;
        balls[you].position.x = parseFloat(getElem('inp2').value);
        balls[you].position.y = parseFloat(getElem('inp3').value);
        balls[you].velocity.x = parseFloat(getElem('inp4').value);
        balls[you].velocity.y = parseFloat(getElem('inp5').value);
        var gx = +getElem('inp6').value.match(/[\d.-]+/)[0],
            gy = +getElem('inp6').value.match(/[\d.-]+/g)[1],
            dcx = +getElem('inp7').value.match(/[\d.-]+/)[0],
            dcy = +getElem('inp7').value.match(/[\d.-]+/g)[1];
        world.gravity = new Vector2(isNumeric(gx) ? gx : world.gravity.x, isNumeric(gy) ? gy : world.gravity.y);
        world.deceleration = new Vector2(isNumeric(dcx) ? dcx : world.deceleration.x, isNumeric(dcy) ? dcy : world.deceleration.y);
        world.loss = parseFloat(getElem('inp8').value);
        ballsCount = parseFloat(getElem('inp9').value);
        if (ballsCount > balls.length - 1) {
            for (var i = balls.length; i <= ballsCount; i++) {
                addBall();
            }
        } else if (ballsCount < balls.length) {
            balls = balls.slice(0, ballsCount + 1);
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    document.addEventListener('mousemove', function(e) {
        world.x = e.offsetX;
        world.y = e.offsetY;
    });

    document.addEventListener('click', function(e) {
        if (e.clientY < h) {
            if (moveAll) {
                for (var i = 0; i < balls.length; i++) {
                    balls[i].velocity.x = msp * ((e.offsetX - balls[i].position.x) / ((e.offsetX - balls[i].position.x) ** 2 + (e.offsetY - balls[i].position.y) ** 2) ** 0.5) || 0;
                    balls[i].velocity.y = msp * ((e.offsetY - balls[i].position.y) / ((e.offsetX - balls[i].position.x) ** 2 + (e.offsetY - balls[i].position.y) ** 2) ** 0.5) || 0;
                }
            } else {
                balls[you].velocity.x = msp * ((e.offsetX - balls[you].position.x) / ((e.offsetX - balls[you].position.x) ** 2 + (e.offsetY - balls[you].position.y) ** 2) ** 0.5) || 0;
                balls[you].velocity.y = msp * ((e.offsetY - balls[you].position.y) / ((e.offsetX - balls[you].position.x) ** 2 + (e.offsetY - balls[you].position.y) ** 2) ** 0.5) || 0;
            }
        }
    });

    document.addEventListener('keypress', function(event) {
        var key = event.key;
        if (key === 'e' || key === 'E' || key === 'у' || key === 'У') {
            balls = balls.slice(0, 1);
            for (var i = 0; i < ballsCount; i++) {
                addBall();
            }
        } else if (key === '+' || key === '=') {
            ballsCount++;
            addBall(world.x, world.y);
        } else if (key === '-' || key === '_') {
            if (balls.length > 1) {
                ballsCount--;
                balls.pop();
            }
        } else if (key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
            moveAll = !moveAll;
        } else if (key === 'q' || key === 'Q' || key === 'й' || key === 'Й') {
            for (var i = 0; i < balls.length; i++) {
                if (getDistance(balls[i].position.x, balls[i].position.y, world.x, world.y) <= balls[i].r) {
                    you = i;
                }
            }
        }
    });
    getElem('but').addEventListener('click', settings)

    function drawCircle(x, y, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    function game() {
        //Сделать вывод служебной информации
        ctx.clearRect(0, 0, w, h);
        showInfo(balls[you]);
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight - 40;
        for (var i = 0; i < balls.length; i++) {
            for (var j = i + 1; j < balls.length; j++) {
                world.collision(balls[i], balls[j]);
            }
        }
        for (var i = 0; i < balls.length; i++) {
            balls[i].position.add(balls[i].velocity);
            world.resistance(balls[i]).addGravity(balls[i]).checkCoords(balls[i]);
            drawCircle(balls[i].position.x, balls[i].position.y, balls[i].r, balls[i].color);
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
    game();
});
