$('document').ready(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        canvas2 = document.getElementById('canvas2'),
        ctx2 = canvas2.getContext('2d'),
        canvas3 = document.getElementById('canvas3'),
        ctx3 = canvas3.getContext('2d');
    canvas3.width = 220;
    canvas3.height = 300;
    var w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight - 40,
        key, tick = 0,
        messageCount = 0,
        foodcount = 450,
        foodr = 5,
        maxr, rspeed = 0.5,
        scale = 3,
        mbc, dr = 7,
        stepcount = 50,
        fdd = 20,
        botCount = 10,
        set = true,
        set2 = true,
        set3 = true,
        chat = true,
        canPlay = true,
        maz = 40,
        razt = 200,
        decreaseSpeed = 1,
        player = {
            x: Math.round(Math.random() * scale * w),
            y: Math.round(Math.random() * scale * h),
            r: dr,
            xspeed: 2,
            yspeed: 2,
            name: 'HuHguZ',
            defaultXspeed: 2,
            defaultYspeed: 2,
            circleColor: '#ff0000',
            strokeColor: '#990000',
            xdirection: 0,
            ydirection: 0,
            kills: 0,
            deaths: 0
        },
        bots = [],
        food = [],
        foodcolor = [],
        chance = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 15, 16, 23];
    mbc = chance[19];

    function Bot(x, y, r, xspeed, yspeed, name, defaultXspeed, defaultYspeed, circleColor, strokeColor, xdirection, ydirection, typeOfMoyion, kills, deaths, currentMotion, step) {
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
        this.xdirection = xdirection;
        this.ydirection = ydirection;
        this.typeOfMoyion = typeOfMoyion;
        this.currentMotion = currentMotion;
        this.step = step;
        this.kills = kills;
        this.deaths = deaths;
    }
    for (var i = 0; i < botCount; i++) {
        bots[i] = new Bot(Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), dr, 2, 2, botname(), 2, 2, color(), color(), 0, 0, Math.round(Math.random() * 2), 0, 0, Math.round(Math.random() * mbc), stepcount);
    }
    maxr = Math.round(Math.sqrt((0.2 * w * h * scale) / Math.PI));
    ctx.scale(4.5, 4.5);
    ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
    ctx.translate(-(520 * w * 0.00075), -(520 * h * 0.00075));
    var def = [player.circleColor, player.strokeColor, player.name, player.defaultXspeed, player.defaultYspeed, '', foodcount, foodr, maxr, dr, rspeed, scale, fdd, maz, decreaseSpeed];
    var chancedef = [];
    for (var i = 0; i < chance.length; i++) {
        chancedef[i] = chance[i];
    }
    for (var i = 0; i < foodcount * 2; i += 2) {
        foodcoords(food, player, i);
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

    function showInfo() {
        $('#inp0').val((performance.now() / 1000).toFixed(2));
        $('#inp1').val(player.r);
        $('#inp2').val(player.x);
        $('#inp3').val(player.y);
        $('#inp4').val(player.xspeed);
        $('#inp5').val(player.yspeed);
    }
    $('#guide').on('click', function() {
        alert('Добро пожаловать в пародию на Agar.io, ' + player.name + '\nВ этой версии игры вы будете сражаться с ботами, которых на карте ' + bots.length + '.\nВы, как и они, должны собирать пищу, чтобы расти и становиться больше своих конкурентов.\nКак только немного подрастёте, можете начинать искать и поедать своих врагов.\nИногда в игре будут происходить необъяснимые случайности.\nОбъяснения этому пока никто не дал.\nДля тонкой настройки игры нажмите ё. Там вы можете как и зачитерить, так и подкорректировать текущую симуляцию. (Отнимается 30% радиуса).\nУдачной игры!');
        alert('Управление - WASD. Управление камерой - стрелочки или клавиши TFGH. Убрать мини-карту - Q, чат - 2, открыть таблицу - 1.');
    });

    function drawobj(obj) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = obj.circleColor;
        ctx.fill();
        ctx.strokeStyle = obj.strokeColor;
        ctx.lineWidth = Math.round(0.02 * obj.r);
        ctx.stroke();
        ctx.fillStyle = obj.strokeColor;
        ctx.textAlign = "center";
        ctx.font = "normal " + (obj.r * 0.3) + "px Code Pro";
        ctx.fillText("" + obj.name + "", obj.x, obj.y);
        ctx.fillText("" + obj.r + "", obj.x, (obj.r * 0.3) + obj.y);
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

    function randomrspeed() {
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

    function moveplayer(pl) {
        document.onkeypress = function(event) {
            key = event.key;
        }
        ctx.translate((pl.x - w / 2), (pl.y - h / 2));
        if (key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
            botmove(pl, 0);
        } else if (key === 's' || key === 'S' || key === 'ы' || key === 'Ы') {
            botmove(pl, 4);
        } else if (key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') {
            botmove(pl, 6);
        } else if (key === 'd' || key === 'D' || key === 'в' || key === 'В') {
            botmove(pl, 2);
        } else if (key === 't' || key === 'T' || key === 'е' || key === 'Е' || key === 'ArrowUp') {
            ctx.translate(0, pl.defaultYspeed);
            pl.xdirection = 0;
            pl.ydirection = 0;
        } else if (key === 'f' || key === 'F' || key === 'а' || key === 'А' || key === 'ArrowLeft') {
            ctx.translate(pl.defaultXspeed, 0);
            pl.xdirection = 0;
            pl.ydirection = 0;
        } else if (key === 'g' || key === 'G' || key === 'п' || key === 'П' || key === 'ArrowDown') {
            ctx.translate(0, -pl.defaultYspeed);
            pl.xdirection = 0;
            pl.ydirection = 0;
        } else if (key === 'h' || key === 'H' || key === 'р' || key === 'Р' || key === 'ArrowRight') {
            ctx.translate(-pl.defaultXspeed, 0);
            pl.xdirection = 0;
            pl.ydirection = 0;
        } else if (key === '`' || key === '~' || key === 'Ё' || key === 'ё') {
            key = 0;
            pl.xdirection = 0;
            pl.ydirection = 0;
            if (set) {
                if (player.r > dr) {
                    player.r = Math.round(0.7 * player.r);
                    $(".settings").css("opacity", "1");
                    $(".settings").css("transform", "scale(1, 1)");
                    $("#canvas").css("opacity", "0");
                    $(".text").css("opacity", "0");
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
                    $("#maxr").val(maxr);
                    $("#rspeed").val(rspeed);
                    $("#decreaseSpeed").val(decreaseSpeed);
                    $("#scale").val(scale);
                    $("#maz").val(maz);
                    $("#dr").val(dr);
                    $('.default').on('click', function() {
                        $("#color1").val(def[0]);
                        $("#color2").val(def[1]);
                        $("#name").val(def[2]);
                        $("#xspeed").val(def[3]);
                        $("#yspeed").val(def[4]);
                        $("#botspeed").val(def[5]);
                        $("#botsCount").val(10);
                        $("#food").val(def[6]);
                        $("#food2").val(def[7]);
                        $("#maxr").val(def[8]);
                        $("#rspeed").val(def[10]);
                        $("#decreaseSpeed").val(def[14]);
                        $("#scale").val(def[11]);
                        $("#dr").val(def[9]);
                        $("#dist").val(def[12]);
                        $("#maz").val(def[13]);
                    });
                    $('.random').on('click', function() {
                        $("#color1").val(color());
                        $("#color2").val(color());
                        player.name = botname();
                        $("#name").val(player.name);
                        $("#xspeed").val((Math.random() * 10).toFixed(2));
                        $("#yspeed").val((Math.random() * 10).toFixed(2));
                        $("#botspeed").val((Math.random() * 10).toFixed(2));
                        $("#botsCount").val(Math.round(Math.random() * 500));
                        $("#food").val(Math.round(Math.random() * 400));
                        $("#food2").val(Math.round(Math.random() * 10));
                        $("#dist").val(Math.round(Math.random() * 200));
                        $("#rspeed").val(randomrspeed());
                        $("#decreaseSpeed").val((Math.random() * 60).toFixed(2));
                        $("#scale").val((Math.random() * 7).toFixed(2));
                        $("#maz").val(Math.round(Math.random() * 200));
                        $("#dr").val(Math.round(Math.random() * 10));
                        $("#maxr").val(Math.round(Math.random() * Math.sqrt((0.2 * w * h * parseFloat($("#scale").val())) / Math.PI)));
                    });
                    $('.bots').on('click', function() {
                        //
                        $(".settings").css("opacity", "0");
                        $(".settings").css("transform", "scale(0, 0)");
                        $(".botsettings").css("opacity", "1");
                        $(".botsettings").css("transform", "scale(1, 1)");
                        $("#stepcount").val(stepcount);
                        $("#razt").val(razt);
                        for (var i = 0; i < chance.length; i++) {
                            $("#chance" + i + "").val(chance[i]);
                        }
                        for (var i = 0; i < chance.length; i += 2) {
                            $(".chance" + i / 2 + "").html("[" + chance[i] + ";" + chance[i + 1] + "]");
                        }
                        for (var i = 0; i < chance.length; i += 2) {
                            if (chance[i + 1] - chance[i] == 0) {
                                $(".chan" + i / 2 + "").html("" + (1 / mbc * 100).toFixed(2) + "%");
                            } else {
                                $(".chan" + i / 2 + "").html("" + ((chance[i + 1] - chance[i] + 1) / mbc * 100).toFixed(2) + "%");
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
                        $("#chance5").on('keyup', function() {
                            $("#chance6").val(1 + parseInt($("#chance5").val()));
                        });
                        $("#chance6").on('keyup', function() {
                            $("#chance7").val(1 + parseInt($("#chance6").val()));
                        });
                        $("#chance7").on('keyup', function() {
                            $("#chance8").val(1 + parseInt($("#chance7").val()));
                        });
                        $("#chance8").on('keyup', function() {
                            $("#chance9").val(1 + parseInt($("#chance8").val()));
                        });
                        $("#chance9").on('keyup', function() {
                            $("#chance10").val(1 + parseInt($("#chance9").val()));
                        });
                        $("#chance10").on('keyup', function() {
                            $("#chance11").val(1 + parseInt($("#chance10").val()));
                        });
                        $("#chance11").on('keyup', function() {
                            $("#chance12").val(1 + parseInt($("#chance11").val()));
                        });
                        $("#chance12").on('keyup', function() {
                            $("#chance13").val(1 + parseInt($("#chance12").val()));
                        });
                        $("#chance13").on('keyup', function() {
                            $("#chance14").val(1 + parseInt($("#chance13").val()));
                        });
                        $("#chance14").on('keyup', function() {
                            $("#chance15").val(1 + parseInt($("#chance14").val()));
                        });
                        $("#chance15").on('keyup', function() {
                            $("#chance16").val(1 + parseInt($("#chance15").val()));
                        });
                        $("#chance16").on('keyup', function() {
                            $("#chance17").val(1 + parseInt($("#chance16").val()));
                        });
                        $("#chance17").on('keyup', function() {
                            $("#chance18").val(1 + parseInt($("#chance17").val()));
                        });
                        $("#chance18").on('keyup', function() {
                            $("#chance19").val(1 + parseInt($("#chance18").val()));
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
                            mbc = parseInt($("#chance19").val());
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
                            $("#chance0").val(Math.round(Math.random() * 100));
                            for (var i = 1; i < chance.length; i += 2) {
                                if (i > 2) {
                                    $("#chance" + (i - 1) + "").val(1 + parseInt($("#chance" + (i - 2) + "").val()));
                                }
                                $("#chance" + i + "").val(Math.round(Math.random() * (100 + parseInt($("#chance" + (i - 1) + "").val()) - parseInt($("#chance" + (i - 1) + "").val())) + parseInt($("#chance" + (i - 1) + "").val())));
                            }
                            mbc = parseInt($("#chance19").val());
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
                        $('.ready').on('click', function() {
                            $(".botsettings").css("opacity", "0");
                            $(".botsettings").css("transform", "scale(0, 0)");
                            stepcount = parseInt($("#stepcount").val());
                            razt = parseInt($("#razt").val());
                            for (var i = 0; i < chance.length; i++) {
                                chance[i] = parseInt($("#chance" + i + "").val());
                            }
                            mbc = chance[chance.length - 1];
                            if (set == false) {
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
                $(".text").css("opacity", "1");
                $('#canvas2').css("opacity", ".7");
                $("#canvas3").css("opacity", "1");
                $('#canvas2').css("transform", "scale(1, 1)");
                $('#canvas3').css("transform", "scale(1, 1)");
                $('.chat').css('opacity', '1');
                $('.chat').css("transform", "scale(1, 1)");
                set = true;
                player.circleColor = $("#color1").val();
                player.strokeColor = $("#color2").val();
                player.name = $("#name").val();
                player.defaultXspeed = parseFloat($("#xspeed").val());
                player.defaultYspeed = parseFloat($("#yspeed").val());
                if (+$("#botsCount").val() > bots.length) {
                    for (var i = bots.length; i < +$("#botsCount").val(); i++) {
                        bots[i] = new Bot(Math.round(Math.random() * scale * w), Math.round(Math.random() * scale * h), dr, 2, 2, botname(), 2, 2, color(), color(), 0, 0, Math.round(Math.random() * 2), 0, 0, Math.round(Math.random() * mbc), stepcount);
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
                decreaseSpeed = parseFloat($("#decreaseSpeed").val());
                scale = parseFloat($("#scale").val());
                maz = parseInt($("#maz").val());
                dr = parseFloat($("#dr").val());
                fdd = parseFloat($("#dist").val());
                for (var i = 0; i < foodcount * 2; i += 2) {
                    foodcoords(food, player, i);
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
                speed(player);
                if ($("#botspeed").val() != '') {
                    for (var i = 0; i < bots.length; i++) {
                        bots[i].defaultXspeed = parseFloat($("#botspeed").val());
                        bots[i].defaultYspeed = parseFloat($("#botspeed").val());
                    }
                }
            }
        } else if (key === '1' || key === '!') {
            key = 0;
            pl.xdirection = 0;
            pl.ydirection = 0;
            if (set3) {
                set3 = !set3;
                $('.tab').css("transform", "scale(1, 1)");
                $('.tab').css("opacity", "1");
            } else {
                set3 = !set3;
                $('.tab').css("transform", "scale(0, 0)");
                $('.tab').css("opacity", "0");
            }
        } else if (key === 'q' || key === 'Q' || key === 'й' || key === 'Й') {
            key = 0;
            pl.xdirection = 0;
            pl.ydirection = 0;
            if (set2) {
                $('#canvas2').css("opacity", "0");
                $('#canvas2').css("transform", "scale(0, 0)");
            } else {
                $('#canvas2').css("opacity", ".7");
                $('#canvas2').css("transform", "scale(1, 1)");
            }
            set2 = !set2;
        } else if (key === '2' || key === '@' || key === '"') {
            key = 0;
            pl.xdirection = 0;
            pl.ydirection = 0;
            if (chat) {
                $('.chat').css('opacity', '0');
                $('.chat').css("transform", "scale(0, 0)");
            } else {
                $('.chat').css('opacity', '1');
                $('.chat').css("transform", "scale(1, 1)");
            }
            chat = !chat;
        } else {
            pl.xdirection = 0;
            pl.ydirection = 0;
        }
        if (pl.x > scale * w - pl.r) {
            pl.x = scale * w - pl.r;
        } else if (pl.x < pl.r) {
            pl.x = pl.r;
        }
        if (pl.y > scale * h - pl.r) {
            pl.y = scale * h - pl.r;
        } else if (pl.y < pl.r) {
            pl.y = pl.r;
        }
        ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
    }

    document.onmousemove = function(e) {
        var x = e.offsetX,
            y = e.offsetY;
        if (y <= document.getElementsByClassName('chat')[0].offsetHeight && x <= document.getElementsByClassName('chat')[0].offsetWidth && +$('.chat').css('opacity')) {
            canPlay = false;
            key = 0;
            player.xdirection = 0;
            player.ydirection = 0;
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

    function checkMessage() {
        if (messageCount >= 13) {
            $('.msg').html('');
            messageCount = 0;
        }
    }

    function drawfood(fd, fdcl) {
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

    function eatfood(fd, ent) {
        var distance;
        for (var i = 0; i < foodcount * 2; i += 2) {
            distance = Math.sqrt((fd[i] - ent.x) * (fd[i] - ent.x) + (fd[i + 1] - ent.y) * (fd[i + 1] - ent.y));
            if (distance <= foodr + ent.r + fdd) {
                if (!(fd[i] >= ent.x - 1 && fd[i] <= ent.x + 1)) {
                    if (fd[i] > ent.x) {
                        fd[i]--;
                    } else {
                        fd[i]++;
                    }
                }
                if (!(fd[i + 1] >= ent.y - 1 && fd[i + 1] <= ent.y + 1)) {
                    if (fd[i + 1] >= ent.y) {
                        fd[i + 1]--;
                    } else {
                        fd[i + 1]++;
                    }
                }
                if (distance <= foodr + ent.r) {
                    if (ent.r < maxr) {
                        ent.r += rspeed;
                        speed(ent);
                    }
                    fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                    fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    while ((fd[i] >= ent.x - ent.y && fd[i] <= ent.x + ent.y && fd[i + 1] >= ent.y - ent.x && fd[i + 1] <= ent.y + ent.x) || (foodgenerate(fd, ent, 1, i) || foodgenerate(fd, ent, 2, i) || foodgenerate(fd, ent, 3, i) || foodgenerate(fd, ent, 4, i))) {
                        fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                        fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    }
                }
            }
        }
    }

    function foodcoords(fd, ent, i) {
        fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
        fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
        while ((fd[i] >= ent.x - ent.r && fd[i] <= ent.x + ent.r && fd[i + 1] >= ent.y - ent.r && fd[i + 1] <= ent.y + ent.r) || (foodgenerate(fd, ent, 1, i) || foodgenerate(fd, ent, 2, i) || foodgenerate(fd, ent, 3, i) || foodgenerate(fd, ent, 4, i))) {
            fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
            fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
        }
    }

    function foodgenerate(fd, ent, angle, i) {
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

    function botname() {
        var a = Math.round(Math.random() * 450),
            name, names = ['Jacob', 'Michael', 'Joshua', 'Matthew', 'HuHguZ', 'Foxy', 'Ethan', 'mQ', 'MamBa', 'KyKyPy3a', 'Ceme4ka', 'CmeTanKa', 'Nessa', 'Lemon4ik', 'W1zarD', 'Agressor', 'Noob', 'Fuck', 'NeZoX', 'KoTuk', 'LIJyXeP', 'GreeM', 'PloHish', 'Miwka', 'smailik', 'Bonifacy', 'Бублик', 'Karapuz', 'Whisper', 'Krit', 'AgreSir', 'D-man', 'IWUBIT', 'IWUFIK', 'maD', 'NoNeTam', 'RGOGUCI', 'poncheg', 'Last_ik', 'Kitch', 'Kiss', 'SilverName', 'Iner', 'Штаны', 'Даун', 'AdreN', 'Fucker', 'Faker', 'Hero', 'Happy', 'Super', 'Moon', 'Edward', 'Eeoneguy', 'Alexis', 'Соскевич', 'Freed', 'Cow', 'Крыс', '.mQ!', 'ExC!uT*', 'Scream', 'Bot_pro', 'Sisi', 'Ваня', 'Игорь', 'Максим', 'Илья', 'Zimmer', 'Грешник', '=GLuk=', 'Stalker', 'МАЖОР', 'Hapkomuk', 'Winner', 'Di11er', 'Лирик', 'Пушкин', 'iMan', 'Niyaz', 'L0ki', 'Sans', 'EpicMan', 'Zero', 'BERTOR', 'RPK', 'Vaon', 'mordvig', 'NONAME', 'WASD', 'qwerty', 'kilo', 'jog', 'R.I.P', 'Siro', 'Agar.io', 'Cheater', 'HYGO', 'DooeX', '_OmeN_', 'Admin', 'iJseven', 'РачОк', 'Frost', 'Kuplinov', 'Tomatos', 'Himan', 'Alermo', 'Zaltir', 'Crisp', 'iFresHD', 'Fosters', 'Saspens', 'Trolden', 'Jumbo', 'Tanko', 'banany', 'Adamson', 'Лирой', 'Dorrian', 'Justie', 'OneZee', 'Red21', 'Simon', 'Tiger', 'Snailkick', 'Topa', 'Itpedia', 'M9snik', 'Mamix', 'Nemagia', 'Thoisoi', 'Сыендук', 'Топлес', 'Bonqi', 'BEAV!SE', 'Naval"nyj', 'Mazafack', 'LegendarY', 'Logarifm', 'Fant0m', 'Aragorn', 'Moralore', 'Lymu', 'PsiX', 'Vanish', 'AdeoN', 'Tuk', 'Corben', 'Gaben', 'Fothis', 'Lear', 'Letal', 'панда', 'KUFFO', 'Darik', 'Shadow', 'Yanis', 'Penis', 'Artash', 'Hanojun', 'Iarrid', 'Khoror', 'Gargas', 'Iak', 'Morza', 'Maulabar', 'Celv', 'Gh0st', 'Eriatea', 'Frayko', 'Gerbion', 'Kaekia', 'Shaera', 'Astrello', 'Arr0w', 'Boozai', 'Charter', 'Dep3ku1', 'Foturn', 'Dominant', 'KaJIuH', 'Haroros', 'Khaera', 'Kysun', 'Aqutea', 'Kristallik', 'joker', 'DarkRage', 'Dilleron', 'ZonG', 'Jesus', 'Mamkoeb', 'Griffon', 'PaZiTiV', 'EnderGuy', 'Remsi', 'Kronos', 'lager', 'Viper', 'Be3uH4uk', 'Дед_Пыхто', 'ПУТИН', 'ЦойЖив', 'lopata', 'Mr.Epic', 'ИзяГудман', 'ЛblсоКоHb', 'donkyHOT', 'ZadNizza', '90x60x90', 'in100gramm', 'Batmen', 'QQshka', 'ВАЖАК', ' Гравицапа', 'Жжженя', 'ПеРеПykeR', 'hotelkin', 'Бадик', 'Girl', 'Пигмейка', 'AlphaGo', 'Deep Blue', 'Текун', 'BCTAHbKA', 'cheLentano', 'Овцекот', 'BUNNY', 'пурген', 'Куропеко', 'Чучо', 'Platon', 'Konfucij', 'Evklid', 'Fallos', 'Arhimed', 'Kasjapa', 'Popka', 'Gautama', 'Russia', 'Magnickiy', 'Brashman', 'Vavilov', 'leNIN', 'Додик', 'Франшиза', 'Пластун', 'Ваточка', 'Кремлебот', 'Аколит', 'Толостоп', 'uhadi', 'Qurtasen', 'Balermah', 'Acelaica', 'Qurllisa', 'Joetol', 'Elabra', 'Gorana', 'Vireni', 'Zharud', 'Naleya', 'Freiro', 'Bubble', 'Factory', 'Qunise', 'Darezi', 'Chalar', 'Ganele', 'Kikree', 'Пуфыстик', 'Andro', 'Kira', 'Cedar', 'Zolobar', 'Dianalore', 'Femand', 'Kekus', 'Dragon', 'Adolace', 'believer', 'Coinara', 'CoinFlip', 'Kalune', 'Kebandis', 'Vibrator', 'Blademaster', 'Burisida', 'Direforge', 'KapJlc0H', 'Gashish', 'RaNDoM', 'Chernoslav', 'Santiaga', 'Wincent', 'Pirest', 'Кровельщик', 'Roman', 'Detonator', 'Antonio', 'Oxxxy', 'Чушка', 'localhost', 'Глебкин', 'Крайнов', 'Суетнов', 'Кононов', 'Веселов', 'Лук', 'Белянин', 'Domask MC', 'Ильина'];
        if (a < names.length) {
            name = names[a];
        }
        if (a >= names.length && a <= 450) {
            name = "";

            function nickname() {
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
            nickname();
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

    function movebothelp(bot, fd, e1) {
        var distance = getDistance(bot.x, bot.y, e1.x, e1.y);
        if (distance < bot.r + e1.r) {
            if (bot.r > e1.r) {
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
            } else if (bot.r == e1.r) {
                bot.currentMotion = Math.round(Math.random() * chance[16]);
            } else if (bot.r < e1.r) {
                if (e1.r < maxr) {
                    e1.r += rspeed;
                    speed(e1);
                }
                bot.r -= rspeed;
                speed(bot);
                if (bot.r <= 0) {
                    ctx.translate((player.x - w / 2), (player.y - h / 2));
                    respawn(bot);
                    bot.deaths++;
                    e1.kills++;
                    ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
                    table();
                }
            }
        }
    }

    function movebot(bot, fd, num) {
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
                if (!(fd[i] >= bot.x - 1 && fd[i] <= bot.x + 1)) {
                    if (fd[i] > bot.x) {
                        fd[i]--;
                    } else {
                        fd[i]++;
                    }
                }
                if (!(fd[i + 1] >= bot.y - 1 && fd[i + 1] <= bot.y + 1)) {
                    if (fd[i + 1] > bot.y) {
                        fd[i + 1]--;
                    } else {
                        fd[i + 1]++;
                    }
                }
                if (dist <= foodr + bot.r) {
                    if (bot.r < maxr) {
                        bot.r += rspeed;
                        speed(bot);
                    }
                    fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                    fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    while ((fd[i] >= bot.x - bot.r && fd[i] <= bot.x + bot.r && fd[i + 1] >= bot.y - bot.r && fd[i + 1] <= bot.y + bot.r) || (foodgenerate(fd, bot, 1, i) || foodgenerate(fd, bot, 2, i) || foodgenerate(fd, bot, 3, i) || foodgenerate(fd, bot, 4, i))) {
                        fd[i] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                        fd[i + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    }
                }
            }
        }
        for (var i = 0; i < bots.length; i++) {
            if (i !== num) {
                movebothelp(bot, fd, bots[i]);
            }
        }
    }

    function cond(bot, distance2, en1) {
        var dist3 = getDistance(bot.x, bot.y, en1.x, en1.y);
        if (dist3 == distance2[1] && bot.r < en1.r && dist3 <= bot.r + en1.r + 50) {
            return true;
        }
        return false;
    }

    function cond2(bot, en1) {
        if (!(bot.x >= en1.x - 1 && bot.x <= en1.x + 1)) {
            if (bot.x > en1.x) {
                bot.x += bot.xspeed;
                bot.xdirection = 1;
            } else {
                bot.x -= bot.xspeed;
                bot.xdirection = -1;
            }
        } else {
            bot.xdirection = 0;
        }
        if (!(bot.y >= en1.y - 1 && bot.y <= en1.y + 1)) {
            if (bot.y > en1.y) {
                bot.y += bot.yspeed;
                bot.ydirection = 1;
            } else {
                bot.y -= bot.yspeed;
                bot.ydirection = -1;
            }
        } else {
            bot.ydirection = 0;
        }
    }

    function botmove(ent, direction) {
        if (direction == 0) {
            ent.y -= ent.yspeed;
            ent.ydirection = -1;
            ent.xdirection = 0;
        }
        if (direction == 1) {
            ent.x += ent.xspeed;
            ent.y -= ent.yspeed;
            ent.xdirection = 1;
            ent.ydirection = -1;
        }
        if (direction == 2) {
            ent.x += ent.xspeed;
            ent.xdirection = 1;
            ent.ydirection = 0;
        }
        if (direction == 3) {
            ent.x += ent.xspeed;
            ent.y += ent.yspeed;
            ent.xdirection = 1;
            ent.ydirection = 1;
        }
        if (direction == 4) {
            ent.y += ent.yspeed;
            ent.ydirection = 1;
            ent.xdirection = 0;
        }
        if (direction == 5) {
            ent.x -= ent.xspeed;
            ent.y += ent.yspeed;
            ent.xdirection = -1;
            ent.ydirection = 1;
        }
        if (direction == 6) {
            ent.x -= ent.xspeed;
            ent.xdirection = -1;
            ent.ydirection = 0;
        }
        if (direction == 7) {
            ent.x -= ent.xspeed;
            ent.y -= ent.yspeed;
            ent.xdirection = -1;
            ent.ydirection = -1;
        }
    }

    function runbot(ent1, ent2) {
        var dist = getDistance(ent1.x, ent1.y, ent2.x, ent2.y);
        if (tick % 10 == 0) {
            ent2.typeOfMoyion = Math.round(Math.random() * 2);
        }
        if (dist <= ent1.r + ent2.r + 50 || ent1.xdirection == 0 && ent1.ydirection == 0) {
            if (!(ent2.x >= ent1.x - 1 && ent2.x <= ent1.x + 1)) {
                if (ent2.x > ent1.x) {
                    ent2.x += ent2.xspeed;
                    ent2.xdirection = 1;
                } else {
                    ent2.x -= ent2.xspeed;
                    ent2.xdirection = -1;
                }
            } else {
                ent2.xdirection = 0;
            }
            if (!(ent2.y >= ent1.y - 1 && ent2.y <= ent1.y + 1)) {
                if (ent2.y > ent1.y) {
                    ent2.y += ent2.yspeed;
                    ent2.ydirection = 1;
                } else {
                    ent2.y -= ent2.yspeed;
                    ent2.ydirection = +1;
                }
            } else {
                ent2.ydirection = 0;
            }
        } else {
            if (ent1.xdirection == 0 && ent1.ydirection == -1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 0);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 1);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 7);
                }
            }
            if (ent1.xdirection == 1 && ent1.ydirection == -1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 1);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 0);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 2);
                }
            }
            if (ent1.xdirection == 1 && ent1.ydirection == 0) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 2);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 1);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 3);
                }
            }
            if (ent1.xdirection == 1 && ent1.ydirection == 1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 3);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 2);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 4);
                }
            }
            if (ent1.xdirection == 0 && ent1.ydirection == 1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 4);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 3);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 5);
                }
            }
            if (ent1.xdirection == -1 && ent1.ydirection == 1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 5);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 4);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 6);
                }
            }
            if (ent1.xdirection == -1 && ent1.ydirection == 0) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 6);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 5);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 7);
                }
            }
            if (ent1.xdirection == -1 && ent1.ydirection == -1) {
                if (ent2.typeOfMoyion == 0) {
                    botmove(ent2, 7);
                }
                if (ent2.typeOfMoyion == 1) {
                    botmove(ent2, 6);
                }
                if (ent2.typeOfMoyion == 2) {
                    botmove(ent2, 0);
                }
            }
        }
    }

    function botRunWall(wall, ent1, ent2) {
        if (wall === 0) {
            if (ent1.y > ent2.y) {
                botmove(ent2, 0);
            } else {
                botmove(ent2, 4);
            }
        } else if (wall === 1) {
            if (ent1.x > ent2.x) {
                botmove(ent2, 6);
            } else {
                botmove(ent2, 2);
            }
        } else if (wall === 2) {
            if (ent1.x < scale * w - ent1.r * 2 && ent1.y > scale * h - ent1.r * 2) {
                botmove(ent2, 1);
            } else if (ent1.y < scale * h - ent1.r * 2 && ent1.x > scale * w - ent1.r * 2) {
                botmove(ent2, 5);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botmove(ent2, 5);
                } else {
                    botmove(ent2, 1);
                }
            }
        } else if (wall === 3) {
            if (ent1.x < scale * w - ent1.r * 2 && ent1.y < ent1.r * 2) {
                botmove(ent2, 3);
            } else if (ent1.x > scale * w - ent1.r * 2 && ent1.y > ent1.r * 2) {
                botmove(ent2, 7);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botmove(ent2, 7);
                } else {
                    botmove(ent2, 3);
                }
            }
        } else if (wall === 4) {
            if (ent1.x > ent1.r * 2 && ent1.y < ent1.r * 2) {
                botmove(ent2, 5);
            } else if (ent1.x < ent1.r * 2 && ent1.y > ent1.r * 2) {
                botmove(ent2, 1);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botmove(ent2, 1);
                } else {
                    botmove(ent2, 5);
                }
            }
        } else if (wall === 5) {
            if (ent1.x > ent1.r * 2 && ent1.y > scale * h - ent1.r * 2) {
                botmove(ent2, 7);
            } else if (ent1.x < ent1.r * 2 && ent1.y < scale * h - ent1.r * 2) {
                botmove(ent2, 3);
            } else {
                if (Math.floor(ent2.r) % 2 === 0) {
                    botmove(ent2, 3);
                } else {
                    botmove(ent2, 7);
                }
            }
        }
    }

    function interaction(distance2, bot, fd, dist2, e1, n) {
        var dist3 = getDistance(bot.x, bot.y, e1.x, e1.y),
            f = true;
        if (dist3 == distance2[0]) {
            if (dist3 <= dist2) {
                if (bot.r > e1.r) {
                    for (var i = 0; i < bots.length; i++) {
                        if (i !== n) {
                            if (cond(bot, distance2, bots[i])) {
                                f = false;
                                cond2(bot, bots[i]);
                            }
                        }
                    }
                    if (cond(bot, distance2, e1)) {
                        f = false;
                        cond2(bot, e1);
                    }
                    if (f) {
                        if (!(bot.x >= e1.x - 1 && bot.x <= e1.x + 1)) {
                            if (bot.x > e1.x) {
                                bot.x -= bot.xspeed;
                                bot.xdirection = -1;
                            } else {
                                bot.x += bot.xspeed;
                                bot.xdirection = 1;
                            }
                        } else {
                            bot.xdirection = 0;
                        }
                        if (!(bot.y >= e1.y - 1 && bot.y <= e1.y + 1)) {
                            if (bot.y > e1.y) {
                                bot.y -= bot.yspeed;
                                bot.ydirection = -1;
                            } else {
                                bot.y += bot.yspeed;
                                bot.ydirection = 1;
                            }
                        } else {
                            bot.ydirection = 0;
                        }
                        dist3 = getDistance(bot.x, bot.y, e1.x, e1.y);;
                        if (dist3 < bot.r + e1.r) {
                            if (bot.r < maxr) {
                                bot.r += rspeed;
                                speed(bot);
                            }
                            e1.r -= rspeed;
                            speed(e1);
                            if (e1.r <= 0) {
                                ctx.translate((player.x - w / 2), (player.y - h / 2));
                                respawn(e1);
                                bot.kills++;
                                e1.deaths++;
                                table();
                                ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
                            }
                        }
                    }
                } else if (bot.r == e1.r) {
                    bot.currentMotion = chance[chance.length - 1];
                } else {
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
                    dist3 = getDistance(bot.x, bot.y, e1.x, e1.y);
                    if (dist3 < bot.r + e1.r) {
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
            } else {
                bot.currentMotion = chance[chance.length - 1];
            }
        }
    }

    function botai(bot, fd, number) {
        var distance = [],
            nums = [],
            distance2 = [],
            dist, k;
        if (bot.step <= 0) {
            bot.step = Math.round(Math.random() * stepcount);
            bot.currentMotion = Math.round(Math.random() * mbc);
        }
        bot.step--;
        if (bot.currentMotion >= chance[0] && bot.currentMotion <= chance[1]) {
            botmove(bot, 0);
        } else if (bot.currentMotion >= chance[2] && bot.currentMotion <= chance[3]) {
            botmove(bot, 1);
        } else if (bot.currentMotion >= chance[4] && bot.currentMotion <= chance[5]) {
            botmove(bot, 2);
        } else if (bot.currentMotion >= chance[6] && bot.currentMotion <= chance[7]) {
            botmove(bot, 3);
        } else if (bot.currentMotion >= chance[8] && bot.currentMotion <= chance[9]) {
            botmove(bot, 4);
        } else if (bot.currentMotion >= chance[10] && bot.currentMotion <= chance[11]) {
            botmove(bot, 5);
        } else if (bot.currentMotion >= chance[12] && bot.currentMotion <= chance[13]) {
            botmove(bot, 6);
        } else if (bot.currentMotion >= chance[14] && bot.currentMotion <= chance[15]) {
            botmove(bot, 7);
        } else if (bot.currentMotion >= chance[16] && bot.currentMotion <= chance[17]) {
            for (var i = 0; i < bots.length; i++) {
                if (i !== number) {
                    distance2[distance2.length] = getDistance(bot.x, bot.y, bots[i].x, bots[i].y);
                }
            }
            distance2[distance2.length] = getDistance(bot.x, bot.y, player.x, player.y);
            distance2 = JSsort(distance2);
            if (distance2[0] !== getDistance(bot.x, bot.y, player.x, player.y)) {
                for (var i = 0; i < bots.length; i++) {
                    if (i !== number) {
                        interaction(distance2, bot, fd, bot.r + bots[i].r + razt, bots[i], number);
                    }
                }
            } else {
                interaction(distance2, bot, fd, bot.r + player.r + razt, player, number);
            }
        } else if (bot.currentMotion >= chance[18] && bot.currentMotion <= chance[19]) {
            for (var i = 0; i < foodcount * 2; i += 2) {
                distance[i] = getDistance(bot.x, bot.y, fd[i], fd[i + 1]);
                nums[i] = i;
            }
            for (var i = 0; i < distance.length - 1; i += 2) {
                for (var j = 0; j < distance.length - i - 1; j += 2) {
                    if (distance[j] > distance[j + 2]) {
                        k = distance[j];
                        distance[j] = distance[j + 2];
                        distance[j + 2] = k;
                        k = nums[j];
                        nums[j] = nums[j + 2];
                        nums[j + 2] = k;
                    }
                }
            }
            if (!(fd[nums[0]] >= bot.x - 1 && fd[nums[0]] <= bot.x + 1)) {
                if (bot.x > fd[nums[0]]) {
                    bot.x -= bot.xspeed;
                    bot.xdirection = -1;
                } else {
                    bot.x += bot.xspeed;
                    bot.xdirection = 1;
                }
            } else {
                bot.xdirection = 0;
            }
            if (!(fd[nums[0] + 1] >= bot.y - 1 && fd[nums[0] + 1] <= bot.y + 1)) {
                if (bot.y > fd[nums[0] + 1]) {
                    bot.y -= bot.yspeed;
                    bot.ydirection = -1;
                } else {
                    bot.y += bot.yspeed;
                    bot.ydirection = 1;
                }
            } else {
                bot.ydirection = 0;
            }
            dist = Math.sqrt((fd[nums[0]] - bot.x) * (fd[nums[0]] - bot.x) + (fd[nums[0] + 1] - bot.y) * (fd[nums[0] + 1] - bot.y));
            if (dist <= foodr + bot.r + fdd) {
                if (!(fd[nums[0]] >= bot.x - 1 && fd[nums[0]] <= bot.x + 1)) {
                    if (fd[nums[0]] > bot.x) {
                        fd[nums[0]]--;
                    } else {
                        fd[nums[0]]++;
                    }
                }
                if (!(fd[nums[0] + 1] >= bot.y - 1 && fd[nums[0] + 1] <= bot.y + 1)) {
                    if (fd[nums[0] + 1] > bot.y) {
                        fd[nums[0] + 1]--;
                    } else {
                        fd[nums[0] + 1]++;
                    }
                }
                if (dist <= foodr + bot.r) {
                    if (bot.r < maxr) {
                        bot.r += rspeed;
                        speed(bot);
                    }
                    fd[nums[0]] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                    fd[nums[0] + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    while ((fd[nums[0]] >= bot.x - bot.r && fd[nums[0]] <= bot.x + bot.r && fd[nums[0] + 1] >= bot.y - bot.r && fd[nums[0] + 1] <= bot.y + bot.r) || (foodgenerate(fd, bot, 1, i) || foodgenerate(fd, bot, 2, i) || foodgenerate(fd, bot, 3, i) || foodgenerate(fd, bot, 4, i))) {
                        fd[nums[0]] = Math.round(Math.random() * (scale * w - foodr * 2) + foodr);
                        fd[nums[0] + 1] = Math.round(Math.random() * (scale * h - foodr * 2) + foodr);
                    }
                }
            }
        }
        movebot(bot, fd, number);
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

    function radius(ent) {
        if (ent.r / maxr >= 0.2) {
            ent.r -= rspeed;
        }
        if (ent.r / maxr >= 0.35) {
            ent.r -= rspeed * 2;
        }
        if (ent.r / maxr >= 0.5) {
            ent.r -= rspeed * Math.round(Math.random() * 3);
        }
        if (ent.r / maxr >= 0.7) {
            ent.r -= rspeed * Math.round(Math.random() * 5);
        }
        if (ent.r / maxr >= 0.85) {
            ent.r -= rspeed * Math.round(Math.random() * dr);
        }
        if (ent.r / maxr >= 0.95) {
            ent.r -= rspeed * Math.round(Math.random() * dr * 2);
        }
    }

    $('#canvas2').css("bottom", "45px");
    $('#canvas2').css("right", "5px");

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
        for (var i = 0; i < bots.length + 1; i++) {
            if (name[i] == player.name) {
                drawtext("" + ((i + 1) + '. ' + name[i] + ' (' + rads[i] + ')') + "", "rgba(200, 0, 0, 0.95)", 20, canvas3.width / 2, 55 + 25 * i);
            } else {
                drawtext("" + ((i + 1) + '. ' + name[i] + ' (' + rads[i] + ')') + "", "rgba(255, 255, 255, 0.95)", 20, canvas3.width / 2, 55 + 25 * i);
            }
        }
    }

    function game() {
        tick += 1;
        showInfo();
        ctx.clearRect(-scale * w, -scale * h, 3 * scale * w, 3 * scale * h);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
        var rows = (w * scale) / maz;
        var cols = (h * scale) / maz;
        leaderboard();
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
        var a = player.r;
        drawobj(player);
        for (var i = 0; i < bots.length; i++) {
            drawobj(bots[i]);
            botai(bots[i], food, i);
        }
        drawfood(food, foodcolor);
        movebot(player, food, -1);
        if (canPlay) {
            moveplayer(player);
        }
        // if (tick % (Math.floor(60 / decreaseSpeed)) == 0) {
        //     radius(player);
        //     radius(bot1);
        // }
        var b = player.r;
        var c = 3;
        if (b > a && player.r >= dr) {
            var z = a;
            while (z < b) {
                z += 0.5;
                ctx.translate((player.x - w / 2), (player.y - h / 2));
                ctx.scale(1 - c * ((0.5) * 0.002), 1 - c * ((0.5) * 0.002));
                ctx.translate((c * w * ((0.5) / 1000)), (c * h * ((0.5) / 1000)));
                ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
            }
        }
        if (b < a && player.r >= dr) {
            var q = b;
            while (q < a) {
                q += 0.5;
                ctx.translate((player.x - w / 2), (player.y - h / 2));
                ctx.scale(1 + c * ((0.5) * 0.002), 1 + c * ((0.5) * 0.002));
                ctx.translate(-(c * w * ((0.5) / 1000)), -(c * h * ((0.5) / 1000)));
                ctx.translate(-(player.x - w / 2), -(player.y - h / 2));
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
