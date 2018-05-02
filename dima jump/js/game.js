window.addEventListener('load', function() {
    var canvas = getElem('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        elements = {
            play: getElem('play')
        },
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
    var img = new Image();
    img.src = 'resources/images/dima1.png';
    playSound('resources/sounds/gachi/gachi1.mp3');

    function getElem(id) {
        return document.getElementById(id);
    }

    function playSound(src) {
        var sound = new Audio();
        sound.src = src;
        sound.play();
    }
    setInterval(function() {
        colors.randomize();
        elements.play.style.background = `linear-gradient(to top left, rgb(${colors.rgb1[0]}, ${colors.rgb1[1]}, ${colors.rgb1[2]}), rgb(${colors.rgb2[0]}, ${colors.rgb2[1]}, ${colors.rgb2[2]}))`;
    }, 10);

    function game() {
        ctx.beginPath();
        ctx.drawImage(img, 10, 10, 10 ** 2, 10 ** 2);
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