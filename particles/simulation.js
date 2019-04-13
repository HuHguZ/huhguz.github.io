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


    // 0   0     0
    // red green blue

    const beginColor = [0, 0, 255];

    const colors = [beginColor];
    const step = 0.1;
    while (beginColor[1] < 255) {
        beginColor[1] += step;
        colors.push([...beginColor]);
    }
    while (beginColor[2] > 0) {
        beginColor[2] -= step;
        colors.push([...beginColor]);
    }
    while (beginColor[0] < 255) {
        beginColor[0] += step;
        colors.push([...beginColor]);
    }
    while (beginColor[1] > 0) {
        beginColor[1] -= step;
        colors.push([...beginColor]);
    }

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

    class Particle {
        constructor({
            position,
            velocity,
            acceleration,
            color,
            radius
        } = {}) {
            this.position = position;
            this.velocity = velocity;
            this.acceleration = acceleration;
            this.color = color;
            this.radius = radius;
        }

        move() {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.mult(0.99);
            if (
                this.position.x + this.radius > w ||
                this.position.x - this.radius < 0
            ) {
                this.velocity.x = 0;
                this.acceleration.x = 0;
            }
            if (
                this.position.y + this.radius > h ||
                this.position.y - this.radius < 0
            ) {
                this.velocity.y = 0;
                this.acceleration.y = 0;
            }
            return this;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

    }

    class BlackHole {
        constructor({
            position,
            radius,
            strength
        } = {}) {
            this.position = position;
            this.radius = radius;
            this.strength = strength;
        }

        interact(particle) {
            const distance = getDistance(this.position.x, this.position.y, particle.position.x, particle.position.y);
            const tmp = this.strength * (Math.abs(1 - distance / this.radius));
            if (distance <= this.radius + particle.radius) {
                const vec = new Vector(tmp * (this.position.x - particle.position.x) / distance, tmp * (this.position.y - particle.position.y) / distance);
                if (this.radius - distance > this.radius - 2) {
                    particle.velocity.add(vec.normalize().mult(15 * (this.radius / (this.radius - 2))));
                } else {
                    particle.velocity.add(vec);
                }

            }
            return particle;
        }

    }

    document.addEventListener(`mousemove`, e => {
        blackHoles[0].position.x = e.clientX;
        blackHoles[0].position.y = e.clientY;
    });
    const blackHoles = [];
    for (let i = 0; i < 1; i++) {
        blackHoles.push(new BlackHole({
            position: new Vector(Math.random() * w, Math.random() * h),
            radius: w,
            strength: 0.25
        }));
    }

    const particles = [];

    for (let i = 0; i < 750; i++) {
        particles.push(new Particle({
            position: new Vector(Math.random() * w, Math.random() * h),
            velocity: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            color: `white`,
            radius: 1
        }));
    }
    let maxSpeed = -Infinity;
    game();

    function game() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particles.length; i++) {
            for (let j = 0; j < blackHoles.length; j++) {
                blackHoles[j].interact(particles[i]);
            }
            const color = colors[Math.round(particles[i].velocity.length / 30 * colors.length)] || [];
            particles[i].color = `rgb(${color.join(`,`)})`;
            particles[i].move().draw();
            if (particles[i].velocity.length > maxSpeed) {
                maxSpeed = particles[i].velocity.length;
            }
        }
        nextGameStep(game);
    }
});