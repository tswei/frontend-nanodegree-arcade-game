// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initx = 101;
    this.inity = 83;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    dt *= (player.level % 3) + 1;
    if (this.y % 2 === 1) {
        if (this.x < this.initx * 6) {
            this.x += this.initx * dt * this.inity / this.y;
        } else {
            this.x = -this.initx
        }
    } else {
        if (this.x > -this.initx) {
            this.x -= this.initx * dt * this.inity / this.y;
        } else {
            this.x = this.initx * 6;
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Initialize player at middle of the bottom edge of the
    // board.
    this.sprite = 'images/char-boy.png'
    this.initx = 101*2;
    this.inity = 83*5;
    this.lives = 3;
    this.score = 0;
    this.level = 1;
}

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    //pass
}

Player.prototype.handleInput = function(n) {
    // moves player by tile and restricts movement on border
    if (n==='left' && this.x > 0) {
        this.x -= 101;
    } else if (n==='right' && this.x < 101*4) {
        this.x += 101;
    } else if (n==='up' && this.y > 0) {
        this.y -= 83;
    } else if (n==='down' && this.y < 83*5) {
        this.y += 83;
    }
}

// Create Item objects to augment play
var Item = function() {
    // initializes count
    this.countdt = 0;
    // initializes item array and cdf
    this.cdf = [0.4, 0.6, 0.7, 0.74, 0.75, 0.8, 1];
    this.itemcdf = [this.gemBlue, this.gemGreen, this.gemOrange,
        this.key, this.heart, this.star, this.rock];
}

Item.prototype.update = function (dt) {
    // Weighted Random selection of possible items
    // Random time increment between item pops
    this.countdt += dt;
    var threshold = (Math.random() * 10) + 5;
    if (this.countdt > threshold) {
        this.roulette();
        this.countdt = 0;
    }

}

Item.prototype.roulette = function() {
    var select = Math.random();
    for (var i = 0; i < this.cdf.length; i++) {
        if (this.cdf[i] >= select) {
            var fun = this.itemcdf[i];
            this.fun();
            console.log(this.sprite);
        }
    }
}

Item.prototype.location = function () {
    // places item at a random location

}


// Refactor to pull out rate of item and create
// cdf from rates and automatically adjust random range
Item.prototype.gemBlue = function() {
    // increases score
    this.sprite = "images/Gem Blue.png";
    this.value = 1;
    this.rate = 0.5;
}

Item.prototype.gemGreen = function() {
    // increases score
    this.sprite = "images/Gem Green.png";
    this.value = 2;
    this.rate = 0.2;
}

Item.prototype.gemOrange = function() {
    // increases score
    this.sprite = "images/Gem Orange.png";
    this.value = 5;
    this.rate = 0.1;
}

Item.prototype.key = function() {
    // increases score
    this.sprite = "images/Key.png";
    this.value = 50;
    this.rate = 0.04;
}

Item.prototype.heart = function() {
    // Adds a life
    this.sprite = "images/Heart.png";
    this.value = "life";
    this.rate = 0.01;
}

Item.prototype.star = function() {
    // Adds invulnerability
    this.sprite = "images/Star.png";
    this.value = "invincible";
    this.rate = 0.05;
}

Item.prototype.rock = function() {
    // decreases score
    this.sprite = "images/Rock.png";
    this.value = -2;
    this.rate = 0.2;
}

// Refactor into Enemy.protoype
var Populate = function(level) {
    var result = [];
    var limit = 2;
    for (var row = 0; row < 3; row++) {
        for (var num = 0; num < limit && num < level; num++) {
            result.push(addNew(row, num, limit));
        }
    }
    return result;
}

// Refactor into Enemy.protoype
var addNew = function(row, num, limit) {
    var enemy = new Enemy;
    enemy.y = (row + 1) * enemy.inity;
    enemy.x = ((707 / limit) * num);
    return enemy;
}

// Now instantiate your objects.
// Place the player object in a variable called player
var player = new Player;


// Place all enemy objects in an array called allEnemies
var allEnemies = Populate(player.level);

// Create items object
var items = new Item;
console.log(new Item);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
