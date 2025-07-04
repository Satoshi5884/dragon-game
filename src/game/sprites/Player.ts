import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
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
  private currentState: string = 'idle'
  private textureCache: { [key: string]: string } = {}
  private stateFrameCount: number = 0
  private lastDesiredState: string = 'idle'
  private controlMode: 'pc' | 'mobile' = 'pc'
  private mobileDirection: 'left' | 'right' = 'right'
  private isMobileMoving: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number, characterType: number = 1) {
    // Set sprite prefix based on character type
    const spritePrefix = characterType === 1 ? 'player' : `player${characterType}`
    super(scene, x, y, `${spritePrefix}-idle`)
    
    this.characterType = characterType
    this.currentState = 'idle'
    
    // Cache texture names to avoid string concatenation in update loop
    this.textureCache = {
      'idle': `${spritePrefix}-idle`,
      'run': `${spritePrefix}-run-1`,
      'jump': `${spritePrefix}-jump`
    }
    
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Scale down the sprite
    this.setScale(0.08)
    
    this.setCollideWorldBounds(true)
    // Player sprite dimensions: idle(679x814), jump(707x853), run(707-717x853-859)
    // Setting collision box to match scaled sprite size
    // Make collision box smaller for player3 to prevent falling through gaps
    if (characterType === 3) {
      this.setSize(350, 550)
      this.setOffset(165, 125)
    } else {
      this.setSize(400, 600)
      this.setOffset(140, 100)
    }
    
    this.cursors = scene.input.keyboard!.createCursorKeys()
    
    // Get control mode from registry
    this.controlMode = scene.registry.get('controlMode') || 'pc'
    
    // Add space key for jumping (PC mode only)
    if (this.controlMode === 'pc') {
      const spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      spaceKey.on('down', () => this.jump())
    } else {
      // Mobile mode - start moving right initially
      this.isMobileMoving = true
      this.mobileDirection = 'right'
    }
  }

  update() {
    if (this.isDead) return

    const onGround = this.body!.blocked.down

    // Reset jump count when on ground
    if (onGround) {
      this.jumpCount = 0
    }

    // Handle movement based on control mode
    const baseSpeed = this.characterType === 3 ? 320 : 160  // Player3 is 2x faster
    
    if (this.controlMode === 'mobile') {
      // Mobile mode: move in current direction
      if (this.isMobileMoving) {
        if (this.mobileDirection === 'left') {
          this.setVelocityX(-baseSpeed)
          this.setFlipX(true)
        } else {
          this.setVelocityX(baseSpeed)
          this.setFlipX(false)
        }
      } else {
        this.setVelocityX(0)
      }
      
      // Override with manual input if provided
      if (this.moveLeft) {
        this.setVelocityX(-baseSpeed)
        this.setFlipX(true)
      } else if (this.moveRight) {
        this.setVelocityX(baseSpeed)
        this.setFlipX(false)
      }
    } else {
      // PC mode: original keyboard controls
      if (this.cursors.left.isDown || this.moveLeft) {
        this.setVelocityX(-baseSpeed)
        this.setFlipX(true)
      } else if (this.cursors.right.isDown || this.moveRight) {
        this.setVelocityX(baseSpeed)
        this.setFlipX(false)
      } else {
        this.setVelocityX(0)
      }
    }

    // Handle jumping - detect new jump press
    const jumpKeyPressed = this.cursors.up.isDown || this.jumpPressed
    if (jumpKeyPressed && !this.wasJumpPressed) {
      this.jump()
    }
    this.wasJumpPressed = jumpKeyPressed

    // Update sprite texture based on state
    // For player2 and player3, use ultra-stabilized state detection
    if (this.characterType === 2 || this.characterType === 3) {
      const currentVelocityX = this.body!.velocity.x
      const velocityThreshold = 50 // Even higher threshold
      
      // Check if player is actively moving based on input and control mode
      let isActivelyMoving: boolean
      if (this.controlMode === 'mobile') {
        isActivelyMoving = this.isMobileMoving || this.moveLeft || this.moveRight
      } else {
        isActivelyMoving = this.cursors.left.isDown || this.moveLeft || this.cursors.right.isDown || this.moveRight
      }
      const hasSignificantVelocity = Math.abs(currentVelocityX) > velocityThreshold
      
      // For stopping: if not actively moving, immediately consider it idle regardless of velocity
      const isMoving = isActivelyMoving && hasSignificantVelocity
      
      let desiredState: string
      if (!onGround) {
        desiredState = 'jump'
      } else if (isMoving) {
        desiredState = 'run'
      } else {
        desiredState = 'idle'
      }
      
      // Track if desired state has changed from last frame
      if (desiredState !== this.lastDesiredState) {
        this.stateFrameCount = 1
      } else {
        this.stateFrameCount++
      }
      
      // Only change visual state if new desired state has been stable for enough frames
      let requiredFrames = 5
      if (this.currentState === 'run' && desiredState === 'idle') {
        // When stopping, be more aggressive to prevent flickering
        requiredFrames = 2
      } else if (this.currentState === 'idle' && desiredState === 'run') {
        // When starting to move, wait a bit longer
        requiredFrames = 8
      }
      
      if (desiredState !== this.currentState && this.stateFrameCount >= requiredFrames) {
        this.currentState = desiredState
        const textureName = this.textureCache[desiredState]
        if (textureName && this.texture.key !== textureName) {
          this.setTexture(textureName)
        }
      }
      
      this.lastDesiredState = desiredState
    } else {
      // Original behavior for player1
      let isMoving: boolean
      if (this.controlMode === 'mobile') {
        isMoving = this.isMobileMoving || this.moveLeft || this.moveRight
      } else {
        isMoving = this.cursors.left.isDown || this.moveLeft || this.cursors.right.isDown || this.moveRight
      }
      
      if (!onGround) {
        if (this.texture.key !== this.textureCache['jump']) {
          this.setTexture(this.textureCache['jump'])
        }
      } else if (isMoving) {
        if (this.texture.key !== this.textureCache['run']) {
          this.setTexture(this.textureCache['run'])
        }
      } else {
        if (this.texture.key !== this.textureCache['idle']) {
          this.setTexture(this.textureCache['idle'])
        }
      }
    }

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
      // Respawn from above at the same X position
      this.setPosition(currentX, -100)  // Higher respawn for better visibility
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

  // Mobile control methods
  setMobileDirection(direction: 'left' | 'right') {
    this.mobileDirection = direction
    this.isMobileMoving = true
  }

  stopMobileMovement() {
    this.isMobileMoving = false
  }
}