class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

        this.activePlayer = 'player1';
        this.playerScores = { player1: 0, player2: 0 };
        this.timeRemaining = 0;
    }

    create() {
        this.timeRemaining = game.settings.gameTimer;

        this.timerText = this.add.text(
            game.config.width - borderUISize - borderPadding,
            borderUISize + borderPadding,
            `Time: ${Math.ceil(this.timeRemaining / 1000)}`,
            {
                fontFamily: 'Courier',
                fontSize: '32px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                fixedWidth: 200,
            }
        ).setOrigin(1, 0).setDepth(10);

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.input.on('pointermove', (pointer) => {
            this.p1Rocket.x = Phaser.Math.Clamp(pointer.x, borderUISize, game.config.width - borderUISize);
        });

        this.input.on('pointerdown', (pointer) => {
            if (!this.p1Rocket.isFiring && pointer.leftButtonDown()) {
                this.p1Rocket.fire();
                console.log("Rocket fired!");
            }
        });

        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.scoreLeft = this.add.text(
            borderUISize + borderPadding,
            borderUISize + borderPadding * 2,
            `P1: ${this.playerScores['player1']} P2: ${this.playerScores['player2']}`,
            {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                fixedWidth: 300,
            }
        );

        this.playerTurnText = this.add.text(
            game.config.width / 2,
            borderUISize + borderPadding,
            `Turn: PLAYER 1`,
            { fontFamily: 'Courier', fontSize: '20px', color: '#FFFFFF' }
        ).setOrigin(0.5);

        this.gameOver = false;
    }

    update(time, delta) {
        if (!this.gameOver) {
            this.timeRemaining -= delta;
            this.timerText.setText(`Time: ${Math.ceil(this.timeRemaining / 1000)}`);
    
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.gameOver = true;
    
                let scoreConfig = { fontFamily: 'Courier', fontSize: '28px', fixedWidth: 0 };
                this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            }
        }
    
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.resetScores();
            this.scene.restart();
        }
    
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    
        this.starfield.tilePositionX -= 4;
    
        if (Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.p1Rocket.isFiring) {
            this.p1Rocket.fire();
            console.log("Keyboard fired rocket!");
        }
    
        this.p1Rocket.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
    
        // Check hits
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.adjustTime(5000); // Add time for hit
            this.switchPlayer();
        } else if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.adjustTime(3000); // Add time for hit
            this.switchPlayer();
        } else if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.adjustTime(2000); // Add time for hit
            this.switchPlayer();
        }
        // Check misses
        if (this.p1Rocket.isFiring && this.p1Rocket.y <= borderUISize * 3) {
            console.log("Miss detected! Subtracting time.");
            this.adjustTime(-2000); // Subtract time for a miss
            this.p1Rocket.reset();
            this.switchPlayer();
        }
    }

    adjustTime(amount) {
        this.timeRemaining = Math.max(0, this.timeRemaining + amount);
        this.timerText.setText(`Time: ${Math.ceil(this.timeRemaining / 1000)}`);
        console.log(`Time adjusted by ${amount}. New time: ${Math.ceil(this.timeRemaining / 1000)} seconds`);
    }

    switchPlayer() {
        this.activePlayer = this.activePlayer === 'player1' ? 'player2' : 'player1';
        this.playerTurnText.setText(`Turn: ${this.activePlayer.toUpperCase()}`);
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.playerScores[this.activePlayer] += ship.points;
        this.scoreLeft.setText(`P1: ${this.playerScores.player1} P2: ${this.playerScores.player2}`);
        this.sound.play('sfx-explosion');
    }

    resetScores() {
        this.playerScores = { player1: 0, player2: 0 };
        this.scoreLeft.setText(`P1: ${this.playerScores.player1} P2: ${this.playerScores.player2}`);
    }

    checkCollision(rocket, ship) {
        return (
            rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y
        );
    }
}
