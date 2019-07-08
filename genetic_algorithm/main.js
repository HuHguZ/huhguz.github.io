const getElem = id => document.getElementById(id);
const nextGameStep = requestAnimationFrame ||
    mozRequestAnimationFrame ||
    webkitRequestAnimationFrame ||
    oRequestAnimationFrame ||
    msRequestAnimationFrame;
const canvas = getElem(`canvas`);
const ctx = canvas.getContext(`2d`);
const w = canvas.width = window.innerWidth;
const h = canvas.height = window.innerHeight;
let x = w;
const game = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = `red`;
    ctx.arc(x--, 200, 20, 0, Math.PI * 2, true);
    ctx.fill();
    nextGameStep(game);
};
game();
