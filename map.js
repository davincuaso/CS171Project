function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}

function getPosition(x, y){
    return {
        x: x,
        y: y
    }
}

const startPos = getPosition(0,15);

let endPos;
while (!endPos || map.getTile(endPos.x, endPos.y) == 1) {
    let x = getRandomInt(0, map.cols);
    let y = getRandomInt(0, map.rows);
    endPos = getPosition(x, y);
}

function renderMap(map) {
    let canvas = document.getElementById('map-layer');
    let ctx = canvas.getContext('2d');

    for (let r = 0; r < map.rows; r++) {
        for (let c = 0; c < map.cols; c++) {
            let styles = ['green', 'grey'];
            let fillStyle = styles[map.getTile(c, r)];

            drawTile(ctx, c, r, map.tSize, fillStyle);
        }
    }
}

function drawTile(ctx, x, y, size, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.rect(x * size, y * size, size, size);
    ctx.fill();
    ctx.stroke();
}

function drawCircle(ctx, x, y, r, size, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.arc(
        ((x * size) + (size / 2)),
        ((y * size) + (size / 2)),
        r,
        0,
        2 * Math.PI);
    ctx.fill();
}

function drawRoute(route) {

    let canvas = document.getElementById('route-layer');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, map.cols * map.tSize, map.rows * map.tSize);

    if (!route) {
        return;
    }

    for (let i = 1; i < route.length - 1; i++) {
        let routeSegment = route[i];

        drawCircle(ctx, routeSegment.x, routeSegment.y, 5, map.tSize, 'PaleGreen');
        //ctx.fillStyle = 'black';
        //ctx.fillText(i, ((routeSegment.x * map.tSize) + 10), ((routeSegment.y * map.tSize) + (map.tSize / 2)));
    }
}

function renderPositions(map, startPos, endPos) {
    let playerCanvas = document.getElementById('player-layer');
    let playerCanvasCtx = playerCanvas.getContext('2d');

    playerCanvasCtx.clearRect(0, 0, map.cols * map.tSize, map.rows * map.tSize);

    drawCircle(playerCanvasCtx, startPos.x, startPos.y, 10, map.tSize, 'red');
    drawCircle(playerCanvasCtx, endPos.x, endPos.y, 10, map.tSize, 'blue');
}

function findRoute() {
    let route = astar.search(map, startPos, endPos);
    drawRoute(route);
}

let gameViewport = document.getElementById('game-viewport');
let width = map.cols * map.tSize;
let height = map.rows * map.tSize;
gameViewport.style.width = width;
gameViewport.style.height = height;

let layers = ['map-layer', 'route-layer', 'player-layer'];
for (let i = 0; i < layers.length; i++) {
    var layer = document.createElement('canvas');
    layer.id = layers[i];
    layer.style.cssText = 'z-index:' + i + ';'
    layer.setAttribute('height', height);
    layer.setAttribute('width', width);
    gameViewport.appendChild(layer);
}

let canvas = document.getElementById('player-layer');
let offsetLeft = canvas.offsetLeft;
let offsetTop = canvas.offsetTop;

canvas.addEventListener('click', function () {
    var x = Math.floor((event.pageX - offsetLeft) / map.tSize);
    var y = Math.floor((event.pageY - offsetTop) / map.tSize);

    endPos = getPosition(x, y);

    renderPositions(map, startPos, endPos);
    findRoute();

}, false);

renderMap(map);
renderPositions(map, startPos, endPos);
findRoute();