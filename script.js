var loaded = 0;

var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

const TOTAL_IMAGES = 1;

const RES = 2;

// set the canvas to the proper size (NEEDS to be done in this scope)
canvas.width = window.innerWidth / RES;
canvas.height = window.innerHeight / RES;

const PLAYER_WIDTH = 4;
const PLAYER_SPEED = 6;

const CROSSHAIR_WIDTH = 4;

const PROJECTILE_SPEED = 6;
const PROJECTILE_WIDTH = 4;

const ENEMY_WIDTH = 4;
const ENEMY_SPEED = 1
const ENEMY_SPAWN_RANDOM_AMMOUNT = 25;

const weapons = [
    {
        // SQUIRT GUN
        flip: true,
        fireAmmount: 1,
        image: null,
    },
    {
        // NERF SG
        flip: false,
        fireAmmount: 3,
        image: null,
    },
]

var weaponIndex = 0;

var enemyCount = 10;

var mouseLocked = false;

var mouseX = 0;
var mouseY = 0;

var playerX = window.innerWidth / RES / 2;
var playerY = window.innerHeight / RES / 2;
var playerMoveX = 0;
var playerMoveY = 0;
var playerMovementX = 0;
var playerMovementY = 0;

const display = document.getElementById("display")

var waterPistolImage;

//#region load images

window.onload = function () {
    waterPistolImage = new Image(10, 10);
    waterPistolImage.src = "ASSETS/pistol_emojidex.png";
    waterPistolImage.onload = markAsLoaded; // Draw when image has loaded

    function markAsLoaded() {
        loaded++;
    }
};

//#endregion load images

//#region load loop

function load() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (loaded >= TOTAL_IMAGES) {
        weapon[0].image = waterPistolImage
        
        setupGame();
        window.requestAnimationFrame(game);
    } else {
        window.requestAnimationFrame(load);
    }
}

window.requestAnimationFrame(load);

//#endregion load loop

//#region game loop

var projectiles = []; // dont worry its water i SWEAR not bullets

var deleteProjectiles = [];

var enemies = [];

var deleteEnemies = [];

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
    // set the canvas to the proper size (NEEDS to be done in this scope)
    canvas.width = window.innerWidth / RES;
    canvas.height = window.innerHeight / RES;

    //#region set variables

    let weapon = weapons[weaponIndex]

    //#endregion set variables

    //#region player angle and movement
    var dx = (mouseX - playerX * RES) / RES
    var dy = (mouseY - playerY * RES) / RES

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

    playerX += PLAYER_SPEED / RES * Math.cos(playerMoveAngle) * playerMoveAmmount;
    playerY += PLAYER_SPEED / RES * Math.sin(playerMoveAngle) * playerMoveAmmount;

    //#endregion player angle and movement

    //#region canvas rendering

    // clear our canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //#region projectiles
    for (let i = 0; i < projectiles.length; i++) {
        let projectile = projectiles[i]

        if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
            deleteProjectiles.push(i);
            continue;
        }

        ctx.fillStyle = "dodgerBlue";

        ctx.fillRect(
            Math.round(projectile.x - PROJECTILE_WIDTH / 2),
            Math.round(projectile.y - PROJECTILE_WIDTH / 2),
            PROJECTILE_WIDTH,
            PROJECTILE_WIDTH
        );

        projectile.x += projectile.xs
        projectile.y += projectile.ys
    };

    for (let i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "red";

        let enemy = enemies[i]

        ctx.fillRect(
            Math.round(enemy.x - ENEMY_WIDTH / 2),
            Math.round(enemy.y - ENEMY_WIDTH / 2),
            ENEMY_WIDTH,
            ENEMY_WIDTH
        );

        const enemyAngle = Math.atan2((playerY - enemy.y), (playerX - enemy.x))

        enemy.x += Math.cos(enemyAngle) * ENEMY_SPEED + (Math.random() * 2 - 1)
        enemy.y += Math.sin(enemyAngle) * ENEMY_SPEED + (Math.random() * 2 - 1)

        for (let i2 = 0; i2 < projectiles.length; i2++) {
            const projectile = projectiles[i2]

            if (PROJECTILE_WIDTH > Math.sqrt((enemy.x - projectile.x) ** 2 + (enemy.y - projectile.y) ** 2)) {
                deleteEnemies.push(i);
                deleteProjectiles.push(i2);
                continue;
            }
        }
    }

    for (let i = 0; i < deleteProjectiles.length; i++) {
        projectiles.splice(deleteProjectiles[i] - i, 1)
    };

    deleteProjectiles = [];

    for (let i = 0; i < deleteEnemies.length; i++) {
        enemies.splice(deleteEnemies[i] - i, 1)
    };

    deleteEnemies = [];

    //#endregion projectiles

    // save our canvas (we've just done all our "normal" canvas rendering)
    ctx.save();

    // move our drawing to where our player is
    ctx.translate(playerX, playerY);
    if (weapon.flip) {
        // rotate our canvas by 180
        ctx.rotate(Math.PI);
    }
    // rotate our canvas by our player angle
    ctx.rotate(playerAngle);

    // if our mouse is to the right of our player, flip our canvas so that our squirt gun renders correctly
    if (dx > 0) {
        ctx.scale(1, -1)
    }

    // draw the squirt gun
    ctx.drawImage(weapon.image, -25 / RES, -12.5 / RES, 25 / RES, 25 / RES);

    // restore our canvas to how it previously was
    ctx.restore();

    ctx.fillStyle = "black"

    // draw the player
    ctx.fillRect(
        Math.round(playerX - PLAYER_WIDTH / 2),
        Math.round(playerY - PLAYER_WIDTH / 2),
        PLAYER_WIDTH,
        PLAYER_WIDTH
    );

    ctx.fillStyle = "rgb(0, 255, 0)"

    ctx.fillRect(
        Math.round(mouseX / RES - CROSSHAIR_WIDTH / 2),
        Math.round(mouseY / RES - CROSSHAIR_WIDTH / 2),
        CROSSHAIR_WIDTH,
        CROSSHAIR_WIDTH
    );

    //#endregion canvas rendering

    if (enemies.length == 0) {
        enemyCount *= 2;
        setupGame();
    }

    window.requestAnimationFrame(game);
}

//#endregion game loop

document.addEventListener("mousemove", function (event) {
    if (mouseLocked) {
        mouseX += event.movementX;
        mouseY += event.movementY;

        if (mouseY > canvas.height * RES) {
            mouseY = canvas.height * RES
        } else if (mouseY < 0) {
            mouseY = 0
        }

        if (mouseX > canvas.width * RES) {
            mouseX = canvas.width * RES
        } else if (mouseX < 0) {
            mouseX = 0
        }
    } else {
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
});

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

window.addEventListener("mousedown", fire, false);

function onKeyDown(event) {
    var key = event.key;

    switch (key) {
        case "d": //d
            keyD = true;
            break;
        case "s": //s
            keyS = true;
            break;
        case "a": //a
            keyA = true;
            break;
        case "w": //w
            keyW = true;
            break;
        case " ":
            fire();
            break;
        case "1":
            
    }
}

function onKeyUp(event) {
    var key = event.key;

    switch (key) {
        case "d": //d
            keyD = false;
            break;
        case "s": //s
            keyS = false;
            break;
        case "a": //a
            keyA = false;
            break;
        case "w": //w
            keyW = false;
            break;
    }
}

function fire() {
    projectiles.push({
        x: playerX + Math.cos(playerAngle) * 13,
        y: playerY + Math.sin(playerAngle) * 13,
        xs: Math.cos(playerAngle) * PROJECTILE_SPEED,
        ys: Math.sin(playerAngle) * PROJECTILE_SPEED
    })
}

function AbsMax(num1, num2) {
    let absNum1 = Math.abs(num1)
    let absNum2 = Math.abs(num2)

    if (absNum1 >= absNum2) {
        return num1
    } else {
        return num2
    }
}

function setupGame() {
    for (let _ = 0; _ < enemyCount; _++) {

        let enemyDist = canvas.width / 2 * (Math.round(Math.random()) * 2 - 1) // + or - canvas width

        let enemyAngle = (Math.random() * (Math.PI * 4))

        enemies.push({
            x: canvas.width / 2 + Math.cos(enemyAngle) * enemyDist,
            y: canvas.height / 2 + Math.sin(enemyAngle) * enemyDist
        })
    }
}

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
});

document.addEventListener("pointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas) {
        mouseLocked = true;
    } else {
        mouseLocked = false;
    }
}