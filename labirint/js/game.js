window.addEventListener('load', function() {
    let getElem = id => document.getElementById(id),
        scale = 20,
        canvas = getElem('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        maze = [],
        sw = Math.floor(w / scale),
        sh = Math.floor(h / scale),
        offset = w - (scale * sw),
        person = {
            x: 1,
            y: 1,
        },
        initialize = () => {
            sw = !(sw % 2) ? sw - 1 : sw;
            sh = !(sh % 2) ? sh - 1 : sh;
            for (let i = 0; i < sw; i++) {
                maze[i] = [];
                for (let j = 0; j < sh; j++) {
                    if (!i || i == sw - 1 || !j || j == sh - 1 || !(i % 2) || !(j % 2)) {
                        maze[i][j] = 1;
                    } else {
                        maze[i][j] = 0;
                    }
                }
            }
            maze[sw - 2][sh - 1] = 0;
        },
        generateMaze = () => {
            //https://habr.com/post/262345/ объяснение алгоритма
            let unvisited = {},
                unvCount = -1,
                stack = [],
                getUnvisitedNeighbors = (x, y) => {
                    let neighbors = [];
                    if (unvisited[`${x - 2},${y}`]) {
                        neighbors.push(unvisited[`${x - 2},${y}`]);
                    }
                    if (unvisited[`${x + 2},${y}`]) {
                        neighbors.push(unvisited[`${x + 2},${y}`]);
                    }
                    if (unvisited[`${x},${y - 2}`]) {
                        neighbors.push(unvisited[`${x},${y - 2}`]);
                    }
                    if (unvisited[`${x},${y + 2}`]) {
                        neighbors.push(unvisited[`${x},${y + 2}`]);
                    }
                    return neighbors;
                };
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    if ((i % 2) && (j % 2)) {
                        unvisited[`${i},${j}`] = {
                            x: i,
                            y: j
                        };
                        unvCount++;
                    }
                }
            }
            let current = unvisited[`${1},${1}`];
            delete unvisited[`${1},${1}`];
            // setInterval(() => {
            //     drawMaze();
            //     if (unvCount) {
            //         let neigs = getUnvisitedNeighbors(current.x, current.y);
            //         if (neigs.length) {
            //             let pos = Math.random() * neigs.length ^ 0;
            //             stack.push(current);
            //             maze[neigs[pos].x == current.x ? current.x : neigs[pos].x > current.x ? neigs[pos].x - 1 : neigs[pos].x + 1][neigs[pos].y == current.y ? current.y : neigs[pos].y > current.y ? neigs[pos].y - 1 : neigs[pos].y + 1] = 0;
            //             current = neigs[pos];
            //             delete unvisited[`${current.x},${current.y}`];
            //             unvCount--;
            //         } else if (stack.length) {
            //             current = stack.pop();
            //         }
            //     }
            // }, 10);
            while (unvCount) {
                let neigs = getUnvisitedNeighbors(current.x, current.y);
                if (neigs.length) {
                    let pos = Math.random() * neigs.length ^ 0;
                    stack.push(current);
                    maze[neigs[pos].x == current.x ? current.x : neigs[pos].x > current.x ? neigs[pos].x - 1 : neigs[pos].x + 1][neigs[pos].y == current.y ? current.y : neigs[pos].y > current.y ? neigs[pos].y - 1 : neigs[pos].y + 1] = 0;
                    current = neigs[pos];
                    delete unvisited[`${current.x},${current.y}`];
                    unvCount--;
                } else if (stack.length) {
                    current = stack.pop();
                }
            }
        },
        drawMaze = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < sw; i++) {
                for (let j = 0; j < sh; j++) {
                    if (maze[i][j]) {
                        ctx.fillRect(i * scale, j * scale, scale, scale);
                    }
                }
            }
        };
    initialize();
    generateMaze();
    drawMaze();
    ctx.fillStyle = `blue`;
    ctx.fillRect(person.x * scale, person.y * scale, scale, scale);
    document.addEventListener(`keypress`, e => {
        ctx.clearRect(person.x * scale, person.y * scale, scale, scale);
        if (e.key.match(/^[wц]$/i) && !maze[person.x][person.y - 1]) {
            person.y--;
        } else if (e.key.match(/^[фa]$/i) && !maze[person.x - 1][person.y]) {
            person.x--;
        } else if (e.key.match(/^[ыs]$/i) && !maze[person.x][person.y + 1]) {
            person.y++;
        } else if (e.key.match(/^[вd]$/i) && !maze[person.x + 1][person.y]) {
            person.x++;
        }
        ctx.fillRect(person.x * scale, person.y * scale, scale, scale);
    });
});









// ctx.beginPath();
// ctx.lineWidth = scale;
// ctx.moveTo(0, scale/2);
// ctx.lineTo(scale * sw, scale/2);
// ctx.stroke();