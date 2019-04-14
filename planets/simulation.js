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
            radius,
            color,
            mass
        } = {}) {
            this.position = position;
            this.velocity = velocity;
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
            if (this.track.length > 50) {
                this.track.shift();
            }
            if (
                this.position.x + this.radius > w ||
                this.position.x - this.radius < 0
            ) {
                this.velocity.x *= -1;
            }
            if (
                this.position.y + this.radius > h ||
                this.position.y - this.radius < 0
            ) {
                this.velocity.y *= -1;
            }
            return this;
        }

        draw() {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = this.calcColor;
            ctx.strokeStyle = this.calcColor;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            if (!this.track.length) {
                return;
            }
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.track[this.track.length - 1].x, this.track[this.track.length - 1].y);
            ctx.stroke();
            for (let i = 1; i < this.track.length; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${this.color.join(`,`)},${i / this.track.length})`; //i/this.track.length
                ctx.moveTo(this.track[i - 1].x, this.track[i - 1].y);
                ctx.lineTo(this.track[i].x, this.track[i].y);
                ctx.stroke();
            }
        }

    }
    const gravity = 100;
    const planets = [];
    const firstPoint = new Vector(0, 0);
    const secondPoint = new Vector(0, 0);
    let isClamped = false;
    let planetClr, calcPlanetClr;

    document.addEventListener(`mousedown`, e => {
        isClamped = true;
        firstPoint.x = e.clientX;
        firstPoint.y = e.clientY;
        secondPoint.x = e.clientX;
        secondPoint.y = e.clientY;
        planetClr = [Math.random() * 256 ^ 0, Math.random() * 256 ^ 0, Math.random() * 256 ^ 0];
        calcPlanetClr = `rgb(${planetClr.join(`,`)})`;
    });

    document.addEventListener(`mouseup`, e => {
        isClamped = false;
        const r = (Math.random() * 1 ^ 0) + 2;
        const velocity = new Vector(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
        planets.push(new Planet({
            position: new Vector(firstPoint.x, firstPoint.y),
            velocity: velocity.mult(0.05),
            radius: r,
            mass: r,
            color: planetClr
        }));
    });
    
    document.addEventListener(`mousemove`, e => {
        if (isClamped) {
            secondPoint.x = e.clientX;
            secondPoint.y = e.clientY;
        }
    });

    planets.push(new Planet({
        position: new Vector(w /2 , h / 2),
        velocity: new Vector(0, 0),
        radius: 20,
        mass: 70,
        color: [255, 255, 0]
    }));

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
                const addVelVec = new Vector(gravitation * coss, gravitation * sinn);
                const addVelvecc = new Vector(addVelVec.x, addVelVec.y);
                planets[i].velocity.add(addVelVec.mult((planets[j].mass / planets[i].mass) * -1));
                planets[j].velocity.add(addVelvecc.mult((planets[i].mass / planets[j].mass)));
            }
            planets[i].velocity.mult(1 - planets[i].velocity.length / 3e3);
            planets[i].move().draw();
        }
        if (isClamped) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = calcPlanetClr;
            ctx.moveTo(firstPoint.x, firstPoint.y);
            ctx.lineTo(secondPoint.x, secondPoint.y);
            ctx.stroke();
        }
        nextGameStep(game);
    }

});