const rezScale = 30;
const growScale = 10;
const speed = 105; 
const are_walls = false;
const error_factor = 0.1;
const two_players = false;
const player2Color = "#324aa8";
const player1Color = "#32a852";
const numFood = 1;

let snake;
let foods = [];
let w;
let h;
let is_paused;
let high_score;
let rez;

let dToFood;
let ButtonPressed;
let dToLWall;
let dToRWall;
let dToUWall;
let dToDWall;

function setup() {
    var cnv = createCanvas(windowWidth - 50, windowHeight - 50);
    var x = 50 / 2;
    var y = 50 / 2;
    cnv.position(x, y);
    
    high_score = 0;
    reset();
}

function reset() {
    rez = width / rezScale;
    w = floor (width / rez);
    h = floor (height/ rez);
    frameRate(speed);
    snake = new Snake();
    if (two_players) {
        snake2 = new Snake();
        snake2.setSnakeColor(player2Color);
        snake.setSnakeColor(player1Color);
    }
    snake.walls(are_walls);
    for (let i = 0; i < numFood; i++) {
        foods[i] = foodLocation();
    }
    is_paused = false;
}

function foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    while (validPos(x,y) == false) {
      let x = floor(random(w));
      let y = floor(random(h));
    }
  let food = createVector(x, y);
  return food;
    //rid food
}

function validPos (x,y) {
    for (let i = 0; i < snake.length; i++) {
        let part = snake.body[i];
        if (part.x == x && part.y == y) {
            return false;
        }
    }
    if (two_players) {
        for (let i = 0; i < snake2.length; i++) {
            let part = snake2.body[i];
            if (part.x == x && part.y == y) {
                return false;
            }
        }
    }
    return true;
}

function keyPressed() {
    if (key === "P" || key === "p" || key === " ") {
        if (is_paused) {
            is_paused = false;
            loop();
        } else {
            console.log("Len: " + snake.len);
            is_paused = true;
            noLoop();
        }
    } else if (key === "r" || key === "R") {
        if (two_players == false) {
            if (snake.len > high_score) {
                high_score = snake.len;
            }
        }
        reset();
        redraw();
        loop();
    }
    
    
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
      ButtonPressed = "<";
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
      ButtonPressed = ">";
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
      ButtonPressed = "V";
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
      ButtonPressed = "^";
  }
    
    if(two_players) {
        if (key == 'a' || key == 'A') {
            snake2.setDir(-1, 0);
        } else if (key == 'd' || key == 'D') {
            snake2.setDir(1, 0);
        } else if (key == 's' || key == 'S') {
            snake2.setDir(0, 1);
        } else if (key == 'w' || key == 'W') {
            snake2.setDir(0, -1);
        } 
    } else {
        if (key == 'a' || key == 'A') {
            snake.setDir(-1, 0);
        } else if (key == 'd' || key == 'D') {
            snake.setDir(1, 0);
        } else if (key == 's' || key == 'S') {
            snake.setDir(0, 1);
        } else if (key == 'w' || key == 'W') {
            snake.setDir(0, -1);
        } 
    }
}

function draw() {
    background(220);
    
    dToFood = dist(foods[0].x, foods[0].y, snake.headX, snake.headY); 
    dToLWall = dist(snake.headX, snake.headY, 0, snake.headY);
    dToRWall = dist(snake.headX, snake.headY, w, snake.headY);
    dToUWall = dist(snake.headX, snake.headY, snake.headX, 0);
    dToDWall = dist(snake.headX, snake.headY, snake.headX, h);
    
    
    if (two_players) {
        snake2.update(foods);
        snake2.show();
    } 
    
    snake.update(foods);
    snake.show();
    
    //show food
    noStroke();
    fill(255, 0, 0);
    for (let i = 0; i < foods.length; i++) {
        let food = foods[i];
        rect(rez*food.x, rez*food.y, rez, rez);
    }
    
    //two player end game
    if(two_players) {
        if (snake.endGame2(snake2)) {
            fill(player2Color);
            textSize(64);
            textAlign(CENTER);
            text("Player 2 Wins", width/2, height/2);
            noLoop();
        } else if (snake2.endGame2(snake)) {
            fill(player1Color);
            textSize(64);
            textAlign(CENTER);
            text("Player 1 Wins", width/2, height/2);
            noLoop();
        }
        textSize(22);
        fill(player1Color);
        textAlign(LEFT);
        if (snake.growingLeft > 0) {
            text("Player 1 score: " + snake.len + "  +" + snake.growingLeft, 10, 20);
        } else {
            text("Player 1 score: " + snake.len, 10, 20);  
        }
        fill(player2Color);
        if (snake2.growingLeft > 0) {
            text("Plater 1 score: " + snake2.len + "  +" + snake2.growingLeft, 10, 40);
        } else {
            text("Player 1 score: " + snake2.len, 10, 40);  
        }
        
    } else {
        //check/show end
        if (snake.endGame1()) {
            fill(255);
            textSize(64);
            textAlign(CENTER);
            text("GAME OVER", width/2, height/2);
            textSize(32);
            text("Score: " + snake.len, width / 2, height / 2 + 25);
            noLoop();
        }
        
        textSize(22);
        textAlign(LEFT);
        fill(0);
        if (snake.growingLeft > 0) {
            text("Score: " + snake.len + "  +" + snake.growingLeft, 10, 20);
        } else {
            text("Score: " + snake.len, 10, 20);  
        }
        if (high_score > 1) {
            textAlign(RIGHT);
            text("High Score: " + high_score, width - 10, 20);
        }
        
        textAlign(LEFT);
        fill(0);
        text (" To L: " + dToLWall 
              + " To R: " + dToRWall 
              + " To U: " + dToUWall 
              + " To D: " + dToDWall
              + " To food: " + dToFood, 10, height - 20);
        
        textAlign(RIGHT);
        text("Button: " + ButtonPressed, width - 30, height - 20);
    }
}



