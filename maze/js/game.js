window.addEventListener('load', function() {
    let getElem = id => document.getElementById(id),
        scale = 10,
        canvas = getElem('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        maze = [],
        end = {},
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
            end.x = sw - 2;
            end.y = sh - 1;
            maze[end.x][end.y] = 0;
        },
        generateMaze = () => {
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
        Astar = () => {
            let cells = {},
                open = {},
                stack = [],
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
            for (let i = 1; i < sw - 1; i++) {
                for (let j = 1; j < sh - 1; j++) {
                    if (!maze[i][j]) {
                        cells[`${i},${j}`] = {
                            x: i,
                            y: j,
                            visited: 0
                        };
                    }
                }
            }
            open[`${1},${1}`] = cells[`${1},${1}`];
            open[`${1},${1}`].g = open[`${1},${1}`].h = open[`${1},${1}`].f = 0;
            while (1) {
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
                if (current.x == end.x && current.y == end.y - 1) {
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
            path.push(end);
            current = cells[`${end.x},${sh - 2}`];
            while (current) {
                path.push(current);
                current = current.whence;
            }
                            ctx.fillStyle = `green`;

            for (let i = 0; i < path.length; i++) {
                ctx.fillRect(path[i].x * scale, path[i].y * scale, scale, scale);
            }
        },
        drawMaze = () => {
            ctx.clearRect(0, 0, w, h); //ПОТОМ УБРАТЬ
            ctx.fillStyle = `black`;
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
    Astar();
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