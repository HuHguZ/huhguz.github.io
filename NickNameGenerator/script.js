window.addEventListener('load', function() {
    var how = document.getElementById('how'),
        res = document.getElementById('res'),
        clk = document.getElementById('clk'),
        flag = true,
        counter1 = -1,
        counter2 = 0,
        ctrnick = '',
        colors = {
            rgb1: [Math.random() * 256 ^ 0, Math.random() * 256 ^ 0, Math.random() * 256 ^ 0],
            rgb2: [Math.random() * 256 ^ 0, Math.random() * 256 ^ 0, Math.random() * 256 ^ 0],
            c1: Math.random() * 3 ^ 0,
            c2: Math.random() * 3 ^ 0,
            mul1: 1,
            mul2: 1,
            rndrgb: function(array, channel, multiplier) {
                array[channel] += multiplier;
            },
            randomize: function() {
                this.rndrgb(this.rgb1, this.c1, this.mul1);
                this.rndrgb(this.rgb2, this.c2, this.mul2);
                for (var i = 1; i < 3; i++) {
                    if (this[`rgb${i}`][this[`c${i}`]] > 255) {
                        this[`c${i}`] = Math.random() * 3 ^ 0;
                        this[`mul${i}`] *= -1;
                    } else if (this[`rgb${i}`][this[`c${i}`]] < 0) {
                        this[`c${i}`] = Math.random() * 3 ^ 0;
                        this[`mul${i}`] *= -1;
                    }
                }
            }
        },
        func;
    how.value = (Math.random() * 5 ^ 0) + 4;
    nickName();

    function nickName() {
        var name = '',
            str1, str2, f, y, fl, ff, q, member = ["a", "e", "i", "o", "u", "y", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"],
            counter = +how.value;
        ff = Math.round(Math.random() * 1);
        if (ff == 1) {
            fl = true;
        } else {
            fl = false;
        }
        for (var i = 1; i <= counter; i++) {
            if ((Math.random() * 20 ^ 0) < 3) {
                fl = !fl;
            }
            if (fl) {
                fl = !fl;
                q = member[Math.round(Math.random() * 5)];
                name += q;
            } else {
                fl = !fl;
                q = member[Math.round(Math.random() * (member.length - 1 - 6) + 6)];
                name += q;
                y = Math.round(Math.random() * 18);
                if (y >= 0 && y <= 1) {
                    name += q;
                    i++;
                    f = true;
                }
            }
            if (i <= 2) {
                if (f) {
                    name = name[0].toUpperCase() + name[0];
                    f = false;
                } else if (i == 1) {
                    name = name[0].toUpperCase();
                }
            }
            y = Math.round(Math.random() * 36);
            if (y >= 0 && y <= 1) {
                str1 = name.substring(0, i - 1);
                str2 = name[i - 1].toUpperCase();
                name = str1 + str2;
            }
        }
        flag = false;
        func = setInterval(function() {
            if (counter1 > name.length - 2) {
                res.textContent = res.textContent + member[Math.random() * member.length ^ 0];
                res.textContent = res.textContent.slice(0, -1);
            } else {
                res.textContent = ctrnick + member[Math.random() * member.length ^ 0];
            }
            if (counter1 > name.length - 1) {
                res.textContent = res.textContent.slice(0, -1) + name[name.length - 1];
                clearInterval(func);
                ctrnick = '';
                counter1 = -1;
                counter2 = 0;
                flag = true;
            }
            counter2++;
            if (counter2 > 50) {
                counter1++;
                ctrnick += name[counter1];
                counter2 = 0;
            }
        }, 1);
    }
    clk.addEventListener('click', function() {
        if (+how.value && flag) {
            nickName();
        }
    });

    function getRndColor() {
        var a, b = "#",
            color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (var i = 1; i <= 6; i++) {
            a = Math.round(Math.random() * 15);
            b += color[a];
        }
        return b;
    }
    setInterval(function() {
        colors.randomize();
        clk.style.background = `linear-gradient(to top left, rgb(${colors.rgb1[0]}, ${colors.rgb1[1]}, ${colors.rgb1[2]}), rgb(${colors.rgb2[0]}, ${colors.rgb2[1]}, ${colors.rgb2[2]}))`;
    }, 10);
});