let Friction = 0.025;
let DIAMETER = 15;
class Ball {
    
    constructor(x, y, v = 0) {
        this.position = createVector (x, y);
        this.velocity = createVector (0, v);
        this.is_pocketed = false;
    }
    
    update () {
        
        

        if (this.is_pocketed) {
            this.velocity.y += 2 * Friction;
        }
        
        let m = p5.Vector.mag(this.velocity);

        if (m > 0) {
            this.velocity.setMag(m - Friction);
        }

        if (m < Friction) {
            this.velocity.setMag(0);
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.bounceWall();
    }
    
    show(num = -1) {
        stroke (0);
        strokeWeight(0.5);
        textAlign(CENTER);
        
        switch(num) {
            case 1:
            case 9:
                fill(color("yellow"));
                break;
            case 2:
            case 10:
                fill(color("blue"));
                break;
            case 3:
            case 11:
                fill(color("red"));
                break;
            case 4: 
            case 12:
                fill(color("purple"));
                break;
            case 5:
            case 13:
                fill(color("orange"));
                break;
            case 6: 
            case 14:
                fill(color("green"));
                break;
            case 7: 
            case 15:
                fill(color("maroon"));
                break;
            case 8: 
                fill(color("black"));
                break;
                
            default:
                fill(255);
                break;
        }
        
        if (num <= 8 && num > 0) {
            ellipse(this.position.x, this.position.y, DIAMETER);
            fill("#ffffff");
            //text(num, this.position.x, this.position.y + 4);
        } else if (num > 8) {
            //striped
            ellipse(this.position.x, this.position.y, DIAMETER);
            fill("#ffffff");
            arc(this.position.x, this.position.y, DIAMETER, DIAMETER, PI / 6, 5 * PI / 6, CHORD);
            arc(this.position.x, this.position.y, DIAMETER, DIAMETER, 7 * PI / 6, 11 * PI / 6, CHORD);
        } else {
            ellipse(this.position.x, this.position.y, DIAMETER);
        }
    }
    
    
    
    bounceWall () {
        
        if (this.is_pocketed) {
            if (this.position.y > 250) {
                this.velocity.y = -1 * abs(this.velocity.y);
            }
            return;
        }
        
        
        //walls of google image
//        const L = 186.5;
//        const R = 411.5;
//        const U = 81;
//        const D = 517;
//        
//        //bumpers of google image
//        //y vals / u + d boundaries
//        const Uu = 104;
//        const Ud = 281;
//        const Du = 317;
//        const Dd = 492.5;
//        
//        // x vals / l + r boundaries
//        const l = 218;
//        const r = 380.5;
        
        //walls of own image
        const L = 182;
        const R = 416;
        const U = 80.5;
        const D = 521.5;
        
        //bumpers of own image
        //y vals / u + d boundaries
        const Uu = 100;
        const Ud = 282.5;
        const Du = 314;
        const Dd = 502.5;
        
        // x vals / l + r boundaries for u + d bumpers
        const l = 202.5;
        const r = 396;
        
        //need to offset each by radius
        if (this.position.x - DIAMETER / 2 <= L) {
            if (this.position.y > Uu && this.position.y < Ud) {
                this.velocity.x = abs(this.velocity.x);
            } else if (this.position.y > Du && this.position.y < Dd) {
                this.velocity.x = abs(this.velocity.x);
            } else {
                this.pocketBall();
            }
        }
        if (this.position.x + DIAMETER / 2 >= R && this.velocity.x > 0) {
            if (this.position.y > Uu && this.position.y < Ud) {
                this.velocity.x = -1 * abs(this.velocity.x);
            } else if (this.position.y > Du && this.position.y < Dd) {
                this.velocity.x = -1 * abs(this.velocity.x);
            } else {
                this.pocketBall();
            }        
        }
        if (this.position.y + DIAMETER / 2 >= D  && this.velocity.y > 0) {
            if (this.position.x > l && this.position.x < r) {
                this.velocity.y = -1 * abs(this.velocity.y);
            } else {
                this.pocketBall();
            }
        }
        if (this.position.y - DIAMETER / 2 <= U  && this.velocity.y < 0) {
            if (this.position.x > l && this.position.x < r) {
                this.velocity.y = abs(this.velocity.y);
            } else {
                console.log("Pocket");
                this.pocketBall();
            }
        }
    }
    
    collide(other) {
        if (dist(this.position.x, this.position.y, other.position.x, other.position.y) < DIAMETER) {
            return true;
        }
        return false;
    }
    
    bounceBall (other) {
        //normal vector n
        let n = p5.Vector.sub(this.position, other.position);
        
        const dist = n.mag();
        
        //minimum translation distance
        const mtd = n.mult((DIAMETER - dist) / dist);
        
        //move both balls equally
        this.position.add(mtd.mult(1/2));
        other.position.sub(mtd.mult(1/2));
        
        //unit vector of n
        let un = p5.Vector.div(n, n.mag());
        
        //unit tangential vector
        let ut = createVector(-un.y, un.x);
        
        //step three, scalars
        let v1n = p5.Vector.dot(un, this.velocity);
        let v1t = p5.Vector.dot(ut, this.velocity);
        let v2n = p5.Vector.dot(un, other.velocity);
        let v2t = p5.Vector.dot(ut, other.velocity); 
                
        //step 4-5
        let v1nTag = v2n;
        let v2nTag = v1n; 
        
        //step 6
        v1nTag = p5.Vector.mult(un, v1nTag);
        const v1tTag = p5.Vector.mult(ut, v1t);
        v2nTag = p5.Vector.mult(un, v2nTag);
        const v2tTag = p5.Vector.mult(ut, v2t);
        
        //update velocities
        this.velocity = v1nTag.add(v1tTag);
        other.velocity = v2nTag.add(v2tTag);
    }
    
    pocketBall() {
        this.is_pocketed = true;
        this.position.x = 550;
        this.position.y = 100;
        this.velocity.x = 0;
        this.velocity.y = 1;
    }
    
}
