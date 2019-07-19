window.addEventListener(`load`, () => {
    const getElem = id => document.getElementById(id),
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

    canvas.style.backgroundColor = `black`;

    const getDistance = (x1, y1, x2, y2) =>((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;

    const getRndColor = () => {
        let a, b = "#",
            color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 1; i <= 6; i++) {
            a = Math.round(Math.random() * 15);
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
            this.x /= this.length();
            this.y /= this.length();
            return this;
        }

        length() {
            return (this.x ** 2 + this.y ** 2) ** 0.5;
        }

        cos(Vector) {
            return (this.x * Vector.x + this.y * Vector.y) / (this.length() * Vector.length());
        }

        add(Vector) {
            this.x += Vector.x;
            this.y += Vector.y;
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

    class Point {

        constructor(x, y, color, radius = 2) {
            this.color = color;
            this.position = new Vector(x, y);
            this.velocity = new Vector(0, 0);
            this.acceleration = new Vector(0, 0);
            this.radius = radius;
        }

        move() {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            const limit = 8;
            if (this.velocity.x >= limit) {
                this.velocity.x = limit;
            }
            if (this.velocity.y >= limit) {
                this.velocity.y = limit;
            }
            if (this.velocity.x <= -limit) {
                this.velocity.x = -limit;
            }
            if (this.velocity.y <= -limit) {
                this.velocity.y = -limit;
            }
            return this;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
            return this;
        }

    }

    class Line {
        constructor({x1, y1, x2, y2, color, acceleration1, acceleration2, width} = {}) {
            this.color = color;
            this.width = width;
            this.p1 = new Vector(x1, y1);
            this.p2 = new Vector(x2, y2);
            this.velocity1 = new Vector(0, 0);
            this.velocity2 = new Vector(0, 0);
            this.acceleration1 = acceleration1;
            this.acceleration2 = acceleration2;
        }

        draw() {
            ctx.beginPath();
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p2.x, this.p2.y);
            ctx.stroke();
            return this;
        }

        move() {
            this.p1.add(this.velocity1);
            this.p2.add(this.velocity2);
            this.velocity1.add(this.acceleration1);
            this.velocity2.add(this.acceleration2);
            return this;
        }

    }

    const getAddbtr = (max, min) => Math.random() * (max - min) + min;

    const getRandomBool = () => !!Math.round(Math.random());

    const colorObj = {
        rgb: [
            Math.random() * 256 ^ 0, 
            Math.random() * 256 ^ 0, 
            Math.random() * 256 ^ 0
        ],
        channel: Math.random() * 3 ^ 0,
        velocity: 5,
        add: true,
        getColor() {
            if (this.add) {
                this.rgb[this.channel] += this.velocity;
                this.velocity += 10;
            } else {
                this.rgb[this.channel] -= this.velocity;
                this.velocity -= 10;
            }
            if (this.rgb[this.channel] > 255) {
                this.channel = Math.random() * 3 ^ 0;
                this.add = !this.add;
                this.rgb[this.channel] = 255;
            }
            if (this.rgb[this.channel] < 0) {
                this.channel = Math.random() * 3 ^ 0;
                this.add = !this.add;
                this.rgb[this.channel] = 0;
            }
            return `rgb(${this.rgb.join(`,`)})`;
        }
    }
    console.log(colorObj);
    const lines = [];
    setInterval(() => {
       for (let i = 0; i < Math.random() * 2500+20; i++) {
            const coef = Math.random() + 1;
            const acceleration1 = new Vector(getRandomBool() ? getAddbtr(0.7, 0.01) : getAddbtr(-.01, -.7), getRandomBool() ? getAddbtr(0.7, 0.01) : getAddbtr(-.01, -.7));
            acceleration1.x *= 0.3;
            acceleration1.y *= 0.3;
            const acceleration2 = new Vector(acceleration1.x * coef, acceleration1.y * coef);
            lines.push(new Line({
                x1: w / 2,
                x2: w / 2,
                y1: h / 2,
                y2: h / 2,
                color: colorObj.getColor() || `white`, //getRndColor()
                width: 3,
                acceleration1,
                acceleration2
            }));
        } 
    }, 100);
    // const mainPoint = new Vector(w / 2, h / 2);
    // let points = [];
    // setInterval(() => {
    //     for (let i = 0; i < 10; i++) {
    //         const center = new Point(mainPoint.x, mainPoint.y, getRndColor(), 2);
    //         center.acceleration.x = Math.random() - .5;
    //         center.acceleration.y = Math.random() - .5;
    //         points.push(center);
    //     }
    // }, 50);
    // canvas.addEventListener(`click`, e => {
    //     let mainPoint = {};
    //     mainPoint.x = e.clientX;
    //     mainPoint.y = e.clientY;
    //     for (let i = 0; i < 200; i++) {
    //         const center = new Point(mainPoint.x, mainPoint.y, getRndColor(), 2);
    //         center.acceleration.x = Math.random() - .5;
    //         center.acceleration.y = Math.random() - .5;
    //         points.push(center);
    //     }
    // });
    // let x = -h / 2;
    game();
    function game() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < lines.length; i++) {
            lines[i].draw().move();
            if (
                (lines[i].p1.x >= w || 
                lines[i].p1.x <= 0) &&
                (lines[i].p2.x >= w || 
                lines[i].p2.x <= 0)  
            ) {
                lines.splice(i, 1);
                i--;
            }
            if (i < 0) {
                continue;
            }
            if (
                (lines[i].p1.y >= h || 
                lines[i].p1.y <= 0) &&
                (lines[i].p2.y >= h || 
                lines[i].p2.y <= 0)  
            ) {
                lines.splice(i, 1);
                i--;
            }
        }
        // console.log(ln);
        // mainPoint.x = w / 2 + 550 * Math.cos(x * Math.PI / 180);
        // mainPoint.y = h / 2 + 300 * Math.sin(x * Math.PI / 180);
        // x += 1;
        // for (let i = 0; i < points.length; i++) {
        //     points[i].move().draw();
        // }
        // for (let i = 0; i < points.length; i++) {
        //     const point = points[i];
        //     if (!point) {
        //         console.log('почему-то пусто');
        //         continue;
        //     }
        //     if (
        //         point.position.x + point.radius >= w || 
        //         point.position.x - point.radius <= 0 
                
        //     ) {
        //         // point.acceleration.x *= -1;
        //         // point.velocity.x *= -1;
        //         points.splice(i, 1);
        //         i--;
        //     }

        //     if (
        //         point.position.y + point.radius >= h || 
        //         point.position.y - point.radius <= 0
        //     ) {
        //         // point.acceleration.y *= -1;
        //         // point.velocity.y *= -1;
        //         points.splice(i, 1);
        //         i--;
        //     }
        // }
        nextGameStep(game);
    }
});