var loaded = 0;

var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

const TOTAL_IMAGES = 1;
const RES = 1;
const PLAYER_WIDTH = 4;
const PLAYER_SPEED = 2;

var mouseX = 0;
var mouseY = 0;

var playerX = 0;
var playerY = 0;
var playerMoveX = 0;
var playerMoveY = 0;

var pistolImage;

//#region load images

window.onload = function () {
    pistolImage = new Image(10, 10);
    pistolImage.src = "ASSETS/pistol_emojidex.png";
    pistolImage.onload = markAsLoaded; // Draw when image has loaded

    function markAsLoaded() {
        loaded++;
    }
};

//#endregion load images

//#region load loop

function load() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (loaded >= TOTAL_IMAGES) {
        window.requestAnimationFrame(game);
    } else {
        window.requestAnimationFrame(load);
    }
}

window.requestAnimationFrame(load);

//#endregion load loop

//#region game loop

var x = 0;

var playerAngle = 0;

var tickX = 0;
var tickY = 0;

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;

var playerMoveAmmount = 0;

function game() {
    canvas.width = window.innerWidth / RES;
    canvas.height = window.innerHeight / RES;

    var dx = mouseX - canvas.width / 2 - playerX
    var dy = mouseY - canvas.height / 2 - playerY

    

    playerAngle = Math.atan2(dy, dx);

    if (keyD == true) {
        playerMoveX += 1;
        playerMoveAmmount = 1;
    }
    if (keyS == true) {
        playerMoveY += 1;
        playerMoveAmmount = 1;
    }
    if (keyA == true) {
        playerMoveX -= 1;
        playerMoveAmmount = 1;
    }
    if (keyW == true) {
        playerMoveY -= 1;
        playerMoveAmmount = 1;
    }

    playerMoveAngle = Math.atan2(playerMoveY, playerMoveX);

    playerMoveX /= 1.1;
    playerMoveY /= 1.1;

    playerMoveAmmount /= 1.1;

    playerX += PLAYER_SPEED * Math.cos(playerMoveAngle) * playerMoveAmmount;
    playerY += PLAYER_SPEED * Math.sin(playerMoveAngle) * playerMoveAmmount;

    x++;

    //playerAngle = Math.atan2((canvas.height / 2 - mouseY) , (canvas.width / 2 - mouseX))

    //#region canvas rendering

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillRect(
        canvas.width / 2 + playerX - PLAYER_WIDTH / 2,
        canvas.height / 2 + playerY - PLAYER_WIDTH / 2,
        PLAYER_WIDTH,
        PLAYER_WIDTH
    );

    ctx.save();

    

    ctx.translate(canvas.width / 2 + playerX, canvas.height / 2 + playerY);
    ctx.rotate(Math.PI); // ROTATE IMAGE BY 180
    ctx.rotate(playerAngle);

    //ctx.fillRect(0, 0, 40, PLAYER_WIDTH);

    if (dx > 0)
    {
        ctx.scale(1,-1)
    }
    ctx.drawImage(pistolImage, -25 / RES, -25 / RES, 25 / RES, 25 / RES);

    ctx.restore();

    //#endregion canvas rendering

    window.requestAnimationFrame(game);
}

//#endregion game loop

document.addEventListener("mousemove", function (event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
    
});

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;

    switch (keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}
