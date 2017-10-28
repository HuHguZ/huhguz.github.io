$('document').ready(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        canvas2 = document.getElementById('canvas2'),
        ctx2 = canvas2.getContext('2d'),
        canvas3 = document.getElementById('canvas3'),
        ctx3 = canvas3.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        key, tick = 0,
        x1 = 0,
        y1 = 0,
        messageCount = 0,
        foodcount = 100,
        speedOfAttOfFood = 1.5,
        foodr = 5,
        maxr, rspeed = 0.5,
        scale = 3,
        mbc, dr = 7,
        stepCount = 120,
        fdd = 20,
        botCount = 5,
        set = true,
        canPlay = true,
        playerBot = false,
        canEat = 1.2,
        elements = [true, true, true, true],
        maz = 40,
        razt = 200,
        decreaseSpeed = 1,
        player = new Bot(Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), dr, 2, 2, 'HuHguZ', 2, 2, '#ff0000', '#990000', Math.round(Math.random() * 2), 0, 0, Math.round(Math.random() * mbc), stepCount, Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), false),
        bots = [],
        food = [],
        foodcolor = [],
        chance = [0, 7, 8, 5000, 5001, 5002];
    // chance = [0, 7, 8, 15, 16, 23];
    mbc = chance[chance.length - 1];
    canvas3.width = 220;
    canvas3.height = 300;

    function Bot(x, y, r, xspeed, yspeed, name, defaultXspeed, defaultYspeed, circleColor, strokeColor, typeOfMoyion, kills, deaths, currentMotion, step, rndX, rndY, crazyMod) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.xspeed = xspeed;
        this.yspeed = yspeed;
        this.name = name;
        this.defaultXspeed = defaultXspeed;
        this.defaultYspeed = defaultYspeed;
        this.circleColor = circleColor;
        this.strokeColor = strokeColor;
        this.typeOfMoyion = typeOfMoyion;
        this.currentMotion = currentMotion;
        this.step = step;
        this.kills = kills;
        this.deaths = deaths;
        this.rndX = rndX;
        this.rndY = rndY;
        this.crazyMod = crazyMod;
    }
    for (var i = 0; i < botCount; i++) {
        bots[i] = new Bot(Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), dr, 2, 2, generateName(), 2, 2, color(), color(), Math.round(Math.random() * 2), 0, 0, Math.round(Math.random() * mbc), stepCount, Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), false);
    }
    maxr = Math.round(Math.sqrt((0.1 * w * h * scale) / Math.PI));
    ctx.scale(4.5, 4.5);
    ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
    ctx.translate(-(520 * w * 0.00075), -(520 * h * 0.00075));
    var def = [player.circleColor, player.strokeColor, player.name, player.defaultXspeed, player.defaultYspeed, '', foodcount, foodr, maxr, dr, rspeed, scale, fdd, maz, decreaseSpeed, bots.length, speedOfAttOfFood, canEat];
    var chancedef = [];
    for (var i = 0; i < chance.length; i++) {
        chancedef[i] = chance[i];
    }
    genFood();

    function drawobj(obj) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2, false);
        ctx.fillStyle = obj.circleColor;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.lineWidth = Math.round(0.02 * obj.r);
        ctx.strokeStyle = obj.strokeColor;
        ctx.stroke();
        ctx.fillStyle = obj.strokeColor;
        ctx.textAlign = "center";
        ctx.font = "normal " + (obj.r * 0.3) + "px Code Pro";
        ctx.fillText("" + obj.name + "", obj.x, obj.y);
        ctx.fillText("" + obj.r + "", obj.x, (obj.r * 0.3) + obj.y);
        ctx.closePath();
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

    function genFood() {
        for (var i = 0; i < foodcount * 2; i += 2) {
            foodCoords(food, player, i);
        }
        for (var i = 0; i < foodcount * 3; i++) {
            if (i == 0 || i % 2 == 0) {
                foodcolor[i] = Math.round(Math.random() * 255);
            } else if (i % 3 == 0) {
                foodcolor[i] = Math.round(Math.random() * 255);
            } else {
                foodcolor[i] = Math.round(Math.random() * 255);
            }
        }
    }

    function randomRspeed() {
        var b, a = (Math.random() * 10).toFixed(2);
        b = a - Math.floor(a);
        a = Math.floor(a);
        if (b > 0.75) {
            b = 0.75;
        } else if (b > 0.5) {
            b = 0.5;
        } else if (b > 0.25) {
            b = 0.25;
        } else {
            b = 0;
        }
        a += b;
        return a;
    }

    function movePlayer(pl) {
        document.onkeypress = function(event) {
            key = event.key;
        }
        ctx.translate((pl.x - w / 2), (pl.y - h / 2));
        if (!playerBot) {
            var xMotion = pl.xspeed * ((x1 - pl.x) / getDistance(x1, y1, pl.x, pl.y)),
                yMotion = pl.yspeed * ((y1 - pl.y) / getDistance(x1, y1, pl.x, pl.y));
            pl.x += xMotion;
            pl.y += yMotion;
            x1 += xMotion;
            y1 += yMotion;
        }
        if (canPlay) {
            if (key === 't' || key === 'T' || key === 'е' || key === 'Е' || key === 'ArrowUp') {
                ctx.translate(0, pl.defaultYspeed);
            } else if (key === 'f' || key === 'F' || key === 'а' || key === 'А' || key === 'ArrowLeft') {
                ctx.translate(pl.defaultXspeed, 0);
            } else if (key === 'g' || key === 'G' || key === 'п' || key === 'П' || key === 'ArrowDown') {
                ctx.translate(0, -pl.defaultYspeed);
            } else if (key === 'h' || key === 'H' || key === 'р' || key === 'Р' || key === 'ArrowRight') {
                ctx.translate(-pl.defaultXspeed, 0);
            } else if (key === '`' || key === '~' || key === 'Ё' || key === 'ё') {
                if (set) {
                    if (player.r > dr) {
                        player.r = Math.round(0.7 * player.r);
                        $(".settings").css("opacity", "1");
                        $(".settings").css("transform", "scale(1, 1)");
                        $("#canvas").css("opacity", "0");
                        $("#canvas3").css("opacity", "0");
                        $('#canvas3').css("transform", "scale(0, 0)");
                        $('#canvas2').css("opacity", "0");
                        $('#canvas2').css("transform", "scale(0, 0)");
                        $('.tab').css("transform", "scale(0, 0)");
                        $('.tab').css("opacity", "0");
                        $('.chat').css('opacity', '0');
                        $('.chat').css("transform", "scale(0, 0)");
                        set = false;
                        $("#color1").val(player.circleColor);
                        $("#color2").val(player.strokeColor);
                        $("#name").val(player.name);
                        $("#xspeed").val(player.defaultXspeed);
                        $("#yspeed").val(player.defaultYspeed);
                        $("#botspeed").val();
                        $("#botsCount").val(bots.length);
                        $("#food").val(foodcount);
                        $("#food2").val(foodr);
                        $("#dist").val(fdd);
                        $("#sp").val(speedOfAttOfFood);
                        $("#maxr").val(maxr);
                        $("#rspeed").val(rspeed);
                        $("#canEat").val(canEat);
                        $("#decreaseSpeed").val(decreaseSpeed);
                        $("#scale").val(scale);
                        $("#maz").val(maz);
                        $("#dr").val(dr);
                        document.getElementById('crazy').checked = player.crazyMod;
                        document.getElementById('playerBot').checked = playerBot;
                        $('.default').on('click', function() {
                            $("#color1").val(def[0]);
                            $("#color2").val(def[1]);
                            $("#name").val(def[2]);
                            $("#xspeed").val(def[3]);
                            $("#yspeed").val(def[4]);
                            $("#botspeed").val(def[5]);
                            $("#botsCount").val(def[15]);
                            $("#food").val(def[6]);
                            $("#food2").val(def[7]);
                            $("#maxr").val(def[8]);
                            $("#rspeed").val(def[10]);
                            $("#decreaseSpeed").val(def[14]);
                            $("#scale").val(def[11]);
                            $("#dr").val(def[9]);
                            $("#dist").val(def[12]);
                            $("#sp").val(def[16]);
                            $("#maz").val(def[13]);
                            $("#canEat").val(def[17]);
                        });
                        $('.random').on('click', function() {
                            $("#color1").val(color());
                            $("#color2").val(color());
                            player.name = generateName();
                            $("#name").val(player.name);
                            $("#xspeed").val((Math.random() * 10).toFixed(2));
                            $("#yspeed").val((Math.random() * 10).toFixed(2));
                            $("#botspeed").val((Math.random() * 10).toFixed(2));
                            $("#botsCount").val(Math.round(Math.random() * 500));
                            $("#food").val(Math.round(Math.random() * 400));
                            $("#food2").val(Math.round(Math.random() * 10));
                            $("#dist").val(Math.round(Math.random() * 200));
                            $("#sp").val((Math.random() * 20).toFixed(3));
                            $("#rspeed").val(randomRspeed());
                            $("#canEat").val((Math.random() * 20).toFixed(3));
                            $("#decreaseSpeed").val((Math.random() * 60).toFixed(2));
                            $("#scale").val((Math.random() * 7).toFixed(2));
                            $("#maz").val(Math.round(Math.random() * 200));
                            $("#dr").val(Math.round(Math.random() * 10));
                            $("#maxr").val(Math.round(Math.random() * Math.sqrt((0.2 * w * h * parseFloat($("#scale").val())) / Math.PI)));
                            document.getElementById('crazy').checked = !!Math.floor(Math.random() * 2);
                            document.getElementById('playerBot').checked = !!Math.floor(Math.random() * 2);
                        });
                        $('.bots').on('click', function() {
                            $(".settings").css("opacity", "0");
                            $(".settings").css("transform", "scale(0, 0)");
                            $(".botsettings").css("opacity", "1");
                            $(".botsettings").css("transform", "scale(1, 1)");
                            $("#stepcount").val(stepCount);
                            $("#razt").val(razt);
                            for (var i = 0; i < chance.length; i++) {
                                $("#chance" + i + "").val(chance[i]);
                            }
                            for (var i = 0; i < chance.length; i += 2) {
                                $(".chance" + i / 2 + "").html("[" + chance[i] + ";" + chance[i + 1] + "]");
                            }
                            mbc = parseInt($("#chance5").val());
                            for (var i = 0; i < chance.length; i += 2) {
                                if (parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) == 0) {
                                    $(".chan" + i / 2 + "").html("" + (1 / mbc * 100).toFixed(2) + "%");
                                } else {
                                    $(".chan" + i / 2 + "").html("" + ((parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) + 1) / mbc * 100).toFixed(2) + "%");
                                }
                            }
                            $("#chance0").on('keyup', function() {
                                $("#chance1").val(1 + parseInt($("#chance0").val()));
                            });
                            $("#chance1").on('keyup', function() {
                                $("#chance2").val(1 + parseInt($("#chance1").val()));
                            });
                            $("#chance2").on('keyup', function() {
                                $("#chance3").val(1 + parseInt($("#chance2").val()));
                            });
                            $("#chance3").on('keyup', function() {
                                $("#chance4").val(1 + parseInt($("#chance3").val()));
                            });
                            $("#chance4").on('keyup', function() {
                                $("#chance5").val(1 + parseInt($("#chance4").val()));
                            });
                            $('.def').on('click', function() {
                                for (var i = 0; i < chance.length; i++) {
                                    $("#chance" + i + "").val(chancedef[i]);
                                }
                                for (var i = 1; i < chance.length; i += 2) {
                                    if (i > 2) {
                                        $("#chance" + (i - 1) + "").val(1 + parseInt($("#chance" + (i - 2) + "").val()));
                                    }
                                }
                                for (var i = 0; i < chance.length; i += 2) {
                                    $(".chance" + i / 2 + "").html("[" + parseInt($("#chance" + (i) + "").val()) + ";" + parseInt($("#chance" + (i + 1) + "").val()) + "]");
                                }
                                mbc = parseInt($("#chance5").val());
                                for (var i = 0; i < chance.length; i += 2) {
                                    if (parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) == 0) {
                                        $(".chan" + i / 2 + "").html("" + (1 / mbc * 100).toFixed(2) + "%");
                                    } else {
                                        $(".chan" + i / 2 + "").html("" + ((parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) + 1) / mbc * 100).toFixed(2) + "%");
                                    }
                                }
                            });
                            $('.restart').on('click', function() {
                                for (var i = 0; i < bots.length; i++) {
                                    respawn(bots[i]);
                                }
                            });
                            $('.rnd').on('click', function() {
                                $("#stepcount").val(Math.round(Math.random() * 500));
                                $("#razt").val(Math.round(Math.random() * 500));
                                for (var i = 1; i < chance.length; i += 2) {
                                    if (i > 2) {
                                        $("#chance" + (i - 1) + "").val(1 + parseInt($("#chance" + (i - 2) + "").val()));
                                    }
                                    $("#chance" + i + "").val(Math.round(Math.random() * (100 + parseInt($("#chance" + (i - 1) + "").val()) - parseInt($("#chance" + (i - 1) + "").val())) + parseInt($("#chance" + (i - 1) + "").val())));
                                }
                                mbc = parseInt($("#chance5").val());
                                for (var i = 0; i < chance.length; i += 2) {
                                    $(".chance" + i / 2 + "").html("[" + parseInt($("#chance" + (i) + "").val()) + ";" + parseInt($("#chance" + (i + 1) + "").val()) + "]");
                                }
                                for (var i = 0; i < chance.length; i += 2) {
                                    if (parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) == 0) {
                                        $(".chan" + i / 2 + "").html("" + (1 / mbc * 100).toFixed(2) + "%");
                                    } else {
                                        $(".chan" + i / 2 + "").html("" + ((parseInt($("#chance" + (i + 1) + "").val()) - parseInt($("#chance" + (i) + "").val()) + 1) / mbc * 100).toFixed(2) + "%");
                                    }
                                }
                            });
                            showStats();

                            function setStats(n) {
                                if (bots.length) {
                                    bots[n].name = $('#botname').val();
                                    bots[n].circleColor = $('#botCir').val();
                                    bots[n].strokeColor = $('#botStroke').val();
                                    bots[n].defaultXspeed = +$('#botXsp').val();
                                    bots[n].defaultYspeed = +$('#botYsp').val();
                                    bots[n].crazyMod = document.getElementById('botCrazy').checked;
                                }
                            }

                            function showStats() {
                                var n = +$('#list').val();
                                if (bots.length) {
                                    $('#botname').val(bots[n].name);
                                    $('#botCir').val(bots[n].circleColor);
                                    $('#botStroke').val(bots[n].strokeColor);
                                    $('#botXsp').val(bots[n].defaultXspeed);
                                    $('#botYsp').val(bots[n].defaultYspeed);
                                    document.getElementById('botCrazy').checked = bots[n].crazyMod;
                                }
                            }
                            $('#list').on('change click', function() {
                                if (+$('#list').val() < 0) {
                                    $('#list').val(0);
                                } else if (+$('#list').val() >= bots.length) {
                                    $('#list').val(bots.length - 1);
                                }
                                showStats();
                            });
                            $('#random').on('click', function() {
                                if (bots.length) {
                                    $('#botname').val(generateName());
                                    $('#botCir').val(color());
                                    $('#botStroke').val(color());
                                    $('#botXsp').val((Math.random() * 20).toFixed(3));
                                    $('#botYsp').val((Math.random() * 20).toFixed(3));
                                    document.getElementById('botCrazy').checked = !!Math.floor(Math.random() * 2);
                                }
                            });
                            $('#saveAll').on('click', function() {
                                for (var i = 0; i < bots.length; i++) {
                                    setStats(i);
                                }
                            });
                            $('#save').on('click', function() {
                                setStats(+$('#list').val());
                            });
                            $('.ready').on('click', function() {
                                $(".botsettings").css("opacity", "0");
                                $(".botsettings").css("transform", "scale(0, 0)");
                                stepCount = parseInt($("#stepcount").val());
                                razt = parseInt($("#razt").val());
                                for (var i = 0; i < chance.length; i++) {
                                    chance[i] = parseInt($("#chance" + i + "").val());
                                }
                                mbc = chance[chance.length - 1];
                                if (!set) {
                                    $(".settings").css("opacity", "1");
                                    $(".settings").css("transform", "scale(1, 1)");
                                }
                            });
                        });
                    }
                } else {
                    $(".settings").css("opacity", "0");
                    $(".settings").css("transform", "scale(0, 0)");
                    $("#canvas").css("opacity", "1");
                    if (elements[3]) {
                        $('#canvas2').css("opacity", ".7");
                        $('#canvas2').css("transform", "scale(1, 1)");
                    }
                    if (elements[2]) {
                        $("#canvas3").css("opacity", "1");
                        $('#canvas3').css("transform", "scale(1, 1)");
                    }
                    if (elements[0]) {
                        $('.chat').css('opacity', '1');
                        $('.chat').css("transform", "scale(1, 1)");
                    }
                    set = true;
                    player.circleColor = $("#color1").val();
                    player.strokeColor = $("#color2").val();
                    player.name = $("#name").val();
                    player.defaultXspeed = parseFloat($("#xspeed").val());
                    player.defaultYspeed = parseFloat($("#yspeed").val());
                    player.crazyMod = document.getElementById('crazy').checked;
                    playerBot = document.getElementById('playerBot').checked;
                    if (+$("#botsCount").val() > bots.length) {
                        for (var i = bots.length; i < +$("#botsCount").val(); i++) {
                            bots[i] = new Bot(Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), dr, 2, 2, generateName(), 2, 2, color(), color(), Math.round(Math.random() * 2), 0, 0, Math.round(Math.random() * mbc), stepCount, Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), false);
                        }
                        table();
                    } else if (+$("#botsCount").val() < bots.length) {
                        if (+$("#botsCount").val() <= 0) {
                            bots.splice(0, bots.length);
                        } else {
                            bots.splice(+$("#botsCount").val(), bots.length);
                        }
                        table();
                    }
                    foodcount = parseFloat($("#food").val());
                    foodr = parseFloat($("#food2").val());
                    maxr = parseFloat($("#maxr").val());
                    rspeed = parseFloat($("#rspeed").val());
                    canEat = parseFloat($("#canEat").val());
                    decreaseSpeed = parseFloat($("#decreaseSpeed").val());
                    scale = parseFloat($("#scale").val());
                    maz = parseInt($("#maz").val());
                    dr = parseFloat($("#dr").val());
                    fdd = parseFloat($("#dist").val());
                    speedOfAttOfFood = parseFloat($("#sp").val());
                    genFood();
                    speed(player);
                    if ($("#botspeed").val()) {
                        for (var i = 0; i < bots.length; i++) {
                            bots[i].defaultXspeed = parseFloat($("#botspeed").val());
                            bots[i].defaultYspeed = parseFloat($("#botspeed").val());
                        }
                    }
                }
            } else if ((key === '1' || key === '!') && set) {
                if (elements[1]) {
                    $('.tab').css("transform", "scale(1, 1)");
                    $('.tab').css("opacity", "1");
                } else {
                    $('.tab').css("transform", "scale(0, 0)");
                    $('.tab').css("opacity", "0");
                }
                elements[1] = !elements[1];
            } else if ((key === 'q' || key === 'Q' || key === 'й' || key === 'Й') && set) {
                if (elements[3]) {
                    $('#canvas2').css("opacity", "0");
                    $('#canvas2').css("transform", "scale(0, 0)");
                } else {
                    $('#canvas2').css("opacity", ".7");
                    $('#canvas2').css("transform", "scale(1, 1)");
                }
                elements[3] = !elements[3];
            } else if ((key === '2' || key === '@' || key === '"') && set) {
                if (elements[0]) {
                    $('.chat').css('opacity', '0');
                    $('.chat').css("transform", "scale(0, 0)");
                } else {
                    $('.chat').css('opacity', '1');
                    $('.chat').css("transform", "scale(1, 1)");
                }
                elements[0] = !elements[0];
            } else if ((key === '3' || key === '#' || key === '№') && set) {
                if (elements[2]) {
                    $("#canvas3").css("opacity", "0");
                    $('#canvas3').css("transform", "scale(0, 0)");
                } else {
                    $("#canvas3").css("opacity", "1");
                    $('#canvas3').css("transform", "scale(1, 1)");
                }
                elements[2] = !elements[2];
            }
            key = 0;
        }
        checkCoords();
        ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
    }

    document.onmousemove = function(e) {
        var x = e.offsetX,
            y = e.offsetY;
        x1 = e.clientX + (player.x - w / 2);
        y1 = e.clientY + (player.y - h / 2);
        if (y <= document.getElementsByClassName('chat')[0].offsetHeight && x <= document.getElementsByClassName('chat')[0].offsetWidth && +$('.chat').css('opacity')) {
            canPlay = false;
            key = 0;
        } else {
            canPlay = true;
        }
    }

    $('#send').on('click', function() {
        checkMessage();
        if ($('#playermessage').val() !== '') {
            $('.msg').append('<div class="message"><span style="color:' + player.circleColor + '">' + player.name + ': </span>' + $('#playermessage').val() + '</div>');
            messageCount++;
        }
    });

    function checkCoords() {
        if (player.x >= scale * w - player.r) {
            player.x = scale * w - player.r;
        } else if (player.x <= player.r) {
            player.x = player.r;
        }
        if (player.y >= scale * h - player.r) {
            player.y = scale * h - player.r;
        } else if (player.y <= player.r) {
            player.y = player.r;
        }
    }

    function checkMessage() {
        if (document.getElementsByClassName('msg')[0].offsetHeight >= document.getElementsByClassName('chat')[0].offsetHeight) {
            $('.msg').html('');
            messageCount = 0;
        }
    }

    function drawFood(fd, fdcl) {
        for (var i = 0; i < foodcount * 2; i += 2) {
            ctx.beginPath();
            ctx.arc(fd[i], fd[i + 1], foodr, 0, Math.PI * 2, false);
            ctx.fillStyle = "rgb(" + fdcl[i] + ", " + fdcl[i + 1] + ", " + fdcl[i + 2] + ")";
            ctx.fill();
            ctx.closePath();
        }
    }

    function table() {
        var names = [],
            kills = [],
            deaths = [],
            k;
        for (var i = 0; i < bots.length; i++) {
            names.push(bots[i].name);
            kills.push(bots[i].kills);
            deaths.push(bots[i].deaths);
        }
        names.push(player.name);
        kills.push(player.kills);
        deaths.push(player.deaths);
        for (var i = 0; i < kills.length; i++) {
            for (var j = 0; j < kills.length - i; j++) {
                if (kills[j] < kills[j + 1]) {
                    k = kills[j];
                    kills[j] = kills[j + 1];
                    kills[j + 1] = k;
                    k = names[j];
                    names[j] = names[j + 1];
                    names[j + 1] = k;
                    k = deaths[j];
                    deaths[j] = deaths[j + 1];
                    deaths[j + 1] = k;
                }
            }
        }
        for (var i = 0; i < bots.length + 1; i++) {
            $('#name' + i + '').html(names[i]);
            $('#kills' + i + '').html(kills[i]);
            $('#deaths' + i + '').html(deaths[i]);
            $('#kpd' + i + '').html(kpd(kills[i], deaths[i]));
        }
    }

    function kpd(number1, number2) {
        if (number2 === 0 && number1 !== 0) {
            return (number1).toFixed(2);
        } else if (number1 === 0 && number2 === 0) {
            return '-';
        }
        return (number1 / number2).toFixed(2);
    }
    table();

    function foodCoords(fd, ent, i) {
        fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
        fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
        while ((fd[i] >= ent.x - ent.r && fd[i] <= ent.x + ent.r && fd[i + 1] >= ent.y - ent.r && fd[i + 1] <= ent.y + ent.r) || (foodGenerate(fd, ent, 1, i) || foodGenerate(fd, ent, 2, i) || foodGenerate(fd, ent, 3, i) || foodGenerate(fd, ent, 4, i))) {
            fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
            fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
        }
    }

    function foodGenerate(fd, ent, angle, i) {
        var distance;
        if (angle == 1) {
            distance = Math.sqrt((fd[i] - w * scale) * (fd[i] - w * scale) + (fd[i + 1] - h * scale) * (fd[i + 1] - h * scale)) + 50;
            if (distance < foodr + maxr) {
                return true;
            } else {
                return false;
            }
        } else if (angle == 2) {
            distance = Math.sqrt((fd[i]) * (fd[i]) + (fd[i + 1] - h * scale) * (fd[i + 1] - h * scale)) + 50;
            if (distance < foodr + maxr) {
                return true;
            } else {
                return false;
            }
        } else if (angle == 3) {
            distance = Math.sqrt((fd[i]) * (fd[i]) + (fd[i + 1]) * (fd[i + 1])) + 50;
            if (distance < foodr + maxr) {
                return true;
            } else {
                return false;
            }
        } else if (angle == 4) {
            distance = Math.sqrt((fd[i] - w * scale) * (fd[i] - w * scale) + (fd[i + 1]) * (fd[i + 1])) + 50;
            if (distance < foodr + maxr) {
                return true;
            } else {
                return false;
            }
        }
    }

    function JSsort(a) {
        function sort(a, b) {
            return a - b;
        }
        return a.sort(sort);
    }

    function getDistance(x1, y1, x2, y2) {
        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
    }

    function generateName() {
        var name, names = ['Jacob', 'Michael', 'Joshua', 'Matthew', 'HuHguZ', 'Foxy', 'Ethan', 'mQ', 'MamBa', 'KyKyPy3a', 'Ceme4ka', 'CmeTanKa', 'Nessa', 'Lemon4ik', 'W1zarD', 'Agressor', 'Noob', 'Fuck', 'NeZoX', 'KoTuk', 'LIJyXeP', 'GreeM', 'PloHish', 'Miwka', 'smailik', 'Bonifacy', 'Бублик', 'Karapuz', 'Whisper', 'Krit', 'AgreSir', 'D-man', 'IWUBIT', 'IWUFIK', 'maD', 'NoNeTam', 'RGOGUCI', 'poncheg', 'Last_ik', 'Kitch', 'Kiss', 'SilverName', 'Iner', 'Штаны', 'Даун', 'AdreN', 'Fucker', 'Faker', 'Hero', 'Happy', 'Super', 'Moon', 'Edward', 'Eeoneguy', 'Alexis', 'Соскевич', 'Freed', 'Cow', 'Крыс', '.mQ!', 'ExC!uT*', 'Scream', 'Bot_pro', 'Sisi', 'Ваня', 'Игорь', 'Максим', 'Илья', 'Zimmer', 'Грешник', '=GLuk=', 'Stalker', 'МАЖОР', 'Hapkomuk', 'Winner', 'Di11er', 'Лирик', 'Пушкин', 'iMan', 'Niyaz', 'L0ki', 'Sans', 'EpicMan', 'Zero', 'BERTOR', 'RPK', 'Vaon', 'mordvig', 'NONAME', 'WASD', 'qwerty', 'kilo', 'jog', 'R.I.P', 'Siro', 'Agar.io', 'Cheater', 'HYGO', 'DooeX', '_OmeN_', 'Admin', 'iJseven', 'РачОк', 'Frost', 'Kuplinov', 'Tomatos', 'Himan', 'Alermo', 'Zaltir', 'Crisp', 'iFresHD', 'Fosters', 'Saspens', 'Trolden', 'Jumbo', 'Tanko', 'banany', 'Adamson', 'Лирой', 'Dorrian', 'Justie', 'OneZee', 'Red21', 'Simon', 'Tiger', 'Snailkick', 'Topa', 'Itpedia', 'M9snik', 'Mamix', 'Nemagia', 'Thoisoi', 'Сыендук', 'Топлес', 'Bonqi', 'BEAV!SE', 'Naval"nyj', 'Mazafack', 'LegendarY', 'Logarifm', 'Fant0m', 'Aragorn', 'Moralore', 'Lymu', 'PsiX', 'Vanish', 'AdeoN', 'Tuk', 'Corben', 'Gaben', 'Fothis', 'Lear', 'Letal', 'панда', 'KUFFO', 'Darik', 'Shadow', 'Yanis', 'Penis', 'Artash', 'Hanojun', 'Iarrid', 'Khoror', 'Gargas', 'Iak', 'Morza', 'Maulabar', 'Celv', 'Gh0st', 'Eriatea', 'Frayko', 'Gerbion', 'Kaekia', 'Shaera', 'Astrello', 'Arr0w', 'Boozai', 'Charter', 'Dep3ku1', 'Foturn', 'car', 'Dominant', 'KaJIuH', 'Haroros', 'Khaera', 'Kysun', 'Aqutea', 'Kristallik', 'joker', 'DarkRage', 'Dilleron', 'ZonG', 'Jesus', 'Mamkoeb', 'Griffon', 'PaZiTiV', 'EnderGuy', 'Remsi', 'Kronos', 'lager', 'Viper', 'Be3uH4uk', 'Дед_Пыхто', 'ПУТИН', 'ЦойЖив', 'lopata', 'Mr.Epic', 'ИзяГудман', 'ЛblсоКоHb', 'donkyHOT', 'ZadNizza', '90x60x90', 'in100gramm', 'Batmen', 'QQshka', 'ВАЖАК', ' Гравицапа', 'Жжженя', 'ПеРеПykeR', 'hotelkin', 'Бадик', 'Girl', 'Пигмейка', 'AlphaGo', 'Deep Blue', 'Текун', 'BCTAHbKA', 'cheLentano', 'Овцекот', 'BUNNY', 'пурген', 'Куропеко', 'Чучо', 'Platon', 'Konfucij', 'Evklid', 'Fallos', 'Arhimed', 'Kasjapa', 'Popka', 'Gautama', 'Russia', 'Magnickiy', 'Brashman', 'Vavilov', 'leNIN', 'Додик', 'Франшиза', 'Пластун', 'Ваточка', 'Кремлебот', 'Аколит', 'Толостоп', 'uhadi', 'Qurtasen', 'Balermah', 'Acelaica', 'Qurllisa', 'Joetol', 'Elabra', 'Gorana', 'Vireni', 'Zharud', 'Naleya', 'Freiro', 'Bubble', 'Factory', 'Qunise', 'Darezi', 'Chalar', 'Ganele', 'Kikree', 'Пуфыстик', 'Andro', 'Kira', 'Cedar', 'Zolobar', 'Dianalore', 'Femand', 'Kekus', 'Dragon', 'Adolace', 'believer', 'Coinara', 'CoinFlip', 'Kalune', 'Kebandis', 'Vibrator', 'Blademaster', 'Burisida', 'Direforge', 'KapJlc0H', 'Gashish', 'RaNDoM', 'Chernoslav', 'Santiaga', 'Wincent', 'Pirest', 'Кровельщик', 'Roman', 'Detonator', 'Antonio', 'Oxxxy', 'Чушка', 'localhost', 'GL3Bk1N', 'Крайнов', 'Суетнов', 'Кононов', 'Веселов', 'Лук', 'Белянин', 'Domask MC', 'Ильина', 'Marvel', 'Math', 'NaN', 'Js', 'Pascal', 'C++', 'PHP', 'C', 'C#'],
            a = Math.round(Math.random() * (names.length + 150));
        if (a < names.length) {
            name = names[a];
        }
        if (a >= names.length) {
            name = "";

            function nickName() {
                var str1, str2, f, y, fl, ff, q, member = ["a", "e", "i", "o", "u", "y", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "z"];
                ff = Math.round(Math.random() * 1);
                if (ff == 1) {
                    fl = true;
                } else {
                    fl = false;
                }
                for (var i = 1; i <= 6; i++) {
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
                        if (f == true) {
                            name = name.charAt(0).toUpperCase() + name.charAt(0);
                            f = false;
                        } else if (i == 1) {
                            name = name.charAt(0).toUpperCase();
                        }
                    }
                    y = Math.round(Math.random() * 36);
                    if (y >= 0 && y <= 1) {
                        str1 = name.substring(0, i - 1);
                        str2 = name.charAt(i - 1).toUpperCase();
                        name = str1 + str2;
                    }
                }
            }
            nickName();
        }
        if (name.length <= 6) {
            function tun() {
                var a;
                var b = Math.round(Math.random() * 22);
                if (b >= 0 && b <= 2) {
                    a = Math.round(Math.random() * (8 - name.length));
                    for (var i = 1; i <= a; i++) {
                        name += Math.round(Math.random() * 9);
                    }
                } else if (b >= 3 && b <= 5) {
                    a = Math.round(Math.random() * (9 - name.length));
                    if (name.charAt(name.length) != "_" && a != 0) {
                        var c = Math.round(Math.random() * 11);
                        if (c >= 0 && c <= 8) {
                            name += "_";
                        } else {
                            name += "-";
                        }
                    }
                    for (var i = 1; i <= a; i++) {
                        name += Math.round(Math.random() * 9);
                    }
                }
            }
            tun();
        }
        return name;
    }

    function moveBotHelp(bot, fd, e1) {
        var distance = getDistance(bot.x, bot.y, e1.x, e1.y);
        if (distance < bot.r + e1.r) {
            if (bot.r / e1.r >= canEat) {
                if (bot.r < maxr) {
                    bot.r += rspeed;
                    speed(bot);
                }
                e1.r -= rspeed;
                speed(e1);
                if (e1.r <= 0) {
                    respawn(e1);
                    bot.kills++;
                    e1.deaths++;
                    table();
                }
            } else if (e1.r / bot.r >= canEat) {
                if (e1.r < maxr) {
                    e1.r += rspeed;
                    speed(e1);
                }
                bot.r -= rspeed;
                speed(bot);
                if (bot.r <= 0) {
                    respawn(bot);
                    bot.deaths++;
                    e1.kills++;
                    table();
                }
            }
        }
    }

    function moveBot(bot, fd, num) {
        var dist;
        if (bot.x > scale * w - bot.r) {
            bot.x = scale * w - bot.r;
        } else if (bot.x < bot.r) {
            bot.x = bot.r;
        }
        if (bot.y > scale * h - bot.r) {
            bot.y = scale * h - bot.r;
        } else if (bot.y < bot.r) {
            bot.y = bot.r;
        }
        for (var i = 0; i < foodcount * 2; i += 2) {
            dist = Math.sqrt((fd[i] - bot.x) * (fd[i] - bot.x) + (fd[i + 1] - bot.y) * (fd[i + 1] - bot.y));
            if (dist <= foodr + bot.r + fdd) {
                fd[i] += speedOfAttOfFood * ((bot.x - fd[i]) / getDistance(bot.x, bot.y, fd[i], fd[i + 1]));
                fd[i + 1] += speedOfAttOfFood * ((bot.y - fd[i + 1]) / getDistance(bot.x, bot.y, fd[i], fd[i + 1]));
                if (dist <= foodr + bot.r) {
                    if (bot.r < maxr) {
                        bot.r += rspeed;
                        speed(bot);
                    }
                    fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                    fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    while ((fd[i] >= bot.x - bot.r && fd[i] <= bot.x + bot.r && fd[i + 1] >= bot.y - bot.r && fd[i + 1] <= bot.y + bot.r) || (foodGenerate(fd, bot, 1, i) || foodGenerate(fd, bot, 2, i) || foodGenerate(fd, bot, 3, i) || foodGenerate(fd, bot, 4, i))) {
                        fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                        fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    }
                }
            }
        }
        for (var i = 0; i < bots.length; i++) {
            if (i !== num) {
                moveBotHelp(bot, fd, bots[i]);
            }
        }
    }

    function botMove(ent, direction) {
        if (!direction) {
            ent.y -= ent.yspeed;
        }
        if (direction == 1) {
            ent.x += ent.xspeed;
            ent.y -= ent.yspeed;
        }
        if (direction == 2) {
            ent.x += ent.xspeed;
        }
        if (direction == 3) {
            ent.x += ent.xspeed;
            ent.y += ent.yspeed;
        }
        if (direction == 4) {
            ent.y += ent.yspeed;
        }
        if (direction == 5) {
            ent.x -= ent.xspeed;
            ent.y += ent.yspeed;
        }
        if (direction == 6) {
            ent.x -= ent.xspeed;
        }
        if (direction == 7) {
            ent.x -= ent.xspeed;
            ent.y -= ent.yspeed;
        }
    }

    function runbot(ent1, ent2) {
        var x = ent2.x,
            y = ent2.y;
        ent2.x -= ent2.xspeed * ((ent1.x - x) / getDistance(ent1.x, ent1.y, x, y));
        ent2.y -= ent2.yspeed * ((ent1.y - y) / getDistance(ent1.x, ent1.y, x, y));
    }

    function botRunWall(wall, ent1, ent2) {
        if (wall === 0) {
            if (ent1.y > ent2.y) {
                botMove(ent2, 0);
            } else {
                botMove(ent2, 4);
            }
        } else if (wall === 1) {
            if (ent1.x > ent2.x) {
                botMove(ent2, 6);
            } else {
                botMove(ent2, 2);
            }
        } else if (wall === 2) {
            if (ent1.x < scale * w - ent1.r * 2 && ent1.y > scale * h - ent1.r * 2) {
                botMove(ent2, 1);
            } else if (ent1.y < scale * h - ent1.r * 2 && ent1.x > scale * w - ent1.r * 2) {
                botMove(ent2, 5);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botMove(ent2, 5);
                } else {
                    botMove(ent2, 1);
                }
            }
        } else if (wall === 3) {
            if (ent1.x < scale * w - ent1.r * 2 && ent1.y < ent1.r * 2) {
                botMove(ent2, 3);
            } else if (ent1.x > scale * w - ent1.r * 2 && ent1.y > ent1.r * 2) {
                botMove(ent2, 7);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botMove(ent2, 7);
                } else {
                    botMove(ent2, 3);
                }
            }
        } else if (wall === 4) {
            if (ent1.x > ent1.r * 2 && ent1.y < ent1.r * 2) {
                botMove(ent2, 5);
            } else if (ent1.x < ent1.r * 2 && ent1.y > ent1.r * 2) {
                botMove(ent2, 1);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botMove(ent2, 1);
                } else {
                    botMove(ent2, 5);
                }
            }
        } else if (wall === 5) {
            if (ent1.x > ent1.r * 2 && ent1.y > scale * h - ent1.r * 2) {
                botMove(ent2, 7);
            } else if (ent1.x < ent1.r * 2 && ent1.y < scale * h - ent1.r * 2) {
                botMove(ent2, 3);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botMove(ent2, 3);
                } else {
                    botMove(ent2, 7);
                }
            }
        }
    }

    function interaction(distance2, bot, fd, dist2, e1, n) {
        var dist3 = getDistance(bot.x, bot.y, e1.x, e1.y);
        if (dist3 == distance2[0]) {
            if (dist3 <= dist2) {
                if (bot.r / e1.r >= canEat) {
                    bot.x += bot.xspeed * ((e1.x - bot.x) / getDistance(bot.x, bot.y, e1.x, e1.y));
                    bot.y += bot.yspeed * ((e1.y - bot.y) / getDistance(bot.x, bot.y, e1.x, e1.y));
                } else if (e1.r / bot.r >= canEat) {
                    if (bot.x < scale * w - bot.r - 1 && bot.x > bot.r + 1 && bot.y < scale * h - bot.r - 1 && bot.y > bot.r + 1 && !(bot.x > scale * w - e1.r * 2 && bot.y > scale * h - e1.r * 2) && !(bot.x > scale * w - e1.r * 2 && bot.y < e1.r * 2) && !(bot.x < e1.r * 2 && bot.y < e1.r * 2) && !(bot.x < e1.r * 2 && bot.y > scale * h - e1.r * 2)) {
                        runbot(e1, bot);
                    } else {
                        if (bot.x > scale * w - e1.r * 2 && bot.y > scale * h - e1.r * 2) {
                            botRunWall(2, e1, bot);
                        } else if (bot.x > scale * w - e1.r * 2 && bot.y < e1.r * 2) {
                            botRunWall(3, e1, bot);
                        } else if (bot.x < e1.r * 2 && bot.y < e1.r * 2) {
                            botRunWall(4, e1, bot);
                        } else if (bot.x < e1.r * 2 && bot.y > scale * h - e1.r * 2) {
                            botRunWall(5, e1, bot);
                        } else {
                            if (bot.x > scale * w - bot.r - 1) {
                                botRunWall(0, e1, bot);
                            } else if (bot.x < bot.r + 1) {
                                botRunWall(0, e1, bot);
                            }
                            if (bot.y > scale * h - bot.r - 1) {
                                botRunWall(1, e1, bot);
                            } else if (bot.y < bot.r + 1) {
                                botRunWall(1, e1, bot);
                            }
                        }
                    }
                } else {
                    bot.currentMotion = chance[chance.length - 1];
                }
            } else {
                bot.currentMotion = chance[chance.length - 1];
            }
        }
    }

    function botRandomMove(bot) {
        var dst = getDistance(bot.x, bot.y, bot.rndX, bot.rndY);
        bot.x += bot.xspeed * ((bot.rndX - bot.x) / dst);
        bot.y += bot.yspeed * ((bot.rndY - bot.y) / dst);
        if (dst < bot.r / 2) {
            bot.rndX = Math.round(Math.random() * scale * w);
            bot.rndY = Math.round(Math.random() * scale * h);
        }
    }

    function botAI(bot, fd, number) {
        var distance = [],
            nums, min = Infinity,
            distance2 = [],
            dist, k;
        if (bot.step <= 0) {
            bot.rndX = Math.round(Math.random() * scale * w);
            bot.rndY = Math.round(Math.random() * scale * h);
            bot.step = Math.round(Math.random() * stepCount);
            bot.currentMotion = Math.round(Math.random() * mbc);
        }
        bot.step--;
        if (bot.currentMotion >= chance[0] && bot.currentMotion <= chance[1]) {
            botRandomMove(bot);
        } else if (bot.currentMotion >= chance[2] && bot.currentMotion <= chance[3]) {
            for (var i = 0; i < bots.length; i++) {
                if (i !== number) {
                    distance2[distance2.length] = getDistance(bot.x, bot.y, bots[i].x, bots[i].y);
                }
            }
            if (bot === player) {
                JSsort(distance2);
                for (var i = 0; i < bots.length; i++) {
                    interaction(distance2, bot, fd, bot.r + bots[i].r + razt, bots[i], number);
                }
            } else {
                distance2[distance2.length] = getDistance(bot.x, bot.y, player.x, player.y);
                JSsort(distance2);
                if (distance2[0] !== getDistance(bot.x, bot.y, player.x, player.y)) {
                    for (var i = 0; i < bots.length; i++) {
                        if (i !== number) {
                            interaction(distance2, bot, fd, bot.r + bots[i].r + razt, bots[i], number);
                        }
                    }
                } else {
                    interaction(distance2, bot, fd, bot.r + player.r + razt, player, number);
                }
            }
        } else if (bot.currentMotion >= chance[4] && bot.currentMotion <= chance[5]) {
            if (!foodcount) {
                bot.currentMotion = chance[0];
                botRandomMove(bot);
            } else {
                for (var i = 0; i < foodcount * 2; i += 2) {
                    distance[i] = getDistance(bot.x, bot.y, fd[i], fd[i + 1]);
                    nums = i;
                }
                for (var i = 0; i < distance.length; i += 2) {
                    if (distance[i] < min) {
                        min = distance[i];
                        nums = i;
                    }
                }
                bot.x += bot.xspeed * ((fd[nums] - bot.x) / getDistance(bot.x, bot.y, fd[nums], fd[nums + 1]));
                bot.y += bot.yspeed * ((fd[nums + 1] - bot.y) / getDistance(bot.x, bot.y, fd[nums], fd[nums + 1]));
            }
        }
        moveBot(bot, fd, number);
    }

    function respawn(ent) {
        ent.x = Math.round(Math.random() * w * scale);
        ent.y = Math.round(Math.random() * h * scale);
        ent.r = dr;
    }

    function speed(ent) {
        ent.xspeed = ent.defaultXspeed;
        ent.yspeed = ent.defaultYspeed;
        if (ent.r < maxr * 0.8) {
            ent.xspeed = (1 - ent.r / maxr) * ent.xspeed;
            ent.yspeed = (1 - ent.r / maxr) * ent.yspeed;
        } else if (ent.r >= maxr * 0.8) {
            ent.xspeed = (0.2) * ent.xspeed;
            ent.yspeed = (0.2) * ent.yspeed;
        }
        if (ent.r <= dr) {
            ent.xspeed = ent.defaultXspeed;
            ent.yspeed = ent.defaultYspeed;
        }
        if (ent.r > maxr) {
            ent.r = maxr;
        }
    }

    //изменить логику
    function radius(ent) {
        if (ent.r / maxr >= 0.2) {
            ent.r -= Math.round(0.01 * ent.r);
        }
        if (ent.r / maxr >= 0.35) {
            ent.r -= Math.round(0.015 * ent.r);
        }
        if (ent.r / maxr >= 0.5) {
            ent.r -= Math.round(0.02 * ent.r);
        }
        if (ent.r / maxr >= 0.7) {
            ent.r -= Math.round(0.025 * ent.r);
        }
        if (ent.r / maxr >= 0.85) {
            ent.r -= Math.round(0.03 * ent.r);
        }
        if (ent.r / maxr >= 0.95) {
            ent.r -= Math.round(0.035 * ent.r);
        }
    }

    function crazy(obj) {
        obj.name = generateName();
        obj.circleColor = color();
        obj.strokeColor = color();
    }

    function bonus(obj) {
        ctx.translate((player.x - w / 2), (player.y - h / 2));
        var gen = Math.floor(Math.random() * 39 * 1e+4);
        if (!gen) {
            var br = Math.floor(Math.random() * 100);
            if (obj.r + br <= maxr) {
                obj.r += br;
            }
        } else if (gen === 1) {
            var br = Math.floor(Math.random() * 100);
            if (obj.r - br >= dr) {
                obj.r -= br;
            }
        } else if (gen === 2) {
            obj.name = generateName();
        } else if (gen === 3) {
            obj.circleColor = color();
        } else if (gen === 4) {
            obj.strokeColor = color();
        } else if (gen === 5) {
            obj.defaultXspeed += Math.random() * Math.floor(Math.random() * 11);
        } else if (gen === 6) {
            obj.defaultYspeed += Math.random() * Math.floor(Math.random() * 11);
        } else if (gen === 7) {
            obj.defaultXspeed -= Math.random() * Math.floor(Math.random() * 11);
            if (obj.defaultXspeed <= 0) {
                obj.defaultXspeed = 0.5;
            }
        } else if (gen === 8) {
            obj.defaultYspeed -= Math.random() * Math.floor(Math.random() * 11);
            if (obj.defaultYspeed <= 0) {
                obj.defaultYspeed = 0.5;
            }
        } else if (gen === 9) {
            rspeed += randomRspeed();
        } else if (gen === 10) {
            rspeed -= randomRspeed();
            if (rspeed < 0) {
                rspeed = 0;
            }
        } else if (gen === 11) {
            foodcount = Math.floor(Math.random() * foodcount);
            genFood();
        } else if (gen === 12) {
            foodcount += Math.floor(Math.random() * foodcount);
            genFood();
        } else if (gen === 13) {
            foodr = Math.floor(Math.random() * foodr);
        } else if (gen === 14) {
            foodr += Math.floor(Math.random() * foodr);
        } else if (gen === 15) {
            maxr = Math.floor(Math.random() * maxr);
        } else if (gen === 16) {
            maxr += Math.floor(Math.random() * maxr);
        } else if (gen === 17) {
            scale += Math.floor(Math.random() * scale);
            genFood();
        } else if (gen === 18) {
            scale = Math.floor(Math.random() * scale);
            if (!scale) {
                scale = 1;
            }
            respawn(player);
            for (var i = 0; i < bots.length; i++) {
                respawn(bots[i]);
            }
            genFood();
        } else if (gen === 19) {
            obj.x = Math.round(Math.random() * scale * w);
        } else if (gen === 20) {
            obj.y = Math.round(Math.random() * scale * h);
        } else if (gen === 21) {
            obj.x = Math.round(Math.random() * scale * w);
            obj.y = Math.round(Math.random() * scale * h);
        } else if (gen === 22) {
            dr = Math.floor(Math.random() * dr);
        } else if (gen === 23) {
            dr += Math.floor(Math.random() * dr);
        } else if (gen === 24) {
            stepCount = Math.floor(Math.random() * stepCount);
            if (!stepCount) {
                stepCount = 1;
            }
        } else if (gen === 25) {
            stepCount += Math.floor(Math.random() * stepCount);
        } else if (gen === 26) {
            fdd = Math.floor(Math.random() * fdd);
        } else if (gen === 27) {
            fdd += Math.floor(Math.random() * fdd);
        } else if (gen === 28) {
            maz = Math.floor(Math.random() * maz);
            if (!maz) {
                maz = 1;
            }
        } else if (gen === 29) {
            maz += Math.floor(Math.random() * maz);
        } else if (gen === 30) {
            razt = Math.floor(Math.random() * razt);
        } else if (gen === 31) {
            razt += Math.floor(Math.random() * razt);
        } else if (gen === 32) {
            decreaseSpeed = Math.floor(Math.random() * decreaseSpeed);
        } else if (gen === 33) {
            decreaseSpeed += 1 + Math.floor(Math.random() * decreaseSpeed);
        } else if (gen === 34) {
            obj.r = dr;
            obj.defaultXspeed = 1;
            obj.defaultYspeed = 1;
            obj.name = 'Неудачник';
            obj.circleColor = '#ff00d6';
            obj.strokeColor = '#000000';
        } else if (gen === 35) {
            obj.name = 'Tiger';
            obj.circleColor = '#ff6500';
            obj.strokeColor = '#000000';
        } else if (gen === 36) {
            obj.name = 'Putin';
            obj.circleColor = '#0000ff';
            obj.strokeColor = '#ff0000';
        } else if (gen === 37) {
            obj.name = generateName();
            obj.circleColor = color();
            obj.strokeColor = color();
        } else if (gen === 38) {
            obj.crazyMod = !obj.crazyMod;
        } else if (gen === 39) {
            playerBot = !playerBot;
        }
        speed(obj);
        ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
    }

    function minr(a) {
        if (a < 2) {
            return 2;
        }
        return a;
    }

    function drawcircle(ent, xm, ym) {
        ctx2.beginPath();
        ctx2.arc(ent.x / xm, ent.y / ym, minr(ent.r / ((xm + ym) / 2)), 0, Math.PI * 2, false);
        ctx2.fillStyle = ent.circleColor;
        ctx2.fill();
        ctx2.closePath();
    }

    function minimap(fd, fdcl) {
        var xm = (scale * w) / (2 + canvas2.width - 10);
        var ym = (scale * h) / (2 + canvas2.height - 10);
        ctx2.beginPath();
        ctx2.fillStyle = "white";
        ctx2.fillRect(2, 2, canvas2.width - 10, canvas2.height - 10);
        ctx2.closePath();
        for (var i = 0; i < bots.length; i++) {
            drawcircle(bots[i], xm, ym);
        }
        drawcircle(player, xm, ym);
        for (var i = 0; i < foodcount * 2; i += 2) {
            ctx2.beginPath();
            ctx2.fillStyle = "rgb(" + fdcl[i] + ", " + fdcl[i + 1] + ", " + fdcl[i + 2] + ")";
            ctx2.fill();
            ctx2.fillRect(fd[i] / xm, fd[i + 1] / ym, 2, 2);
            ctx2.closePath();
        }
        ctx2.beginPath();
        ctx2.strokeStyle = "black";
        ctx2.lineWidth = 2;
        ctx2.strokeRect(2, 2, canvas2.width - 10, canvas2.height - 10);
        ctx2.closePath();
    }

    function drawtext(text, color, size, x, y) {
        ctx3.beginPath();
        ctx3.fillStyle = color;
        ctx3.textAlign = "center";
        ctx3.font = "normal " + size + "px Code Pro";
        ctx3.fillText("" + text + "", x, y);
        ctx3.closePath();
    }

    function leaderboard() {
        ctx3.beginPath();
        ctx3.fillStyle = "rgba(0,0,0,0.5)";
        ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
        ctx3.fill();
        ctx3.closePath();
        drawtext("Leaderboard", "rgba(255, 255, 255, 0.95)", 25, canvas3.width / 2, 27);
        var k, q, rads = [],
            name = [];
        for (var i = 0; i < bots.length; i++) {
            rads.push(bots[i].r);
            name.push(bots[i].name);
        }
        rads.push(player.r);
        name.push(player.name);
        for (var i = 0; i < rads.length; i++) {
            for (var j = 0; j < rads.length - i; j++) {
                if (rads[j] < rads[j + 1]) {
                    k = rads[j];
                    rads[j] = rads[j + 1];
                    rads[j + 1] = k;
                    q = name[j];
                    name[j] = name[j + 1];
                    name[j + 1] = q;
                }
            }
        }
        var n = bots.length + 1;
        if (n > 10) {
            n = 10;
        }
        for (var i = 0; i < n; i++) {
            if (name[i] == player.name) {
                drawtext("" + ((i + 1) + '. ' + name[i] + ' (' + rads[i] + ')') + "", "rgba(200, 0, 0, 0.95)", 20, canvas3.width / 2, 55 + 25 * i);
            } else {
                drawtext("" + ((i + 1) + '. ' + name[i] + ' (' + rads[i] + ')') + "", "rgba(255, 255, 255, 0.95)", 20, canvas3.width / 2, 55 + 25 * i);
            }
        }
    }

    function game() {
        tick++;
        ctx.clearRect(-scale * w, -scale * h, 3 * scale * w, 3 * scale * h);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
        leaderboard();
        if ($("#grid").prop('checked')) {
            var rows = (w * scale) / maz;
            var cols = (h * scale) / maz;
            for (var i = 1; i < rows; i++) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,0,0,0.5)";
                ctx.lineWidth = 1;
                ctx.moveTo(maz * i, 0);
                ctx.lineTo(maz * i, scale * h);
                ctx.stroke();
                ctx.closePath();
            }
            for (var i = 1; i < cols; i++) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,0,0,0.5)";
                ctx.lineWidth = 1;
                ctx.moveTo(0, maz * i);
                ctx.lineTo(scale * w, maz * i);
                ctx.stroke();
                ctx.closePath();
            }
        }
        var a = player.r;
        drawobj(player);
        for (var i = 0; i < bots.length; i++) {
            drawobj(bots[i]);
            botAI(bots[i], food, i);
            if (bots[i].crazyMod) {
                crazy(bots[i]);
            }
        }
        if (player.crazyMod) {
            crazy(player);
        }
        drawFood(food, foodcolor);
        if (playerBot) {
            ctx.translate((player.x - w / 2), (player.y - h / 2));
            botAI(player, food, -1);
            ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
        }
        movePlayer(player);
        ctx.translate((player.x - w / 2), (player.y - h / 2));
        moveBot(player, food, -1);
        ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
        if (!(tick % (Math.floor(60 / decreaseSpeed)))) {
            radius(player);
            bonus(player);
            for (var i = 0; i < bots.length; i++) {
                radius(bots[i]);
                bonus(bots[i]);
            }
        }
        var b = player.r;
        var c = 2.5;
        if (b > a && player.r >= dr) {
            var z = a;
            while (z < b) {
                z += 0.5;
                if (z < 450) {
                    ctx.translate((player.x - w / 2), (player.y - h / 2));
                    ctx.scale(1 - c * ((0.5) * 0.002), 1 - c * ((0.5) * 0.002));
                    ctx.translate((c * w * ((0.5) / 1000)), (c * h * ((0.5) / 1000)));
                    ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
                } else {
                    break;
                }
            }
        }
        if (b < a && player.r > dr) {
            var q = b;
            while (q < a) {
                q += 0.5;
                if (q < 450) {
                    ctx.translate((player.x - w / 2), (player.y - h / 2));
                    ctx.scale(1 + c * ((0.5) * 0.002), 1 + c * ((0.5) * 0.002));
                    ctx.translate(-(c * w * ((0.5) / 1000)), -(c * h * ((0.5) / 1000)));
                    ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
                } else {
                    break;
                }
            }
        }
        minimap(food, foodcolor);
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, scale * w, scale * h);
        ctx.closePath();
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
