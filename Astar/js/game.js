﻿window.addEventListener('load', function() {
    let getElem = id => document.getElementById(id),
        scale = 30,
        canvas = getElem('canvas'),
        ctx = canvas.getContext('2d'),
        w,
        h,
        oldX, oldY,
        maze = [],
        end = {},
        start = {},
        sw,
        sh,
        offset = w - (scale * sw),
        mouse = {
            x: 0,
            y: 0
        },
        initialize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            sw = Math.floor(w / scale);
            sh = Math.floor(h / scale);
            sw = !(sw % 2) ? sw - 1 : sw;
            sh = !(sh % 2) ? sh - 1 : sh;
            for (let i = 0; i < sw; i++) {
                maze[i] = [];
                for (let j = 0; j < sh; j++) {
                    maze[i][j] = 0;
                }
            }
            start.x = start.y = 0;
            end.x = sw - 1;
            end.y = sh - 1;
        },
        Astar = () => {
            let cells = {},
                open = {},
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
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    if (!maze[i][j]) {
                        cells[`${i},${j}`] = {
                            x: i,
                            y: j,
                            visited: 0
                        };
                    }
                }
            }
            let prp = `${start.x},${start.y}`;
            open[prp] = cells[prp];
            open[prp].g = open[prp].h = open[prp].f = 0;
            let counter = 0,
                f1 = true,
                f2 = true;
            let interval = setInterval(() => {
                if (f1) {
                    let minprop = Object.keys(open)[0],
                        min;
                    if (open[minprop] == undefined) {
                        f1 = f2 = false;
                        return;
                    } else {
                        min = open[minprop].f;
                    }
                    for (let prop in open) {
                        if (min > open[prop].f) {
                            min = open[prop].f;
                            minprop = prop;
                        }
                    }
                    current = open[minprop];
                    delete open[minprop];
                    current.visited = 1;
                    if ((current.x != start.x || current.y != start.y) && (current.x != end.x || current.y != end.y)) {
                        let p = heuristic(current.x, current.y, end.x, end.y) / heuristic(start.x, start.y, end.x, end.y);
                        ctx.fillStyle = `rgb(${Math.floor(p * 255)}, ${Math.floor((1 - p) * 255)}, 0)`;
                        ctx.fillRect(current.x * scale, current.y * scale, scale, scale);
                    }
                    if (current.x == end.x && current.y == end.y) {
                        f1 = false;
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
                        if ((neigs[i].x != start.x || neigs[i].y != start.y) && (neigs[i].x != end.x || neigs[i].y != end.y)) {
                            let p = neigs[i].h / heuristic(start.x, start.y, end.x, end.y);
                            ctx.fillStyle = `rgb(${Math.floor((1 - p) * 255)}, ${Math.floor(p * 255)}, 0)`;
                            ctx.fillRect(neigs[i].x * scale, neigs[i].y * scale, scale, scale);
                        }
                    }
                } else {
                    if (f2) {
                        current = cells[`${end.x},${end.y}`].whence;
                        while (current.x != start.x || current.y != start.y) {
                            path.push(current);
                            current = current.whence;
                        }
                        f2 = !f2;
                    }
                    if (counter < path.length) {
                        ctx.fillStyle = `green`;
                        ctx.fillRect(path[counter].x * scale, path[counter].y * scale, scale, scale);
                        counter++;
                    } else {
                        clearInterval(interval);
                    }
                }

            }, 1);
        },
        drawMaze = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    if (i == start.x && j == start.y) {
                        ctx.fillStyle = `#00f`;
                    } else if (i == end.x && j == end.y) {
                        ctx.fillStyle = `#ff00e1`;
                    } else if (maze[i][j]) {
                        ctx.fillStyle = `black`;
                    } else {
                        ctx.fillStyle = `white`;
                    }
                    ctx.fillRect(i * scale, j * scale, scale, scale);
                }
            }
        },
        cb = e => {
            let x = Math.floor(e.offsetX / scale),
                y = Math.floor(e.offsetY / scale);
            if (x == oldX && y == oldY || (x == start.x && y == start.y) || (x == end.x && y == end.y) || maze[x] == undefined) {
                return;
            }
            maze[x][y] = +!maze[x][y];
            drawMaze();
            oldX = x;
            oldY = y;
        };
    initialize();
    drawMaze();
    document.addEventListener(`mousedown`, () => {
        document.addEventListener(`mousemove`, cb);
        document.addEventListener(`mouseup`, () => {
            document.removeEventListener(`mousemove`, cb);
        });
    });
    document.addEventListener(`mousemove`, e => {
        mouse.x = Math.floor(e.offsetX / scale);
        mouse.y = Math.floor(e.offsetY / scale);
    });
    document.addEventListener(`click`, cb);
    getElem(`res`).addEventListener(`click`, Astar);
    document.addEventListener(`keypress`, e => {
        if (e.key.match(/^[qй]$/i)) {
            Astar();
        } else if (e.key.match(/^[sы]$/i) && (mouse.x != end.x || mouse.y != end.y)) {
            start.x = mouse.x;
            start.y = mouse.y;
            maze[mouse.x][mouse.y] = 0;
            drawMaze();
        } else if (e.key.match(/^[eу]$/i) && (mouse.x != start.x || mouse.y != start.y)) {
            end.x = mouse.x;
            end.y = mouse.y;
            maze[mouse.x][mouse.y] = 0;
            drawMaze();
        } else if (e.key.match(/^[cс]$/i)) {
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    maze[i][j] = 0;
                }
            }
            drawMaze();
        } else if (e.key.match(/^[fа]$/i)) {
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    maze[i][j] = (i != start.x || j != start.y) && (i != end.x || j != end.y) ? 1 : 0;
                }
            }
            drawMaze();
        } else if (e.key.match(/^[dв]$/i)) {
            drawMaze();
        } else if (e.key.match(/^[uг]$/i)) {
            scale = +prompt(`Введите новый масштаб`, scale) || scale;
            initialize();
            drawMaze();
        }
    });
});