function setup() {
    weaponIndex = 0;
    enemyCount = 10;
    keyFire = false;
    mouseLocked = false;
    mouseX = 0;
    mouseY = 0;
    playerX = window.innerWidth / RES / 2;
    playerY = window.innerHeight / RES / 2;
    playerMoveX = 0;
    playerMoveY = 0;
    playerMovementX = 0;
    playerMovementY = 0;
    projectiles = [];
    deleteProjectiles = [];
    enemies = [];
    deleteEnemies = [];
    x = 0;
    playerAngle = 0;
    tickX = 0;
    tickY = 0;
    keyW = false;
    keyA = false;
    keyS = false;
    keyD = false;
    playerMoveAmmount = 0;
    delay = 0;
}