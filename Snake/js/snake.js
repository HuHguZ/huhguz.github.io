$('document').ready(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var scale = 30;
    var w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        gamew = Math.floor(w / scale),
        gameh = Math.floor(h / scale),
        segmentCount = 0,
        direction,
        key = randomKey(),
        scaleOld,
        begininigColor = 51,
        r = Math.floor(Math.random() * begininigColor),
        g = Math.floor(Math.random() * begininigColor),
        b = Math.floor(Math.random() * begininigColor),
        newColor = 10,
        max = 255,
        min = 20,
        channel = randomBeginingChannel(),
        chanceToChangeChannel = 100,
        oldKey, tick = 0,
        difficulty = 3,
        olDifficulty,
        foodCount = 2,
        counter = 0,
        deathSpeed = scale / 4,
        aion = false,
        settings = false,
        spmod = false,
        death = false,
        cells = {},
        points = [],
        food = [],
        foodColor = [],
        player = [Math.floor(Math.random() * gamew) * scale, Math.floor(Math.random() * gameh) * scale],
        playerColor = [randomColor()],
        size = [scale];
    for (var i = 0; i < foodCount * 2; i += 2) {
        food[i] = Math.floor(Math.random() * gamew) * scale;
        food[i + 1] = Math.floor(Math.random() * gameh) * scale;
    }
    for (var i = 0; i < foodCount; i++) {
        foodColor[i] = color();
    }

    function randomKey() {
        var a = `wasd`;
        return a[Math.random() * a.length ^ 0];
    }

    function color() {
        var a, b = "#",
            color = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (var i = 1; i <= 6; i++) {
            a = Math.round(Math.random() * 15);
            b += color[a];
        }
        return b;
    }

    function randomColor() {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    function randomBeginingChannel() {
        if (r > g && r > b) {
            return 0;
        } else if (g > r && g > b) {
            return 1;
        } else if (b > r && b > g) {
            return 2;
        } else {
            return Math.floor(Math.random() * 3);
        }
    }

    function addChannelColor(d) {
        d += newColor;
        if (d > max) {
            d = max;
            newColor = -newColor;
        }
        if (d < min) {
            d = min;
            newColor = -newColor;
        }
        if (channel === 0) {
            r = d;
        } else if (channel === 1) {
            g = d;
        } else {
            b = d;
        }
        if (d === max || d === min) {
            channel = Math.floor(Math.random() * 3);
        }
        if (Math.floor(Math.random() * chanceToChangeChannel) === 0) {
            channel = Math.floor(Math.random() * 3);
            if (Math.floor(Math.random() * 2) === 1) {
                newColor = -newColor;
            }
        }
        playerColor[playerColor.length] = randomColor();
    }

    function ready() {
        $('.settings').css('transform', 'scale(0,0)');
        $('#canvas').css('opacity', '1');
        begininigColor = +$('#inp1').val();
        newColor = Math.abs($('#inp2').val());
        max = +$('#inp3').val();
        min = +$('#inp4').val();
        channel = +$('#inp5').val();
        if (!(channel >= 0 && channel <= 3)) {
            channel = randomBeginingChannel();
        }
        difficulty = +$('#inp6').val();
        if (difficulty < 1) {
            difficulty = 1;
        }
        scale = +$('#inp8').val();
        if (scale !== scaleOld) {
            if (scale < 1) {
                scale = 1;
            }
            deathSpeed = scale / 4;
            gamew = Math.floor(w / scale);
            gameh = Math.floor(h / scale);
            respawn();
            for (var i = 0; i < foodCount * 2; i += 2) {
                food[i] = Math.floor(Math.random() * gamew) * scale;
                food[i + 1] = Math.floor(Math.random() * gameh) * scale;
            }
        }
        foodCount = +$('#inp7').val();
        if (foodCount < 1) {
            foodCount = 1;
        }
        if (foodCount > gamew * gameh) {
            foodCount = gamew * gameh;
        }
        food = [];
        foodColor = [];
        for (var i = 0; i < foodCount * 2; i += 2) {
            food[i] = Math.floor(Math.random() * gamew) * scale;
            food[i + 1] = Math.floor(Math.random() * gameh) * scale;
        }
        for (var i = 0; i < foodCount; i++) {
            foodColor[i] = color();
        }
        if (($("#inp9").prop("checked"))) {
            aion = true;
        } else {
            aion = false;
        }
        if ($("#inp11").prop("checked")) {
            spmod = true;
        } else {
            spmod = false;
        }
        chanceToChangeChannel = +$('#inp10').val();
        if (chanceToChangeChannel < 0) {
            chanceToChangeChannel = 100;
        }
        begininigColor = checkColor(begininigColor);
        newColor = checkColor(newColor);
        max = checkColor(max);
        min = checkColor(min);
    }

    function animatedDeath() {
        if (death) {
            size[counter] -= deathSpeed;
            player[counter * 2] += deathSpeed / 2;
            player[counter * 2 + 1] += deathSpeed / 2;
            if (size[counter] <= 0) {
                size[counter] = 0;
                counter++;
            }
            if (counter === size.length) {
                death = false;
                respawn();
                counter = 0;
                difficulty = olDifficulty;
            }
        }
    }

    function checkColor(n) {
        if (n < 0) {
            return 0;
        }
        if (n > 255) {
            return 255;
        }
        return n;
    }

    function JSsort(func, a, ...args) {
        let i = -1,
            c = [],
            res;
        let upgrade = (f) => ((...args) => (res = f.apply(this, args), c.push(res), res));
        func = upgrade(func);
        a.sort(func);
        for (let j = 0; j < args.length; j++) {
            args[j].sort(() => (i++, c[i]));
            i = -1;
        }
    }

    function Astar(map, start, end) {
        let open = {},
            current,
            path = [],
            heuristic = (x1, y1, x2, y2) => (((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5),
            getUnvisitedNeighbors = (x, y) => {
                let neighbors = [];
                if (cells[`${x - 1},${y}`] && !cells[`${x - 1},${y}`].visited) {
                    neighbors.push(cells[`${x - 1},${y}`]);
                }
                if (cells[`${x + 1},${y}`] && !cells[`${x + 1},${y}`].visited) {
                    neighbors.push(cells[`${x + 1},${y}`]);
                }
                if (cells[`${x},${y - 1}`] && !cells[`${x},${y - 1}`].visited) {
                    neighbors.push(cells[`${x},${y - 1}`]);
                }
                if (cells[`${x},${y + 1}`] && !cells[`${x},${y + 1}`].visited) {
                    neighbors.push(cells[`${x},${y + 1}`]);
                }
                return neighbors;
            };
        // i = y j = x
        cells = {};
        for (let i = 0; i < gameh; i++) {
            for (let j = 0; j < gamew; j++) {
                if (!map[i][j]) {
                    cells[`${j},${i}`] = {
                        x: j,
                        y: i,
                        visited: 0
                    };
                }
            }
        }
        let str = `${start.x},${start.y}`;
        open[str] = cells[str];
        open[str].g = open[str].h = open[str].f = 0;
        while (1) {
            if (!Object.keys(open).length) {
                return;
            }
            let minprop = Object.keys(open)[0],
                min = open[minprop].f;
            for (var prop in open) {
                if (min >= open[prop].f) {
                    min = open[prop].f;
                    minprop = prop;
                }
            }
            current = open[minprop];
            delete open[minprop];
            current.visited = 1;
            if (current.x == end.x && current.y == end.y) {
                break;
            }
            let neigs = getUnvisitedNeighbors(current.x, current.y);
            for (let i = 0; i < neigs.length; i++) {
                let g = current.g + 10,
                    h = heuristic(neigs[i].x, neigs[i].y, end.x, end.y),
                    f = g + h;
                if (!neigs[i].f || f < neigs[i].f || !open[`${neigs[i].x},${neigs[i].y}`]) {
                    neigs[i].g = g;
                    neigs[i].h = h;
                    neigs[i].f = f;
                    neigs[i].whence = current;
                    if (!open[`${neigs[i].x},${neigs[i].y}`]) {
                        open[`${neigs[i].x},${neigs[i].y}`] = neigs[i];
                    }
                }
            }
        }
        current = cells[`${end.x},${end.y}`];
        while (current) {
            path.push(current);
            current = current.whence;
        }
        return path;
    }

    function aiPlayer() {
        var distances = [],
            ind = [],
            distance, map = [],
            k;
        for (var i = 0; i < foodCount * 2; i += 2) {
            ind.push(distances.length);
            distances[distances.length] = Math.sqrt(Math.pow(player[0] - food[i], 2) + Math.pow(player[1] - food[i + 1], 2));
        }
        JSsort((a, b) => a - b, distances, ind);
        for (var i = 0; i < gameh; i++) {
            map[i] = [];
            for (var j = 0; j < gamew; j++) {
                map[i][j] = 0;
            }
        }
        for (var i = 2; i < player.length - 1; i += 2) {
            if (map[Math.floor(player[i + 1] / scale)]) {
                map[Math.floor(player[i + 1] / scale)][Math.floor(player[i] / scale)] = 1;
            }
        }
        var x = player[0],
            y = player[1];
        segmentMove();
        var a = Astar(map, {
                x: Math.floor(x / scale),
                y: Math.floor(y / scale)
            }, {
                x: Math.floor(food[ind[0] * 2] / scale),
                y: Math.floor(food[ind[0] * 2 + 1] / scale)
            }),
            pos = 1;
        while (!a && ind[pos]) {
            a = Astar(map, {
                x: Math.floor(x / scale),
                y: Math.floor(y / scale)
            }, {
                x: Math.floor(food[ind[pos] * 2] / scale),
                y: Math.floor(food[ind[pos] * 2 + 1] / scale)
            });
            pos++;
        }
        // console.log(player, x / scale, Math.floor(y / scale), Math.floor(food[ind[0] * 2] / scale), Math.floor(food[ind[0] * 2 + 1] / scale), a);
        player[0] = a[a.length - 2].x * scale;
        player[1] = a[a.length - 2].y * scale;
    }

    function move() {
        animatedDeath();
        if (!death) {
            document.onkeypress = function(event) {
                key = event.key;
            }
            if (key === 'Z' || key === 'z' || key === 'Я' || key === 'я') {
                key = 0;
                settings = !settings;
                if (settings) {
                    scaleOld = scale;
                    $('.settings').css('transform', 'scale(1,1)');
                    $('#canvas').css('opacity', '0');
                    $('#inp1').val(begininigColor);
                    $('#inp2').val(newColor);
                    $('#inp3').val(max);
                    $('#inp4').val(min);
                    $('#inp5').val(channel);
                    $('#inp6').val(difficulty);
                    $('#inp7').val(foodCount);
                    $('#inp8').val(scale);
                    $('#inp10').val(chanceToChangeChannel);
                    $('.ready').on('click', function() {
                        if (settings) {
                            settings = !settings;
                        }
                        ready();
                    });
                } else {
                    ready();
                }
            }
            if (!(key === 'w' || key === 'W' || key === 'ц' || key === 'Ц' || key === 's' || key === 'S' || key === 'ы' || key === 'Ы' || key === 'a' || key === 'A' || key === 'ф' || key === 'Ф' || key === 'd' || key === 'D' || key === 'в' || key === 'В') && aion === false) {
                key = oldKey;
            }
            if (((key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') && (oldKey === 's' || oldKey === 'S' || oldKey === 'ы' || oldKey === 'Ы') || (key === 's' || key === 'S' || key === 'ы' || key === 'Ы') && (oldKey === 'w' || oldKey === 'W' || oldKey === 'ц' || oldKey === 'Ц') || (key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') && (oldKey === 'd' || oldKey === 'D' || oldKey === 'в' || oldKey === 'В') || (key === 'd' || key === 'D' || key === 'в' || key === 'В') && (oldKey === 'a' || oldKey === 'A' || oldKey === 'ф' || oldKey === 'Ф')) && segmentCount > 1) {
                key = oldKey;
            }
            if (aion && !death) {
                key = 0;
                aiPlayer();
            }
            if (!aion) {
                segmentMove();
            }
            if (key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
                oldKey = key;
                player[1] -= scale;
                direction = 0;
            }
            if (key === 's' || key === 'S' || key === 'ы' || key === 'Ы') {
                oldKey = key;
                player[1] += scale;
                direction = 2;
            }
            if (key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') {
                oldKey = key;
                player[0] -= scale;
                direction = 3;
            }
            if (key === 'd' || key === 'D' || key === 'в' || key === 'В') {
                oldKey = key;
                player[0] += scale;
                direction = 1;
            }
            if (player[0] > (gamew - 1) * scale) {
                player[0] = 0;
            }
            if (player[0] < 0) {
                player[0] = (gamew - 1) * scale;
            }
            if (player[1] > (gameh - 1) * scale) {
                player[1] = 0;
            }
            if (player[1] < 0) {
                player[1] = (gameh - 1) * scale;
            }
            for (var i = 0; i < foodCount * 2; i += 2) {
                if (player[0] === food[i] && player[1] === food[i + 1]) {
                    points.push(player[0], player[1]);
                    size[size.length] = scale;
                    delete cells[`${player[0] / scale},${player[1] / scale}`];
                    var props = Object.keys(cells);
                    if (props.length) {
                        var rndplc = cells[props[Math.random() * props.length ^ 0]];
                        food[i] = rndplc.x * scale;
                        food[i + 1] = rndplc.y * scale;
                    } else {
                        food[i] = Math.floor(Math.random() * gamew) * scale;
                        food[i + 1] = Math.floor(Math.random() * gameh) * scale;
                    }
                    if (spmod) {
                        playerColor[playerColor.length] = foodColor[i / 2];
                    } else {
                        if (channel === 0) {
                            addChannelColor(r);
                        } else if (channel === 1) {
                            addChannelColor(g);
                        } else {
                            addChannelColor(b);
                        }
                    }
                    foodColor[i / 2] = color();
                }
            }
            for (var i = 2; i <= segmentCount; i += 2) {
                if (player[0] === player[i] && player[1] === player[i + 1]) {
                    death = true;
                    olDifficulty = difficulty;
                    difficulty = 1;
                    points = [];
                }
            }
        }
    }

    function respawn() {
        size.splice(0);
        size[0] = scale;
        player.splice(2);
        segmentCount = 0;
        player[0] = Math.floor(Math.random() * gamew) * scale;
        player[1] = Math.floor(Math.random() * gameh) * scale;
        playerColor.splice(0);
        r = Math.floor(Math.random() * begininigColor);
        g = Math.floor(Math.random() * begininigColor);
        b = Math.floor(Math.random() * begininigColor);
        playerColor[0] = randomColor();
        channel = randomBeginingChannel();
    }

    function segmentMove() {
        for (var i = segmentCount; i > 1; i -= 2) {
            player[i] = player[i - 2];
            player[i + 1] = player[i - 1];
            if (player[i] > (gamew - 1) * scale) {
                player[i] = 0;
            }
            if (player[i] < 0) {
                player[i] = (gamew - 1) * scale;
            }
            if (player[i + 1] > (gameh - 1) * scale) {
                player[i + 1] = 0;
            }
            if (player[i + 1] < 0) {
                player[i + 1] = (gameh - 1) * scale;
            }
        }
    }

    function addsegment() {
        segmentCount += 2;
        if (direction === 1) {
            player[segmentCount] = player[segmentCount - 2] - scale;
            player[segmentCount + 1] = player[segmentCount - 1];
        }
        if (direction === 0) {
            player[segmentCount] = player[segmentCount - 2];
            player[segmentCount + 1] = player[segmentCount - 1] + scale;
        }
        if (direction === 2) {
            player[segmentCount] = player[segmentCount - 2];
            player[segmentCount + 1] = player[segmentCount - 1] - scale;
        }
        if (direction === 3) {
            player[segmentCount] = player[segmentCount - 2] + scale;
            player[segmentCount + 1] = player[segmentCount - 1];
        }
    }

    function drawRect(x, y, w, h, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillRect(x, y, w, h);
        ctx.closePath();
    }

    function game() {
        tick++;
        if (tick % difficulty === 0) {
            ctx.clearRect(0, 0, w, h);
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            gamew = Math.floor(w / scale);
            gameh = Math.floor(h / scale);
            move();
            for (var i = 0; i < points.length; i += 2) {
                if (points[i] === player[player.length - 2] && points[i + 1] === player[player.length - 1]) {
                    addsegment();
                    points.splice(i, 2);
                }
            }
            for (var i = 0; i < foodCount * 2; i += 2) {
                drawRect(food[i], food[i + 1], scale, scale, foodColor[i / 2]);
            }
            drawRect(player[0], player[1], size[0], size[0], playerColor[0]);
            for (var i = 2; i <= segmentCount; i += 2) {
                drawRect(player[i], player[i + 1], size[i / 2], size[i / 2], playerColor[i / 2]);
            }
            for (var i = 0; i <= gameh; i++) {
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(0, i * scale);
                ctx.lineTo(gamew * scale, i * scale);
                ctx.stroke();
                ctx.closePath();
            }
            for (var i = 0; i <= gamew; i++) {
                ctx.beginPath();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.moveTo(i * scale, 0);
                ctx.lineTo(i * scale, gameh * scale);
                ctx.stroke();
                ctx.closePath();
            }
            $('.score').html(segmentCount / 2);
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