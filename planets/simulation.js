window.addEventListener(`load`, () => {
    let getElem = id => document.getElementById(id),
        nextGameStep = (function () {
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
    ctx.lineWidth = 1;
    const getDistance = (x1, y1, x2, y2) => ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;

    getRndColor = () => {
        var a, b = "#",
            color = `0123456789abcdef`;
        for (var i = 1; i <= 6; i++) {
            a = Math.random() * color.length ^ 0;
            b += color[a];
        }
        return b;
    };

    class Vector {

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        normalize() {
            this.x /= this.length;
            this.y /= this.length;
            return this;
        }

        get length() {
            return (this.x ** 2 + this.y ** 2) ** 0.5;
        }

        cos(vector) {
            return (this.x * vector.x + this.y * vector.y) / (this.length * vector.length);
        }

        add(vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        }

        mult(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }

        toString() {
            return `${this.x};${this.y}`;
        }

    }

    class Planet {
        constructor({
            position,
            velocity,
            acceleration,
            radius,
            color,
            mass
        } = {}) {
            this.position = position;
            this.velocity = velocity;
            this.acceleration = acceleration;
            this.radius = radius;
            this.color = color;
            this.calcColor = `rgb(${this.color.join(`,`)})`;
            this.mass = mass;
            this.track = [];
        }

        move() {
            const oldPos = new Vector(this.position.x, this.position.y);
            this.position.add(this.velocity);
            const dist = getDistance(this.position.x, this.position.y, oldPos.x, oldPos.y);
            if (dist) {
                this.track.push(oldPos);
            }
            if (this.track.length > 150) {
                this.track.shift();
            }
            this.velocity.add(this.acceleration);
            if (
                this.position.x + this.radius > w ||
                this.position.x - this.radius < 0
            ) {
                this.velocity.x *= -1;
                this.acceleration.x *= -1;
            }
            if (
                this.position.y + this.radius > h ||
                this.position.y - this.radius < 0
            ) {
                this.velocity.y *= -1;
                this.acceleration.y *= -1;
            }
            return this;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.calcColor;
            ctx.strokeStyle = this.calcColor;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            if (!this.track.length) {
                return;
            }
            for (let i = 1; i < this.track.length; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${this.color.join(`,`)},${i/this.track.length})`; //i/this.track.length
                ctx.moveTo(this.track[i - 1].x, this.track[i - 1].y);
                ctx.lineTo(this.track[i].x, this.track[i].y);
                ctx.stroke();
            }
        }

    }
    const gravity = 100;
    const planets = [];

    document.addEventListener(`click`, e => {
        const r = (Math.random() * 10 ^ 0) + 2;
        planets.push(new Planet({
            position: new Vector(e.clientX, e.clientY),
            velocity: new Vector(Math.random() - .5, Math.random() - .5),
            acceleration: new Vector(0, 0),
            radius: r,
            mass: r,
            color: [Math.random() * 256 ^ 0, Math.random() * 256 ^ 0, Math.random() * 256 ^ 0]
        }));
    });
    game();

    function game() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const distance = getDistance(planets[i].position.x, planets[i].position.y, planets[j].position.x, planets[j].position.y);
                if (distance < planets[i].radius + planets[j].radius) {
                    continue;
                }
                const gravitation = gravity / (distance * distance);
                const sinn = (planets[i].position.y - planets[j].position.y) / distance;
                const coss = (planets[i].position.x - planets[j].position.x) / distance;
                const addVelVec = new Vector(gravitation * coss * ((planets[j].mass / planets[i].mass) * -1), gravitation * sinn * ((planets[j].mass / planets[i].mass) * -1));
                planets[i].velocity.add(addVelVec);
                planets[j].velocity.add(new Vector(gravitation * coss, gravitation * sinn));
            }
            if (planets[i].velocity.length > 100) {
                planets[i].velocity.mult(0.99);
            }
            // planets[i].velocity.mult(0.99);
            planets[i].move().draw();
        }
        nextGameStep(game);
    }

});