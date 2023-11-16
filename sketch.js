/*
function setup() {
    var a = new Matrix (2, 3);
    a.randomize();
    console.table(a.matrix);
    var b = new Matrix (2, 3);
    b.randomize();
    console.table(b.matrix);
    var c = Matrix.mix(a,b, .9);
    console.table(c.matrix);
}
*/

const rezScale = 50;
const growScale = 5;
const allotted_time = 100
let speed = 15; 
const are_walls = true;
const error_factor = 0.1;
const numFood = 1;
const pop_size = 1000;
let stats = false;
let show_one = false;

let saved_snakes = [];
let snakes = [];
let foods = [];
let w;
let h;
let is_paused;
let high_score;
let rez;
let buttonpushed;
let generation;
var timeLeft;
let cycles;

function setup() {
    var cnv = createCanvas(windowWidth - 50, windowHeight - 50);
    var x = 50 / 2;
    var y = 50 / 2;
    cnv.position(x, y);
    
    high_score = 0;
    cycles = createSlider(1,100,.1);
    generation = 1;
    
    for (let i = 0 ; i < pop_size; i++) {
        snakes[i] = new Snake();
    }
    
    //reset();
    
    timeLeft = allotted_time;
    frameRate(speed);   
    
    rez = width / rezScale;
    w = floor (width / rez);
    h = floor (height/ rez);
    
    is_paused = false;

}

function reset() { 
    normalizeFitness();
    for (let i = 0; i < pop_size; i++) {
        snakes[i] = createOne();
    }
    saved_snakes = [];
    timeLeft = allotted_time;
    frameRate(speed);
}

function foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    let food = createVector(x, y);
    return food;
}

function keyPressed() {
    if (key === "P" || key === "p") {
        if (is_paused) {
            is_paused = false;
            loop();
        } else {
            is_paused = true;
            noLoop();
        }
    } else if (key === "r" || key === "R" || key === " ") {
        reset();
        redraw();
        loop();
        generation++;
    } else if (key === "l" || key === "L") {
        console.table(snakes[0].brain.wih.matrix);
        console.table(snakes[1].brain.wih.matrix);
        console.log (snakes[0].brain.wih.matrix.rows);
        for (let i = 0; i < snakes[0].brain.wih.rows; i++) {
            for (let j = 0; j < snakes[0].brain.wih.cols; j++) {
                if (snakes[0].brain.wih.matrix[i][j] != snakes[1].brain.wih.matrix[i][j]) {
                    console.log("Inequality at " + i + j);
                } 
            }
        }
    } else if (key === "o" || key === "O") {
        if (show_one) {
            show_one = false;
        } else {
            show_one = true;
        }
    } else if (key === "K" || key === "k") {
        saved_snakes.push(snakes.splice(0, 1)[0]);
    } else if (key === "S" || key === "s") {
        let aSnake = snakes[0];
        let json = JSON.stringify(aSnake.brain);
        saveJSON(json, "saved_snake.json");
    } else if (key === "W" || key === "w") {
        //snakeBrain = loadJSON("*file name**")
    }
}

function draw() {
    background(220);
    
    stats = (cycles.value() > 1) ? false : true;
    //FOR STATS
    let localHigh = 0;
    let local_longest_i = 0;
    for (let q = 0; q < cycles.value(); q++) {
        timeLeft -= 1;

        for (let i = 0; i < snakes.length; i++) {
            let asnake = snakes[i];

            //FOR STATS {}
                if (asnake.len > localHigh) {
                    localHigh = asnake.len;
                    if (localHigh > high_score) {
                        high_score = localHigh;
                    }
                }
                

            //Actuallly necessary
            //hit wall update and show
            if (asnake.checkWall() || asnake.hitsSelf()) {
                saved_snakes.push(snakes.splice(i, 1)[0]);
                i--;
            }
            let is_0 = false;
            if (i == 0) {
                is_0 = true;
            }
            if (asnake.update(foods, is_0)) {
                timeLeft = allotted_time;
            }
            asnake.score += 1;
        }

        //check/show end
        //check when there still some alive 
        if (snakes.length < 1 || timeLeft < 1) {
            if (timeLeft == 0) {
                for (let i = 0; i < snakes.length; i++) {
                    append(saved_snakes, snakes[i]);
                }
            }
            reset();
            generation++;
        }
    }
    if (show_one) {
        snakes[0].show();
    } else {
        for (let i = 0; i < snakes.length; i++) {
            let asnake = snakes[i];
            asnake.show();
        }
    }

    //STATS
    if (stats) {
        textSize(22);
        fill(255);
        textAlign(LEFT);
        text("Local High Score: " + localHigh, 10, 25);  
        text("Snakes Alive: " + snakes.length, 10, height - 10);
        text("Time left: " + timeLeft, width - 150, height - 10);
        if (show_one) {
            let arrow;
            switch(buttonpushed) {
                case 0: arrow = "<"; break;
                case 1: arrow = "V"; break;
                case 2: arrow = ">"; break;
                case 3: arrow = "^"; break;
            }
            text("Button pushed: " + arrow, width - 200, height - 40);
        }
        textAlign(RIGHT);
        text("High Score: " + high_score, width - 10, 25);
        textAlign(CENTER);
    }
        text ("Generation: " + generation, height / 2, 25);
}