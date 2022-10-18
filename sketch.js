/*Project 5 - NPC Hopper
Name: Jeffrey Kedda
Description: this is a simple jump game with a 400x400 canvas
The 3 Npc's avoid the balls that will spawn in the bottom stair case
Every time the space bar is pressed a ball will drop from the top left corner of the canvas
If a Npc is hit, it dies and disappears.
If all Npcs die, the player wins.
If an Npc reaches the 2nd most top stair without getting hit, the player loses
The player can press enter to play again.
Controls: 
Space bar: drop ball from top left corner
Enter: replay the game
*/
//staircase Global Varaibles
var stairBlockTemp, stairCaseTileMapObject;
// 20x20 red block
class stairBlock {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    draw(x, y) {
        this.x = x;
        this.y = y;
        fill(255, 165, 0);

        rect(this.x - 10, this.y - 10, 20, 15);
    }
}
// 20x21 Tilemap
class staircaseTileMap {
    constructor() {
        this.tilemap = [
            "                     ",
            "                     ",
            "                     ",
            "                     ",
            "                     ",
            "                     ",
            "                     ",
            "lcr                  ",
            "   lcr               ",
            "      lcr            ",
            "         lcr         ",
            "            lcr      ",
            "               lcs   ",
            "                  lcr",
            "               lcr   ",
            "            lcr      ",
            "         lcr         ",
            "      lcr            ",
            "   lcr               ",
            "lcr                  ",
        ];
        this.stairBlocks = [];
    }
    initializeStairBlocks() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                if (this.tilemap[i][j] == 'l') {
                    this.stairBlocks.push(new stairBlock(j * 20, i * 20, 0));
                } else if (this.tilemap[i][j] == 'c') {
                    this.stairBlocks.push(new stairBlock(j * 20, i * 20, 1));
                } else if (this.tilemap[i][j] == 'r') {
                    this.stairBlocks.push(new stairBlock(j * 20, i * 20, 2));
                } else if (this.tilemap[i][j] == 's') {
                    this.stairBlocks.push(new stairBlock(j * 20, i * 20, 3));
                }
            }
        }
    }
    drawStairBlocks() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                if (this.tilemap[i][j] != ' ') {
                    stairBlockTemp.draw(j * 20, i * 20);
                }
            }
        }
    }
}

function initializeTileMapVariables() {
    stairCaseTileMapObject = new staircaseTileMap();
    stairCaseTileMapObject.initializeStairBlocks();
    stairBlockTemp = new stairBlock(0, 0);
}
//ball Global Variables
var ball = [];
var gravity, wind;
var windSpeed = .013;
class ballObject {
    constructor(x, y) {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
        this.size = 20;
        this.mass = this.size / 5;

        this.aAcc = 0;
        this.aVelocity = 0;
        this.angle = 0;

        //random color generator
        this.c1 = random(0, 255);
        this.c2 = random(0, 255);
        this.c3 = random(0, 255);
    }
    applyForce(force) {
        var f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }
    updatePosition() {
        //intialize force vectors
        var gravityForce = p5.Vector.mult(gravity, this.mass);
        this.applyForce(gravityForce);
        var windForce = p5.Vector.mult(wind, this.mass);
        windForce.mult(windSpeed);
        this.applyForce(windForce);
        var airFriction = p5.Vector.mult(this.velocity, -0.02);
        this.applyForce(airFriction);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        //bounce off ground
        if (this.position.y > (height - this.size / 2)) {
            this.position.y = height - this.size / 2;
            this.velocity.y *= -1;
        }
        if (this.position.x < (-this.size / 2)) {
            this.position.x = width + this.size / 2;
        }
        this.acceleration.set(0, 0);


        this.aAcc = this.velocity.mag() / 10; // modify constant 10
        if (this.velocity.x < 0) {
            this.aAcc = -this.aAcc;
        }
        this.aVelocity += this.aAcc;
        this.aVelocity *= 0.98; // drag
        this.angle += this.aVelocity;

    }
    draw() {
        fill(this.c1, this.c2, this.c3);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);

        ellipse(0, 0, this.size, this.size);
        var startAng = .1 * PI
        var endAng = .9 * PI
        var smileDiam = .6 * this.size;
        arc(0, 0, smileDiam, smileDiam, startAng, endAng);
        var offset = .15 * this.size;
        var eyeDiam = .1 * this.size;

        fill(0);
        //eyes
        line(-offset - 5, -offset - 8, -1, -4);
        line(offset + 5, -offset - 8, 1, -4);
        ellipse(-offset, -offset, eyeDiam, eyeDiam);
        ellipse(offset, -offset, eyeDiam, eyeDiam);
        pop();



    }
    checkCollision() {
        for (var i = 0; i < stairCaseTileMapObject.stairBlocks.length; i++) {
            var stairBlock = stairCaseTileMapObject.stairBlocks[i];
            if (dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) < (10 + this.size / 2)) {
                this.position.y = stairBlock.y - this.size / 2 - 10;
                this.velocity.y *= -1;
            }
            if (dist(this.position.x, this.position.y, enemies[0].position.x, enemies[0].position.y + 17) < this.size / 2 + 5) {
                enemies[0].dead = 1;
            }
            if (dist(this.position.x, this.position.y, enemies[1].position.x, enemies[1].position.y + 17) < this.size / 2 + 5) {
                enemies[1].dead = 1;
            }
            if (dist(this.position.x, this.position.y, enemies[2].position.x, enemies[2].position.y + 17) < this.size / 2 + 5) {
                enemies[2].dead = 1;
            }
        }
    }
}

function drawBalls() {

    for (var i = 0; i < ball.length; i++) {
        ball[i].checkCollision();
        ball[i].updatePosition();
        ball[i].draw();
        if (ball[i].position.x > 400) {
            ball.shift();
        }
    }
}

function initializeBallVariables() {
    gravity = new p5.Vector(0, 0.1);
    wind = new p5.Vector(1, 0);
}
//player Global Variables
var gravity, walkForce, backForce, jumpForce;

function initializeMovementVariables() {
    gravity = new p5.Vector(0, 0.15);
    walkForce = new p5.Vector(0.20, 0);
    backForce = new p5.Vector(-0.20, 0);
    jumpForce = new p5.Vector(0, -3.5);

}
//npc Global Variables
var enemies = [];
class enemy {
    constructor(x, y) {
        this.dead = 0;
        this.position = new p5.Vector(x, y);
        this.currentState = 0;
        this.state = 0;
        this.jump = 0;
        this.state = [new stairMovementState(), new avoidMovementState()];
        
        //vector
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
        this.force = new p5.Vector(0, 0);
        this.currFrame = frameCount;
        //walking
        this.walkForward = 0;
        this.walkBackward = 0;
        this.onBottomStairs = 0;
    }
    changeState(x) {
        this.currentState = x;
    }
    applyForce(force) {
        this.acceleration.add(force);
    }
    draw() {
        if (this.dead == 0) {
            fill(255, 0, 0);

            switch (this.jump) {
                case 0:
                    line(this.position.x + 5, this.position.y + 12, this.position.x + 10,
                        this.position.y + 20); //arms
                    line(this.position.x - 5, this.position.y + 12, this.position.x - 10,
                        this.position.y + 20);
                    line(this.position.x, this.position.y + 20, this.position.x + 10,
                        this.position.y + 35); // legs
                    line(this.position.x, this.position.y + 20, this.position.x - 10,
                        this.position.y + 35);
                    break;
                case 1:
                    line(this.position.x + 5, this.position.y + 12, this.position.x + 10,
                        this.position.y + 20); //arms
                    line(this.position.x - 5, this.position.y + 12, this.position.x - 10,
                        this.position.y + 20);
                    line(this.position.x, this.position.y + 20, this.position.x + 10,
                        this.position.y + 23); // legs
                    line(this.position.x, this.position.y + 20, this.position.x - 10,
                        this.position.y + 23);
                    break;
            }
            fill(255, 69, 0);
            ellipse(this.position.x, this.position.y + 17, 20, 20)
            fill(0); //eyes
            point(this.position.x, this.position.y + 17);
            ellipse(this.position.x - 3, this.position.y + 15, 2, 4);
            ellipse(this.position.x + 3, this.position.y + 15, 2, 4);
            ellipse(this.position.x + 1, this.position.y + 22, 2, 4);
        }
    }
    update() {
        this.acceleration.set(0, 0);
        if (this.walkForward === 1 && this.velocity.x < 3) {
            this.applyForce(walkForce);
        } else if (this.walkBackward === 1 && this.velocity.x > -3) {
            this.applyForce(backForce);
        } else if (this.velocity.x > 0) {
            var walkFriction = new p5.Vector(-.05, 0);
            this.applyForce(walkFriction);
        } else if (this.velocity.x < 0) {
            var walkFriction = new p5.Vector(.05, 0);
            this.applyForce(walkFriction);
        }
        if (this.jump === 2) {
            this.applyForce(jumpForce);
            this.jump = 1;
        }
        if (this.jump > 0) {
            this.applyForce(gravity);
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);

        //reset position
        if (this.position.x > 400) {
            this.position.x = 400;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        }
        if (this.position.y >= 334.99) {
            this.position.y = 335;
            this.velocity.y = 0;
            this.jump = 0;
        }
    }
    checkStairCollision() {
        for (var i = 0; i < stairCaseTileMapObject.stairBlocks.length; i++) {
           
            var stairBlock = stairCaseTileMapObject.stairBlocks[i];

            if (dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) <= 45 && i > 20) {
                this.onBottomStairs = true;
            } else if (dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) <= 45 && i <= 20 && this.position.y + 44 < stairBlock.y) {
                this.onBottomStairs = false;
            }
            if (dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) <= 45 && dist(this.position.x, 0, stairBlock.x, 0) < (12) && i < 6 && this.dead == 0) {
                gameOver = 1;
            }
            //creating top boundery of platform
            if (dist(this.position.x, 0, stairBlock.x, 0) < (12) && dist(this.position.x, this.position.y, stairBlock.x, stairBlock.y) > (40) && dist(0, this.position.y, 0, stairBlock.y) < (45) && stairBlock.y > this.position.y) {
                this.position.y = stairBlock.y - 45;
                this.velocity.y = 0;
                this.jump = 0;
            }
            //goes of left side of ledge
            else if (stairBlock.type == 0 && stairBlock.x - this.position.x > 10 && this.position.y == stairBlock.y - 45) {
                this.jump = 1;
            }
            //goes of right side of ledge
            else if ((stairBlock.type == 2 || stairBlock.type == 3) && this.position.x - stairBlock.x > 10 && this.position.y == stairBlock.y - 45) {
                this.jump = 1;
            }
            //if character goes within platform
            else if (i != 15 && i != 16 && i != 17 && stairBlock.type != 3 && dist(this.position.x, this.position.y + 25, stairBlock.x, stairBlock.y) < (7)) {
                this.position.y = stairBlock.y - 45;
                this.velocity.y = 0;
                this.jump = 0;
            }
            //collsion of left of platform
            else if (stairBlock.type == 0 && this.velocity.x > 0 && dist(this.position.x, 0, stairBlock.x, 0) < (16) && this.position.y + 25 == stairBlock.y) {
                this.position.x = stairBlock.x - 16;
                this.velocity.x = 0;
            }
            //collision of right of platform
            else if (stairBlock.type == 2 && this.velocity.x < 0 && dist(this.position.x, 0, stairBlock.x, 0) < (16) && this.position.y + 25 == stairBlock.y) {
                this.position.x = stairBlock.x + 16;
                this.velocity.x = 0;
            }
        }
    }

}
class stairMovementState {
    constructor() {}
    execute(me) {
        //check to avoid balls
        for (var i = 0; i < ball.length; i++) {
            var currentBall = ball[i];
            if (dist(me.position.x, me.position.y + 17, currentBall.position.x, currentBall.position.y) < 80) {
                me.walkBackward = 0;
                me.walkForward = 0;
                console.log("Change state");
                me.changeState(1);
            }
        }
        //checks what set of stairs its on
        if (me.onBottomStairs == true) {
            me.walkForward = 1;
            me.walkBackward = 0;
        } else {
            me.walkBackward = 1;
            me.walkForward = 0;
        }
        //jump up stairs
        for (var i = 0; i < stairCaseTileMapObject.stairBlocks.length; i++) {
            var stairBlock = stairCaseTileMapObject.stairBlocks[i];
            //collsion of left of platform
            if (me.velocity.x > 0 && dist(me.position.x, 0, stairBlock.x, 0) < (16) && me.position.y + 25 == stairBlock.y) {
                me.jump = 2;
            }
            //collision of right of platform
            else if (me.velocity.x < 0 && dist(me.position.x, 0, stairBlock.x, 0) < (16) && me.position.y + 25 == stairBlock.y) {
                me.jump = 2;
            }
        }
    }
}
class avoidMovementState {
    constructor() {}
    execute(me) {
        for (var i = 0; i < ball.length; i++) {
            var currentBall = ball[i];
            if (me.position.y + 17 - currentBall.position.y > 50 && me.position.x - currentBall.position.x < 30 && currentBall.position.x - me.position.x < 30) {
                me.walkBackward = 0;
                me.walkForward = 0;
            }
            if ( currentBall.position.x < me.position.x) {
                me.walkBackward = 0;
                me.walkForward = 1;
            } 
            if (currentBall.position.x > me.position.x) {
                me.walkBackward = 1;
                me.walkForward = 0;
            }
        }
        if (dist(me.position.x, me.position.y + 17, currentBall.position.x, currentBall.position.y) > 80) {
            me.walkBackward = 0;
            me.walkForward = 0;
            me.changeState(0);

        }
    }
}

function initializeEnemyVariables() {
    enemies.push(new enemy(10, 335));
    enemies.push(new enemy(100, 300));
    enemies.push(new enemy(200, 280));
}
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].checkStairCollision();
        enemies[i].draw();
        
        enemies[i].update();
        enemies[i].state[enemies[i].currentState].execute(enemies[i]);
       
    }
    //check if all dead
    if (enemies[0].dead == 1 && enemies[1].dead == 1 && enemies[2].dead == 1) {
        gameOver = 2;
    }
}
var keyArray = [];
function keyPressed() {
    if (keyCode == 32) {
        ball.push(new ballObject(5, -40));
    }
}
function keyReleased() {

}
var gameOver = 0;
function setup() {
    createCanvas(400, 400);
    angleMode(DEGREES);
    frameRate(30);
    initializeTileMapVariables();
    initializeBallVariables();
    initializeMovementVariables();
    initializeEnemyVariables();
}
function draw() {

    background(240);
    if (gameOver == 0) {
        drawBalls();
        drawEnemies();
        stairCaseTileMapObject.drawStairBlocks();
        

    } else if (gameOver == 1) {
        fill(255, 0, 0);
        textSize(32);
        text("Game Over", 130, 200);
        text("You Lose", 140, 240);
        text("Press Enter to play gain", 10, 50);
        if (keyCode == ENTER) {
            enemies = [];
            initializeTileMapVariables();
            initializeBallVariables();
            initializeMovementVariables();
            initializeEnemyVariables();
            ball = [];
            gameOver = 0;
        }
    } else if (gameOver == 2) {
        fill(255, 0, 0);
        textSize(32);
        text("Game Over", 130, 200);
        text("You Win", 140, 240);
        text("Press Enter to play again", 10, 50);
        if (keyCode == ENTER) {
            enemies = [];
            initializeTileMapVariables();
            initializeBallVariables();
            initializeMovementVariables();
            initializeEnemyVariables();
            ball = [];
            gameOver = 0;
        }
    }
}