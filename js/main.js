var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','assets/sprites/background.jpg');
    game.load.image('start','assets/sprites/start.png');
    game.load.image('finish','assets/sprites/finish.png');
    game.load.image('player','assets/sprites/car.png');
    game.load.image('fuel','assets/sprites/fuel.png');
    game.load.image('tire','assets/sprites/tires.png');
	game.load.audio('music', 'assets/audio/Axwell - Ingrosso - We Come We Rave We Love (Dex Morrison Remix).mp3');
}

var player;
var cursors;
var music;
var tire;
var jumpButton;
var scoreText;
var score = 0;
var scoreString = '';
var start;
var fuel;
var finish;
var bg;

function create() {
	
    game.world.setBounds(0, 0, 3400, 1000);
    bg = game.add.tileSprite(0, 0, 3400, 1000, 'background');
	
	start = game.add.sprite(0, 600, 'start');
	finish = game.add.sprite(3015, 600, 'finish');
	
	//music
    game.stage.backgroundColor = '#182d3b';
    game.input.touch.preventDefault = false;
    music = game.add.audio('music');
    music.play();
    game.input.onDown.add(changeVolume, this);
	
	//bitmapData
	game.physics.startSystem(Phaser.Physics.P2JS);
    player = game.add.sprite(250, 900, 'player');
    game.physics.p2.enable(player);
    cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.camera.follow(player);
	
	game.physics.arcade.enable([player, finish], Phaser.Physics.ARCADE);
    finish.body.setSize(100, 50, 50, 25);
    finish.body.immovable = true;
	
	//tire
	//  This sprite is using a texture atlas for all of its animation data
    tire = game.add.sprite(200, 200, 'tire');

    //  Here we add a new animation called 'run'
    //  We haven't specified any frames because it's using every frame in the texture atlas
    tire.animations.add('run');

    //  And this starts the animation playing by using its key ("run")
    //  15 is the frame rate (15fps)
    //  true means it will loop when it finishes
    tire.animations.play('run', 15, true);
	
	//fuel
	var group = game.add.group();
	for (var i = 0; i < 4; i++)
    {
        //  They are evenly spaced out on the X coordinate, with a random Y coordinate
        fuel = group.create(1000 * i, game.rnd.integerInRange(900, 900), 'fuel');
    }
	
	//score
	scoreString = 'Fuel : ';
    scoreText = game.add.text(10, 400, scoreString + score, { font: '34px Arial', fill: '#fff' });
	
	//timer
	game.time.events.add(Phaser.Timer.SECOND * 5, fadePicture, this);

}

function update() {
	
	//bitmapData
	player.body.setZeroVelocity();
    if (cursors.up.isDown){
        player.body.moveUp(300)
    }
    else if (cursors.down.isDown){
        player.body.moveDown(300);
    }
    if (cursors.left.isDown){
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown){
        player.body.moveRight(300);
    }
	
	//collision
    game.physics.arcade.overlap(player, finish, collisionHandler, null, this);
    game.physics.arcade.overlap(player, fuel, collision, null, this);
	
	//tire
    tire.x -= 2;

    if (tire.x < -tire.width)
    {
        tire.x = game.world.width;
    }
}

function collision(player, fuel) {
	
	fuel.kill();
	score += 20;
	scoreText.text = scoreString + score;
}

function collisionHandler (player, finish) {

    game.stage.backgroundColor = '#992d2d';

}

function fadePicture() {

	var text = "YOU LOSE!"
    game.add.tween(player).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.add.tween(fuel).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.add.tween(start).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.add.tween(finish).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    game.add.tween(bg).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

	var text = 'YOU LOSE!';
    var end = game.add.text(10, 400, text, { font: '500px Arial', fill: '#fff' });
	//game.debug.text("YOU LOSE!" 32, 32);
}

function render() {
	
	//music
	//game.debug.soundInfo(music, 20, 32);
	
	//collision
	game.debug.body(player);
    game.debug.body(finish);
	
	//timer
	game.debug.text("Time Left: " + game.time.events.duration, 32, 32);
	
}

function changeVolume(pointer) {

    if (pointer.y < 300){
        music.volume += 0.1;
    }
    else{
        music.volume -= 0.1;
    }
}