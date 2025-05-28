import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private isJumping: boolean = false
  private isDead: boolean = false
  private lives: number = 3
  private invulnerable: boolean = false
  private moveLeft: boolean = false
  private moveRight: boolean = false
  private jumpPressed: boolean = false
  private jumpCount: number = 0
  private maxJumps: number = 2
  private wasJumpPressed: boolean = false
  private isRespawning: boolean = false
  private characterType: number = 1
  private spritePrefix: string = 'player'
  private currentTexture: string = ''
  private currentState: string = 'idle' // Track current animation state
  private lastMovementTime: number = 0 // Track when movement last occurred

  constructor(scene: Phaser.Scene, x: number, y: number, characterType: number = 1) {
    // Set sprite prefix based on character type
    const spritePrefix = characterType === 1 ? 'player' : `player${characterType}`
    super(scene, x, y, `${spritePrefix}-idle`)
    
    this.characterType = characterType
    this.spritePrefix = spritePrefix
    this.currentTexture = `${spritePrefix}-idle`
    this.currentState = 'idle'
    this.lastMovementTime = 0 // Initialize movement time
    
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Scale down the sprite
    this.setScale(0.08)
    
    this.setCollideWorldBounds(false)
    // Player sprite dimensions: idle(679x814), jump(707x853), run(707-717x853-859)
    // Setting collision box to match scaled sprite size
    this.setSize(400, 600)
    this.setOffset(140, 100)
    
    this.cursors = scene.input.keyboard!.createCursorKeys()
    
    // Add space key for jumping
    const spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    spaceKey.on('down', () => this.jump())
  }

  update() {
    if (this.isDead) return

    const onGround = this.body!.blocked.down

    // Reset jump count when on ground
    if (onGround) {
      this.jumpCount = 0
      this.isJumping = false
    }

    // For player2 and player3, use a simpler approach - only change texture when absolutely necessary
    if (this.characterType === 2 || this.characterType === 3) {
      // Only update texture for major state changes
      const isMoving = this.cursors.left.isDown || this.moveLeft || this.cursors.right.isDown || this.moveRight
      
      if (!onGround && this.currentState !== 'jump') {
        this.currentState = 'jump'
        this.setTexture(`${this.spritePrefix}-jump`)
      } else if (onGround && isMoving && this.currentState !== 'run') {
        this.currentState = 'run'
        this.setTexture(`${this.spritePrefix}-run-1`)
      } else if (onGround && !isMoving && this.currentState !== 'idle') {
        this.currentState = 'idle'
        this.setTexture(`${this.spritePrefix}-idle`)
      }
    } else {
      // Original behavior for player1
      let desiredTexture: string
      
      if (!onGround) {
        desiredTexture = `${this.spritePrefix}-jump`
      } else if (this.cursors.left.isDown || this.moveLeft || this.cursors.right.isDown || this.moveRight) {
        desiredTexture = `${this.spritePrefix}-run-1`
      } else {
        desiredTexture = `${this.spritePrefix}-idle`
      }
      
      if (desiredTexture !== this.currentTexture) {
        this.setTexture(desiredTexture)
        this.currentTexture = desiredTexture
      }
    }

    // Handle movement
    if (this.cursors.left.isDown || this.moveLeft) {
      this.setVelocityX(-160)
      this.setFlipX(true)
    } else if (this.cursors.right.isDown || this.moveRight) {
      this.setVelocityX(160)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }

    // Handle jumping - detect new jump press
    const jumpKeyPressed = this.cursors.up.isDown || this.jumpPressed
    if (jumpKeyPressed && !this.wasJumpPressed) {
      this.jump()
    }
    this.wasJumpPressed = jumpKeyPressed

    // Handle invulnerability flashing
    if (this.invulnerable) {
      this.setAlpha(Math.sin(this.scene.time.now * 0.01) > 0 ? 0.5 : 1)
    }
  }

  jump() {
    if (this.isDead) return
    
    // Can jump if we haven't exceeded max jumps
    if (this.jumpCount < this.maxJumps) {
      this.setVelocityY(-400)
      this.jumpCount++
      this.isJumping = true
    }
  }

  takeDamage() {
    if (this.invulnerable || this.isDead) return this.lives

    this.lives--
    
    if (this.lives <= 0) {
      this.lives = 0  // Ensure lives doesn't go negative
      this.die()
    } else {
      this.invulnerable = true
      this.scene.time.delayedCall(2000, () => {
        this.invulnerable = false
        this.setAlpha(1)
      })
    }

    return this.lives
  }

  die() {
    this.isDead = true
    this.setVelocity(0, -300)
    this.setTint(0xff0000)
    this.scene.physics.world.disable(this)
    
    this.scene.time.delayedCall(1000, () => {
      this.scene.scene.start('GameOverScene')
    })
  }
  
  fallOffScreen() {
    if (this.isRespawning || this.isDead) return
    
    this.isRespawning = true
    const currentX = this.x
    
    // Take damage
    this.lives--
    const uiScene = this.scene.scene.get('UIScene') as any
    if (uiScene) {
      uiScene.updateLives(this.lives)
    }
    
    if (this.lives <= 0) {
      this.lives = 0
      this.die()
    } else {
      // Respawn from above
      this.setPosition(currentX, -50)
      this.setVelocity(0, 0)
      this.setTint(0xffffff)
      
      // Make temporarily invulnerable
      this.invulnerable = true
      this.scene.time.delayedCall(2000, () => {
        this.invulnerable = false
        this.isRespawning = false
        this.setAlpha(1)
      })
    }
  }

  getLives() {
    return this.lives
  }

  // Touch control methods
  setMoveLeft(value: boolean) {
    this.moveLeft = value
  }

  setMoveRight(value: boolean) {
    this.moveRight = value
  }

  setJump(value: boolean) {
    this.jumpPressed = value
    if (value) this.jump()
  }
}