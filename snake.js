class Snake {
    
    constructor (aBrain) {
        this.unique_colors = false;

        if (aBrain instanceof NeuralNetwork) {
            this.brain = aBrain;
        } else {
            this.brain = new NeuralNetwork(6, 6, 4); 
        }
        if (this.unique_colors) {
            this.R = random (0, 240);
            this.G = random (0, 240);
            this.B = random (0, 240);
        } else {
            this.R = 0;
            this.G = 0;
            this.B = 0;
        }
        this.body = [];
        this.body[0] = createVector(floor(w/2), floor (h/2));
        this.xdir = 0;
        this.ydir = 0;
        this.len = 1;
        this.wall = true;
        this.headX = this.body[0].x;
        this.headY = this.body[0].y;
        this.growingLeft = 0;
        this.currDir = {xDir: -2,
                       yDir: -2};
        this.nextDir = {xDir: -2,
                       yDir: -2};
        
        //xtoFood, ytoFood, dtoL, dtoD, dtoR, dtoU
        this.inputData = [];
        this.food = foodLocation();
        
        this.score = 0;
        this.fitness = 0.0;
    }
    
    setDir(x, y) {
        if (abs(x - this.xdir) >= 2 ||
            abs(y - this.ydir) >= 2) {
            return;
        } else {
            if (this.currDir.xDir == -2) {
                this.currDir.xDir = x;
                this.currDir.yDir = y;
            } 
        }
    }
    
    setNextDir(x, y) {
        if (abs(x - this.xdir) >= 2 ||
            abs(y - this.ydir) >= 2) {
            return;
        } else {
            this.nextDir.xDir = x;
            this.nextDir.yDir = y;
            
            console.log("\nCD xd: " + this.currDir.xDir);
            console.log("CD yd: " + this.currDir.yDir);
            console.log("ND xd: " + this.nextDir.xDir);
            console.log("ND yd: " + this.nextDir.yDir);
        }
    }
       
    update (foodsArr, is_0) {        
        let xtoFood = this.food.x - this.headX;
        let ytoFood = this.food.y - this.headY;
        let dToLWall = this.headX;
        let dToDWall = h - this.headY;
        let dToRWall = w - this.headX;
        let dToUWall = this.headY;
        
        this.inputData = [xtoFood, ytoFood, dToLWall, dToDWall, dToRWall, dToUWall];
        
        this.getDirection(is_0);
        
        //set direction
        if (this.currDir.xDir != -2) {
            this.xdir = this.currDir.xDir;
            this.ydir = this.currDir.yDir;
            this.currDir.xDir = this.nextDir.xDir;
            this.currDir.yDir = this.nextDir.yDir;
            if (this.nextDir.xDir != -2) {
                this.nextDir.xDir = -2;
                this.nextDir.yDir = -2;
            }
        }
        
        //continue growing
        if(this.growingLeft > 0) {
            this.grow();
            this.growingLeft -= 1;
        } else { // update
            this.moveSnake();
        }
        
        //eat food
        if(this.eat()) {
            this.growingLeft += growScale;
            return true;
        } 
        return false;
    }
    
    moveSnake() {
        let oldHead = this.body[0];
        let head = this.body.pop();
        head.x = oldHead.x + this.xdir;
        head.y = oldHead.y + this.ydir;
        //head = this.checkWall(head);
        this.body.unshift(head);
        this.headX = head.x;
        this.headY = head.y;
    }
    
    show () {
        for (let i = 0; i < this.body.length; ++i) {
            fill(this.R, this.G, this.B);
            noStroke();
            var x = floor(this.body[i].x);
            var y = floor(this.body[i].y);
            rect(rez * x, rez * y, rez - 1, rez - 1);
            //x, y *= rez
        }
        this.showFood();
    }
    
    grow() {
        this.len += 1; 
        let newHead = createVector(this.headX + this.xdir, this.headY + this.ydir);
        //newHead = this.checkWall(newHead);
        //this.body.push(newHead);
        this.body.unshift(newHead);
        this.headX = newHead.x;
        this.headY = newHead.y;
    }
    
    compareSpots(x, y) {
        if (abs(x - y) < error_factor) {
            return true;
        }
        return false;
    }
    
    hitsSelf () {
        for (let i = 1; i < this.body.length; i++) {
          let part = this.body[i];
          if (this.compareSpots(part.x, this.headX) && this.compareSpots(part.y, this.headY)) {
            return true;
          }
        }
        return false;
    }
    
    eat() {
        if (this.compareSpots(this.food.x, this.headX) && this.compareSpots(this.food.y, this.headY)) {
            this.food = foodLocation();
            return true;
        }
        return false;
    }
    
    checkWall() {
        if (this.headX > w - 1) {
            return true;
        }
        if (this.headY > h - 1) {
            return true;
        }
        if (this.headX < 0) {
            return true;
        }
        if (this.headY < 0) {
            return true;
        }
    }
    
    getDirection (is_0) {
        let dir = this.brain.query(this.inputData);
        let max_val = 0;
        let ind;
        for (let i = 0; i < dir.length; i++) {
            if (dir[i] > max_val) {
                max_val = dir[i];
                ind = i;
            }
        }

         if (ind === 0) {
             this.setDir(-1, 0);
          } else if (ind === 1) {
            this.setDir(0, 1);
          } else if (ind === 2) {
            this.setDir(1, 0);
          } else if (ind === 3) {
            this.setDir(0, -1);
          }
        if (is_0) {
            buttonpushed = ind;
        }
        return ind;
    }
    
    showFood () {
        //show food
        noStroke();
        let aColor;
        if (this.unique_colors) {
            aColor = color(this.R, this.G, this.B, 95);
        } else {
            aColor = color("#ff0000");
        }
        fill(aColor);
        rect(rez*this.food.x, rez*this.food.y, rez, rez);
    }
    
    mutate() {
        this.brain.mutate(0.1);
    }
}