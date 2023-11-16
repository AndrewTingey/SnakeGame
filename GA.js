function normalizeFitness () {
    let sum = 0;
    for (let snake of saved_snakes) {
        //snake.score = snake.score + pow(snake.len, 4);
        snake.score = pow(snake.len, 4);
        sum += snake.score;
    }
    for (let i = 0; i < saved_snakes.length; i++) {
        let aSnake = saved_snakes[i];
        aSnake.fitness = aSnake.score / sum;
        //console.log(aSnake);
        //console.log("A snake w L: " + aSnake.len + " S: " + aSnake.score + " F: " + aSnake.fitness);
    }
}

function pickOne() {
    let index = 0;
    let r = random(0,1);
    while (r > 0) {
        r -= saved_snakes[index].fitness;
        index += 1;
    }
    index -= 1;
    let snake = saved_snakes[index];
    let child = new Snake(snake.brain);
    child.mutate();
    return child;
}

function createOne() {
    let index = 0;
    let r = random(0,1);
    while (r > 0) {
        r -= saved_snakes[index].fitness;
        index += 1;
    }
    index -= 1;
    let snake1 = saved_snakes[index];
    
    index = 0;
    r = random(0,1);
    while (r > 0) {
        r -= saved_snakes[index].fitness;
        index += 1;
    }
    index -= 1;
    let snake2 = saved_snakes[index];
    let aBrain = NeuralNetwork.crossOver(snake1.brain, snake2.brain);
    let child = new Snake (aBrain);
    child.mutate();
    return child;
}

