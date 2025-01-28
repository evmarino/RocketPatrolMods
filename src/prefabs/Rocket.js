class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add object to the existing scene
        scene.add.existing(this);

        // Track rocket firing status
        this.isFiring = false;

        // Rocket speed
        this.moveSpeed = 2;
    }

    update() {
        // If the rocket is not firing, allow movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // If the rocket is firing, move it upward
        if (this.isFiring) {
            this.y -= this.moveSpeed;
            // Reset when it goes off screen
            if (this.y <= borderUISize * 3) {
                this.reset();
            }
        }
    }

    fire() {
        this.isFiring = true; // Rocket is now firing
    }

    reset() {
        this.isFiring = false; // Reset firing status
        this.y = game.config.height - borderUISize - borderPadding; // Reset to starting position
    }
}