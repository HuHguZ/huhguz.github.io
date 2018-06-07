window.addEventListener('load', function() {
    var canvas = getElem('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        elements = {
            play: getElem('play')
        },
        resources = {
            images: [],
            sounds: []
        },
        balls = [],
        uploaded = false,
        loadCount = 0,
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
        };

    function load() {
        loadCount++;
        if (0) {
            uploaded = !uploaded;
        }
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.fillRect(10, 10, 100, 100);
    }







    function getElem(id) {
        return document.getElementById(id);
    }

    document.addEventListener('click', function func() {
        playSound('resources/sounds/gachi/gachi1.mp3');
        document.removeEventListener('click', func);
    });

    function playSound(src) {
        var sound = new Audio();
        sound.src = src;
        sound.play();
    }

    // Сюда класс мячей
    setInterval(function() {
        colors.randomize();
        elements.play.style.background = `linear-gradient(to top left, rgb(${colors.rgb1[0]}, ${colors.rgb1[1]}, ${colors.rgb1[2]}), rgb(${colors.rgb2[0]}, ${colors.rgb2[1]}, ${colors.rgb2[2]}))`;
    }, 10);
    elements.play.addEventListener('click', function() {
        alert(1);
    });
    setInterval(function() {
        elements.play.style.right = `${10 + Math.random() * 80}vw`;
        elements.play.style.top = `${10 + Math.random() * 80}vh`;
    }, 400);

    function game() {
        ctx.beginPath();
        load();
        // ctx.drawImage(img, w / 2 - 100, h / 2 - 100, 10 ** 2, 10 ** 2);
        nextGameStep(game);
    }
    var nextGameStep = (function() {
        return requestAnimationFrame ||
            mozRequestAnimationFrame ||
            webkitRequestAnimationFrame ||
            oRequestAnimationFrame ||
            msRequestAnimationFrame;﻿
    })();
    var upl = function() {
        if (uploaded) {
            game();
            clearInterval(upl);
        }
    }
    upl = setInterval(upl, 100);
});