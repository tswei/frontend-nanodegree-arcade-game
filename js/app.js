// Enemies our player must avoid
var Enemy = function() {
    // Initializes enemy with start positions and sprite image
    this.sprite = 'images/enemy-bug.png';
    this.initx = 101;
    this.inity = 83;
};

Enemy.prototype.update = function(dt) {
    // Updates enemy positions with time increment (dt)
    dt *= (player.level % 3) + 1;
    if (this.y % 2 === 1) {
        if (this.x < this.initx * 6) {
            this.x += this.initx * dt * this.inity / this.y;
        } else {
            this.x = -this.initx;
        }
    } else {
        if (this.x > -this.initx) {
            this.x -= this.initx * dt * this.inity / this.y;
        } else {
            this.x = this.initx * 6;
        }
    }
};

Enemy.prototype.render = function() {
    // Render sprite image on screen
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "15px Serif";
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";


    // Renders Life and Score count on screen
    if (this.lives) {
        ctx.textAlign = "right";
        ctx.strokeText("LIVES : " + this.lives, 480, 575);
        ctx.fillText("LIVES : " + this.lives, 480, 575);
    }
    if (this.score >= 0) {
        ctx.textAlign = "left";
        ctx.strokeText("SCORE : " + this.score, 25, 575);
        ctx.fillText("SCORE : " + this.score, 25, 575);
    }
};

// Player object controlled by keyboard input
var Player = function() {
    // Initialize with start position, sprite image, and initial conditions
    this.sprite = 'images/char-boy.png';
    this.initx = 101*2;
    this.inity = 83*5;
    this.lives = 3;
    this.score = 0;
    this.level = 1;
    this.invincible = false;
    this.invinciblereset = 0;
};

Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    // Sets timeout on invincibility
    if (this.invinciblereset > 0) {
        this.invinciblereset -= dt;
    } else {
        this.invincible = false;
    }
};

Player.prototype.handleInput = function(n) {
    // moves player tile by tile and restricts movement past border
    if (n==='left' && this.x > 0) {
        this.x -= 101;
    } else if (n==='right' && this.x < 101*4) {
        this.x += 101;
    } else if (n==='up' && this.y > 0) {
        this.y -= 83;
    } else if (n==='down' && this.y < 83*5) {
        this.y += 83;
    }
};

// Creates collectable Item objects to augment play
var Item = function() {
    // initializes count before items appear
    this.countdt = 0;
    // initializes item array and cdf
    this.cdf = [0.4, 0.6, 0.7, 0.74, 0.75, 0.8, 1];
    this.itemcdf = [GemBlue, GemGreen, GemOrange,
        Key, Heart, Star, Rock];
    this.displayed  = [];
};

Item.prototype = Object.create(Enemy.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function(dt) {
    // Random time increment between item pops
    // Removal of items from board after duration
    this.displayed.forEach(function(item, index) {
        item.count += dt;
        if (item.count > 10) {
            items.displayed.splice(index, 1);
        }
    });
    this.countdt += dt;
    var threshold = (Math.random() * 5) + 2;
    if (this.countdt > threshold) {
        this.roulette();
        this.countdt = 0;
    }
};

Item.prototype.roulette = function() {
    // Weighted Random selection of possible items
    var select = Math.random();
    var temp;
    for (var i = 0; i < this.cdf.length; i++) {
        if (this.cdf[i] > select) {
            temp = new this.itemcdf[i]();
            temp.location();
            temp.count = 0;
            this.displayed.push(temp);
            return;
        }
    }
};

Item.prototype.location = function() {
    // creates random item location
    var itemx, itemy;
    var repeatx = true;
    var repeaty = true;
    while (repeatx && repeaty) {
        itemx = (Math.floor(Math.random() * 6)) * 101;
        if (Math.abs(player.x - itemx) > 101) {
            this.x = itemx;
            repeatx = false;
        }
        itemy = (Math.floor(Math.random() * 3) + 1) * 83;
        if (Math.abs(player.y - itemy) > 83) {
            this.y = itemy;
            repeaty = false;
        }
    }
};

// Item Objects called by array itemcdf
var GemBlue = function() {
    // increases score
    this.sprite = "images/Gem Blue.png";
    this.value = 1;
    this.rate = 0.5;
};

GemBlue.prototype = Object.create(Item.prototype);
GemBlue.prototype.constructor = GemBlue;

var GemGreen = function() {
    // increases score
    this.sprite = "images/Gem Green.png";
    this.value = 2;
    this.rate = 0.2;
};

GemGreen.prototype = Object.create(Item.prototype);
GemGreen.prototype.constructor = GemGreen;

var GemOrange = function() {
    // increases score
    this.sprite = "images/Gem Orange.png";
    this.value = 5;
    this.rate = 0.1;
};

GemOrange.prototype =  Object.create(Item.prototype);
GemOrange.prototype.constructor = GemOrange;

var Key = function() {
    // increases score
    this.sprite = "images/Key.png";
    this.value = 50;
    this.rate = 0.04;
};

Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

var Heart = function() {
    // Adds a life
    this.sprite = "images/Heart.png";
    this.value = "life";
    this.rate = 0.01;
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

var Star = function() {
    // Adds invulnerability
    this.sprite = "images/Star.png";
    this.value = "invincible";
    this.rate = 0.05;
};

Star.prototype = Object.create(Item.prototype);
Star.prototype.constructor = Star;

var Rock = function() {
    // decreases score
    this.sprite = "images/Rock.png";
    this.value = -2;
    this.rate = 0.2;
};

Rock.prototype = Object.create(Item.prototype);
Rock.prototype.constructor = Rock;

var Populate = function(level) {
    var result = [];
    var limit = 2;
    for (var row = 0; row < 3; row++) {
        for (var num = 0; num < limit && num < level; num++) {
            result.push(addNew(row, num, limit));
        }
    }
    return result;
};

var addNew = function(row, num, limit) {
    var enemy = new Enemy();
    enemy.y = (row + 1) * enemy.inity;
    enemy.x = ((707 / limit) * num);
    return enemy;
};

// Creates level object to notify level increase
var Level = function() {
    this.level = player.level;
    this.dtinit = Math.PI;
    this.px = 0;
};

Level.prototype.update = function(dt) {
    this.dtinit -= dt;
    this.px = 48 * Math.abs(Math.sin(Math.PI - this.dtinit));
};

Level.prototype.render = function(text) {
    if (this.px > 0) {
        ctx.textAlign = "center";
        ctx.font = this.px + "px Serif";
        ctx.lineWidth = 3.0;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.strokeText(text, 505/2, 606/2);
        ctx.fillText(text, 505/2, 606/2);
    }
};

// Now instantiate your objects.
// Place the player object in a variable called player
var player = new Player();

// Place all enemy objects in an array called allEnemies
var allEnemies = Populate(player.level);

// Create items object
var items = new Item();

// Initialize level notification
var level = new Level();

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
