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
    this.itemcdf = [GemBlue, GemGreen, GemOrange,
        Key, Heart, Star, Rock];
    this.displayed  = [];
}

Item.prototype = Object.create(Enemy.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function (dt) {
    // Weighted Random selection of possible items
    // Random time increment between item pops
    this.displayed.forEach(function(item, index) {
        item.count += dt;
        if (item.count > 15) {
            items.displayed.splice(index, 1);
        }
    });
    this.countdt += dt;
    var threshold = (Math.random() * 10) + 10;
    if (this.countdt > threshold) {
        this.roulette();
        this.countdt = 0;
    }

}

Item.prototype.roulette = function() {
    var select = Math.random();
    var temp
    for (var i = 0; i < this.cdf.length; i++) {
        if (this.cdf[i] > select) {
            temp = new this.itemcdf[i]
            temp.location();
            temp.count = 0;
            this.displayed.push(temp);
            return
        }
    }
}

Item.prototype.location = function () {
    // creates random item location
    this.x = (Math.floor(Math.random() * 6)) * 101;
    this.y = (Math.floor(Math.random() * 3) + 1) * 83;
}

// Refactor to pull out rate of item and create
// cdf from rates and automatically adjust random range
var GemBlue = function() {
    // increases score
    this.sprite = "images/Gem Blue.png";
    this.value = 1;
    this.rate = 0.5;
}

GemBlue.prototype = Object.create(Item.prototype);
GemBlue.prototype.constructor = GemBlue;

var GemGreen = function() {
    // increases score
    this.sprite = "images/Gem Green.png";
    this.value = 2;
    this.rate = 0.2;
}

GemGreen.prototype = Object.create(Item.prototype);
GemGreen.prototype.constructor = GemGreen;

var GemOrange = function() {
    // increases score
    this.sprite = "images/Gem Orange.png";
    this.value = 5;
    this.rate = 0.1;
}

GemOrange.prototype =  Object.create(Item.prototype);
GemOrange.prototype.constructor = GemOrange;

var Key = function() {
    // increases score
    this.sprite = "images/Key.png";
    this.value = 50;
    this.rate = 0.04;
}

Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

var Heart = function() {
    // Adds a life
    this.sprite = "images/Heart.png";
    this.value = "life";
    this.rate = 0.01;
}

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

var Star = function() {
    // Adds invulnerability
    this.sprite = "images/Star.png";
    this.value = "invincible";
    this.rate = 0.05;
}

Star.prototype = Object.create(Item.prototype);
Star.prototype.constructor = Star;

var Rock = function() {
    // decreases score
    this.sprite = "images/Rock.png";
    this.value = -2;
    this.rate = 0.2;
}

Rock.prototype = Object.create(Item.prototype);
Rock.prototype.constructor = Rock;

// Refactor into Enemy.protoype if possible
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

// Refactor into Enemy.protoype if possible
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
