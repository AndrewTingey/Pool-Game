let balls = [];
let table;
let speed; 
let ball_in_hand;
let playerTurn;
let who_is_stripes;
const DEFAULT_SPEED = 6;

function setup() {
    //google image
    //table = loadImage("table.jpg");
    //own image
    table = loadImage("redTable.jpg");
    var cnv = createCanvas(600, 600);
    cnv.position(windowWidth / 2 - 300, windowHeight / 2 - 300);
    
    //cue
    balls[0] = new Ball (300, 400);
    //head
    balls[1] = new Ball (300, 200);
    //row 2
    balls[2] = new Ball (300 + (DIAMETER / 2), 200 - DIAMETER);
    balls[3] = new Ball (300 - (DIAMETER / 2), 200 - DIAMETER);
    //row 3
    balls[4] = new Ball (300 + (-1 * DIAMETER), 200 - (2 * DIAMETER));
    balls[5] = new Ball (300 + (0 * DIAMETER), 200 - (2 * DIAMETER));
    balls[6] = new Ball (300 + (1 * DIAMETER), 200 - (2 * DIAMETER));
    //row 4
    balls[7] = new Ball (300 + (-3 * DIAMETER / 2), 200 - (3 * DIAMETER));
    balls[8] = new Ball (300 + (-1 * DIAMETER / 2), 200 - (3 * DIAMETER));
    balls[9] = new Ball (300 + (1 * DIAMETER / 2), 200 - (3 * DIAMETER));
    balls[10] = new Ball (300 + (3 * DIAMETER / 2), 200 - (3 * DIAMETER));
    //row 5
    balls[11] = new Ball (300 + (-2 * DIAMETER), 200 - (4 * DIAMETER));
    balls[12] = new Ball (300 + (-1 * DIAMETER), 200 - (4 * DIAMETER));
    balls[13] = new Ball (300 + (0 * DIAMETER), 200 - (4 * DIAMETER));
    balls[14] = new Ball (300 + (1 * DIAMETER), 200 - (4 * DIAMETER));
    balls[15] = new Ball (300 + (2 * DIAMETER), 200 - (4 * DIAMETER));
    
    speed = DEFAULT_SPEED; // for testing
    who_is_stripes = 1;
    ball_in_hand = false;
}


function draw() {
    background(151);
    //drawTable();
    image(table, 150, 50, 300, 500 );
    for (let i = 0; i < balls.length ; i++) {
        var aBall = balls[i];
        
        //check collision
        for (let j = i + 1; j < balls.length; j++) {
            if (aBall.collide(balls[j])) {
                aBall.bounceBall(balls[j]);
            }
        }
        aBall.update();
        aBall.show(i);
    }
    
    displayTurn();
    
    if (isStopped()) {
        ball_in_hand = balls[0].is_pocketed;
        
        stroke(255);
        strokeWeight(5);

        if (ball_in_hand) {
            balls[0].position.x = mouseX;
            balls[0].position.y = mouseY;
        } else {
            let mouse = createVector(mouseX, mouseY);
            mouse.sub(balls[0].position);
            mouse.setMag(speed * 10);

            line (balls[0].position.x, balls[0].position.y, balls[0].position.x + mouse.x, balls[0].position.y + mouse.y);
        }
        
    }
}

function drawTable() {
    //draw background table and holes
    
    strokeWeight(1);
    
    //brown back
    fill("rgb(105, 63, 51)");
    rect(190, 90, 220, 420, 10);
    
    //light green back
    fill('rgb(88, 193, 131)');
    rect(200, 100, 200, 400);   
    
    strokeWeight(0);
    
    //black holes
    fill(0);
    ellipse(205, 105, 11);
    ellipse(205, 300, 11);
    ellipse(205, 495, 11);
    ellipse(395, 105, 11);
    ellipse(395, 300, 11);
    ellipse(395, 495, 11);
    
    //green bumpers
    //bumper LRUD : 207, 600 - 207, 107, 600 - 107
    fill("rgb(68, 152, 88)");
    quad(207, 100, 212, 107, 600 - 212, 107, 600 - 207 , 100)
    quad(207, 500, 212, 493, 600 - 212, 493, 600 - 207 , 500)
    
    quad(200, 107, 207, 112, 207, 293, 200, 297);
    quad(400, 107, 393, 112, 393, 293, 400, 297);
    quad(400, 600 - 107, 393, 600 - 112, 393,600 - 293, 400, 600 - 297);
    quad(200, 493 , 207, 600 - 112, 207, 600 - 293, 200, 600 - 297);
    
    //diamonds
    fill(224);
    //top
    quad(300, 93, 302, 95, 300, 97, 298, 95);
    quad(250, 93, 252, 95, 250, 97, 248, 95);
    quad(350, 93, 352, 95, 350, 97, 348, 95);
    
    //bottom
    quad(350, 600 - 93, 352, 600 - 95, 350, 600 - 97, 348, 600 - 95);
    quad(250, 600 - 93, 252, 600 - 95, 250, 600 - 97, 248, 600 - 95);
    quad(300, 600 - 93, 302, 600 - 95, 300, 600 - 97, 298, 600 - 95);
    
    //UL
    quad(193, 200, 195, 202, 198, 200, 195, 198);
    quad(193, 150, 195, 152, 198, 150, 195, 148);
    quad(193, 250, 195, 252, 198, 250, 195, 198+ 50);
    
    //DL
    quad(193, 600 - 200, 195, 600 - 202, 198, 600 - 200, 195, 600 - 198);
    quad(193, 600 - 150, 195, 600 - 152, 198, 600 - 150, 195, 600 - 148);
    quad(193, 600 - 250, 195, 600 - 252, 198, 600 - 250, 195, 600 - (198 + 50));
    
    //DR
    quad(600 - 193, 600 - 200, 600 - 195, 600 - 202, 600 - 198, 600 - 200, 600 - 195, 600 - 198);
    quad(600 - 193, 600 - 150, 600 - 195, 600 - 152, 600 - 198, 600 - 150, 600 - 195, 600 - 148);
    quad(600 - 193, 600 - 250, 600 - 195, 600 - 252, 600 - 198, 600 - 250, 600 - 195, 600 - (198 + 50));
    
    //UR
    quad(600 - 193, 200, 600 - 195, 202, 600 - 198, 200, 600 - 195, 198);
    quad(600 - 193, 150, 600 - 195, 152, 600 - 198, 150, 600 - 195, 148);
    quad(600 - 193, 250, 600 - 195, 252, 600 - 198, 250, 600 - 195, 198+ 50);
    
    rect(207, 400, 186, 1);
    
    fill(224);
    ellipse(300, 200, 4);
    
}

this.onclick = function() {
    if (isStopped()) {
        if (balls[0].is_pocketed) {
            balls[0].is_pocketed = false;
            balls[0].velocity.setMag(0);
        } else {
            hitCueBall(mouseX, mouseY, speed);
            speed = DEFAULT_SPEED; 
        }
    }
    
    console.log("(" + mouseX + ", " + mouseY + ")" );
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        speed += 1;
    }
    if (keyCode == DOWN_ARROW) {
        speed -= 1;
    }
    
    if (key == "W" || key == "w") {
        speed += 1;
    }
    if (key == "S" || key == "s") {
        speed -= 1;
    }
}

function hitCueBall (x, y, speed = 10) {
    //x, y where mouse is
    let height = y - balls[0].position.y;
    let run = x - balls[0].position.x;
    let d = dist(x, y, balls[0].position.x, balls[0].position.y);
    balls[0].velocity.y = (height / d) * speed;
    balls[0].velocity.x = (run / d) * speed;
}

function isStopped() {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].is_pocketed) {
            continue;
        }
        if (p5.Vector.mag(balls[i].velocity) > 0.001) {
            return false;
        }
    }
    return true;
}

function displayTurn(turn = 1) {
    fill(255);
    textSize(32);
    textAlign(LEFT);
    
    if (turn == 1) {
        stroke("#5050ff");
        strokeWeight(5);
        text("Player 1", 10, 30);
        strokeWeight(0);
    } else {
        strokeWeight(0);
        text("Player 1", 10, 30);
//        stroke(color("green"));
        strokeWeight(5);
    }
    
    text("Player 2", 470, 30);
    
    
    strokeWeight(1); 
    stroke(0);
    fill(color("Blue"));
    ellipse(25, 50, 25);
    fill(color("Green"));
    ellipse(575, 50, 25);
    
    if (who_is_stripes == 1) {
        fill("#ffffff");
        arc(25, 50, 25, 25, PI / 6, 5 * PI / 6, CHORD);
        arc(25, 50, 25, 25, 7 * PI / 6, 11 * PI / 6, CHORD);
    } else if (who_is_stripes == 2) {
        fill("#ffffff");
        arc(575, 50, 25, 25, PI / 6, 5 * PI / 6, CHORD);
        arc(575, 50, 25, 25, 7 * PI / 6, 11 * PI / 6, CHORD);
    }
}
