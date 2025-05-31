import Phaser from 'phaser'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number
  private direction: number = 1
  private enemyType: string
  private turnTimer: number = 0
  private turnInterval: number
  private verticalDirection: number = 1
  private initialX: number
  private initialY: number

  constructor(scene: Phaser.Scene, x: number, y: number, type: string = 'enemy-1') {
    super(scene, x, y, type)
    
    this.enemyType = type
    this.initialX = x
    this.initialY = y
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Set random turn interval for ground enemies (2-4 seconds)
    this.turnInterval = Phaser.Math.Between(2000, 4000)
    
    // Scale down the sprite
    this.setScale(0.08)
    
    this.setCollideWorldBounds(true)
    this.setBounce(0)
    
    // Set collision box based on enemy type
    // bat(958x474), slime(811x572), spike(752x707)
    switch(type) {
      case 'enemy-slime':
        this.setSize(600, 400)
        this.setOffset(100, 100)
        break
      case 'enemy-bat':
        this.setSize(700, 350)
        this.setOffset(130, 60)
        break
      case 'enemy-spike':
        this.setSize(550, 550)
        this.setOffset(100, 80)
        break
      default:
        this.setSize(600, 400)
        this.setOffset(100, 100)
    }
    
    // Different enemy types have different speeds
    switch(type) {
      case 'enemy-slime':
        this.moveSpeed = 50
        break
      case 'enemy-bat':
        this.moveSpeed = 80
        // Bats move diagonally
        this.setVelocityY(50 * this.verticalDirection)
        break
      case 'enemy-spike':
        this.moveSpeed = 100
        break
      default:
        this.moveSpeed = 50
    }
  }

  update(time: number, delta: number) {
    if (this.enemyType === 'enemy-bat') {
      // Bats move diagonally
      this.setVelocityX(this.moveSpeed * this.direction)
      this.setVelocityY(50 * this.verticalDirection)
      
      // Check screen boundaries for bats (including left and right)
      if (this.y <= 50) {
        this.verticalDirection = 1
      } else if (this.y >= 550) {
        this.verticalDirection = -1
      }
      
      // Check horizontal boundaries
      if (this.x <= 50) {
        this.direction = 1
        this.setFlipX(false)
      } else if (this.x >= this.scene.physics.world.bounds.width - 50) {
        this.direction = -1
        this.setFlipX(true)
      }
      
      // Check walls for bats
      if (this.body!.blocked.left || this.body!.blocked.right) {
        this.direction *= -1
        this.setFlipX(this.direction < 0)
      }
    } else {
      // Ground enemies move horizontally
      this.setVelocityX(this.moveSpeed * this.direction)
      
      // Check if fallen off the screen
      if (this.y > 650) {
        // Respawn from above at the same X position
        this.setPosition(this.x, -50)
        this.setVelocityY(0)
      }
      
      // Turn when hitting walls
      if (this.body!.blocked.left || this.body!.blocked.right) {
        this.direction *= -1
        this.setFlipX(this.direction < 0)
        this.turnTimer = 0
      } else {
        // Update turn timer for random turns
        this.turnTimer += delta
        
        // Turn based on timer
        if (this.turnTimer >= this.turnInterval) {
          this.direction *= -1
          this.setFlipX(this.direction < 0)
          this.turnTimer = 0
          // Set new random interval
          this.turnInterval = Phaser.Math.Between(2000, 4000)
        }
      }
    }
  }

  changeDirection() {
    this.direction *= -1
    this.setFlipX(this.direction < 0)
    this.turnTimer = 0
  }

  destroyEnemy() {
    // Add death animation/effect
    this.setTint(0xff0000)
    this.setVelocity(0, -200)
    
    // Disable physics body
    this.body!.enable = false
    
    // Remove after short delay
    this.scene.time.delayedCall(500, () => {
      this.destroy()
    })
  }
}