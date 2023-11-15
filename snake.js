class Snake {
    constructor () {
        this.body = [];
        this.body[0] = createVector(floor(w/2), floor (h/2));
        this.xdir = 0;
        this.ydir = 0;
        this.len = 1;
        this.wall = false;
        this.color = 0;
        this.headX = this.body[0].x;
        this.headY = this.body[0].y;
        this.growingLeft = 0;
        this.currDir = {xDir: -2,
                       yDir: -2};
        this.nextDir = {xDir: -2,
                       yDir: -2};
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
            
            console.log("\nCD xd: " + this.currDir.xDir);
            console.log("CD yd: " + this.currDir.yDir);
            console.log("ND xd: " + this.nextDir.xDir);
            console.log("ND yd: " + this.nextDir.yDir);
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
       
    update (foodsArr) {
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
        } else {// update
            this.moveSnake();
        }
        
        //eat food
        if(this.eat(foodsArr)) {
            this.growingLeft += growScale;
        } 
    }
    
    moveSnake() {
        let oldHead = this.body[0];
        let head = this.body.pop();
        head.x = oldHead.x + this.xdir;
        head.y = oldHead.y + this.ydir;
        head = this.checkWall(head);
        this.body.unshift(head);
        this.headX = head.x;
        this.headY = head.y;
    }
    
    setSnakeColor (aColor) {
        this.color = aColor;
    }
    
    show () {
        for (let i = 0; i < this.body.length; ++i) {
            fill(this.color);
            noStroke();
            var x = floor(this.body[i].x);
            var y = floor(this.body[i].y);
            rect(rez * x, rez * y, rez - 1, rez - 1);
            //x, y *= rez
        }
    }
    
    //one player endgame
    endGame1() {
        //return false;
        if (this.wall) {
            let x = this.headX;
            let y = this.headY;
            if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
              return true;
            }
        }
        for (let i = 1; i < this.body.length; i++) {
          let part = this.body[i];
          if (this.compareSpots(part.x, this.headX) && this.compareSpots(part.y, this.headY)) {
            return true;
          }
        }
        return false;
    }
    
    //two_player endgame
    endGame2(other) {
        if (this.wall) {
            let x = this.headX;
            let y = this.headY;
            if (x > w - 1 || x < 1 || y > h - 1|| y < 1) {
              return true;
            }
        }
        for (let i = 1; i < this.body.length; i++) {
            let part = this.body[i];
            if (this.compareSpots(part.x, this.headX) &&             this.compareSpots(part.y, this.headY)) {
                return true;
            }
        }
        for (let j = 0; j < other.body.length - 1; j++) {
            let otherPart = other.body[j];
            if (this.compareSpots(otherPart.x, this.headX) &&             this.compareSpots(otherPart.y, this.headY)) {
                return true;
            }
        }
        return false;
    }
    
    grow() {
        this.len += 1; 
        let newHead = createVector(this.headX + this.xdir, this.headY + this.ydir);
        newHead = this.checkWall(newHead);
        //this.body.push(newHead);
        this.body.unshift(newHead);
        this.headX = newHead.x;
        this.headY = newHead.y;
    }
    
    walls(walled) {
        this.wall = walled;
    }
    
    compareSpots(x, y) {
        if (abs(x - y) < error_factor) {
            return true;
        }
        return false;
    }
    
    eat(posArr) {
        for (let i = 0; i < posArr.length; i++) {
            let pos = posArr[i];
            if (this.compareSpots(pos.x, this.headX) && this.compareSpots(pos.y, this.headY)) {
                posArr[i] = foodLocation(pos);
                return true;
            }
        }
        return false;
    }
    
    checkWall(head) {
        if (this.wall == false) {
            if (head.x > w - 1) {
                head.x = 0;
            }
            if (head.y > h - 1) {
                head.y = 0;
            }
            if (head.x < 0) {
                head.x = w - 1;
            }
            if (head.y < 0) {
                head.y = h - 1;
            }
        }
        return head;
    }
                                
}