window.addEventListener('load', function() {
    var how = document.getElementById('how'),
        res = document.getElementById('res'),
        flag = true,
        counter1 = -1,
        counter2 = 0,
        ctrnick = '',
        func;
    how.value = (Math.random() * 5 ^ 0) + 4;
    nickName();

    function nickName() {
        var name = '',
            str1, str2, f, y, fl, ff, q, member = ["a", "e", "i", "o", "u", "y", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"];
        ff = Math.round(Math.random() * 1);
        if (ff == 1) {
            fl = true;
        } else {
            fl = false;
        }
        for (var i = 1; i <= +how.value; i++) {
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
    document.getElementById('clk').addEventListener('click', function() {
            // this.style.background = `linear-gradient(to top left, ${getRndColor()}, ${getRndColor()})`;

        if (+how.value && flag) {
            nickName();
        }
    });
    // document.getElementById('clk').style.background = `linear-gradient(to top left, ${getRndColor()}, ${getRndColor()})`;
    function getRndColor() {
        var a, b = "#",
            color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (var i = 1; i <= 6; i++) {
            a = Math.round(Math.random() * 15);
            b += color[a];
        }
        return b;
    }
});