import Phaser from 'phaser'
import { Player } from '../sprites/Player'
import { Enemy } from '../sprites/Enemy'

export class Stage2Scene extends Phaser.Scene {
  private player!: Player
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private enemies!: Phaser.Physics.Arcade.Group
  private coins!: Phaser.Physics.Arcade.Group
  private movingPlatforms!: Phaser.Physics.Arcade.Group
  private background!: Phaser.GameObjects.TileSprite
  private worldWidth: number = 3000
  private spikes!: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super({ key: 'Stage2Scene' })
  }

  create() {
    console.log('Stage2Scene: create() called')
    
    // Reset any previous state
    
    // Set world bounds for scrolling
    this.physics.world.setBounds(0, 0, this.worldWidth, 844)

    // Add scrolling background
    this.background = this.add.tileSprite(0, 0, 800, 600, 'bg-cave')
    this.background.setOrigin(0, 0)
    this.background.setScrollFactor(0)
    this.background.setDisplaySize(800, 600)

    // Create platforms
    this.platforms = this.physics.add.staticGroup()
    
    // Ground sections with gaps
    const groundTileWidth = 836 * 0.08
    // First section
    for (let i = 0; i < 8; i++) {
      const ground = this.platforms.create(i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    // Second section
    for (let i = 0; i < 8; i++) {
      const ground = this.platforms.create(680 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    // Third section with larger gap
    for (let i = 0; i < 5; i++) {
      const ground = this.platforms.create(1600 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    // Fourth section
    for (let i = 0; i < 8; i++) {
      const ground = this.platforms.create(2100 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    // Final section
    for (let i = 0; i < 4; i++) {
      const ground = this.platforms.create(2800 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }

    // Static platforms - more challenging layout
    this.platforms.create(150, 450, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(350, 400, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(550, 350, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(750, 300, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(950, 400, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(1150, 300, 'platform').setScale(0.16, 0.08).refreshBody()
    this.platforms.create(1400, 200, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(1600, 350, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(1850, 250, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(2100, 400, 'platform').setScale(0.16, 0.08).refreshBody()
    this.platforms.create(2350, 300, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(2550, 350, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(2750, 200, 'platform').setScale(0.16, 0.08).refreshBody()

    // Moving platforms - more difficult
    this.movingPlatforms = this.physics.add.group()
    
    const movingPlatform1 = this.movingPlatforms.create(300, 520, 'platform')
    movingPlatform1.setScale(0.08)
    movingPlatform1.setImmovable(true)
    movingPlatform1.body.allowGravity = false
    movingPlatform1.setVelocityX(80)
    
    const movingPlatform2 = this.movingPlatforms.create(900, 150, 'platform')
    movingPlatform2.setScale(0.08)
    movingPlatform2.setImmovable(true)
    movingPlatform2.body.allowGravity = false
    movingPlatform2.setVelocityY(60)
    
    const movingPlatform3 = this.movingPlatforms.create(1200, 480, 'platform')
    movingPlatform3.setScale(0.08)
    movingPlatform3.setImmovable(true)
    movingPlatform3.body.allowGravity = false
    movingPlatform3.setVelocityX(100)
    
    const movingPlatform4 = this.movingPlatforms.create(1800, 400, 'platform')
    movingPlatform4.setScale(0.08)
    movingPlatform4.setImmovable(true)
    movingPlatform4.body.allowGravity = false
    movingPlatform4.setVelocityY(40)
    
    const movingPlatform5 = this.movingPlatforms.create(2300, 520, 'platform')
    movingPlatform5.setScale(0.08)
    movingPlatform5.setImmovable(true)
    movingPlatform5.body.allowGravity = false
    movingPlatform5.setVelocityX(-70)

    // Create player with selected character
    const selectedCharacter = this.registry.get('selectedCharacter') || 1
    this.player = new Player(this, 50, 450, selectedCharacter)

    // Set camera to follow player
    this.cameras.main.setBounds(0, 0, this.worldWidth, 600)
    this.cameras.main.startFollow(this.player)

    // Create enemies
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    })

    // Add more enemies with challenging positions
    this.enemies.add(new Enemy(this, 150, 400, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 650, 400, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 400, 200, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 300, 300, 'enemy-slime'))
    this.enemies.add(new Enemy(this, 500, 100, 'enemy-slime'))
    this.enemies.add(new Enemy(this, 900, 450, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 1100, 350, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 1300, 450, 'enemy-slime'))
    this.enemies.add(new Enemy(this, 1500, 450, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 1700, 350, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 2000, 450, 'enemy-slime'))
    this.enemies.add(new Enemy(this, 2200, 350, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 2400, 450, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 2600, 400, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 2800, 450, 'enemy-slime'))

    // Create spikes
    this.spikes = this.physics.add.staticGroup()
    this.spikes.create(580, 570, 'spike').setScale(0.05).refreshBody()
    this.spikes.create(1050, 570, 'spike').setScale(0.05).refreshBody()
    this.spikes.create(1250, 570, 'spike').setScale(0.05).refreshBody()
    this.spikes.create(1450, 570, 'spike').setScale(0.05).refreshBody()
    this.spikes.create(1950, 570, 'spike').setScale(0.05).refreshBody()
    this.spikes.create(2650, 570, 'spike').setScale(0.05).refreshBody()
    
    // Create coins
    this.coins = this.physics.add.group()
    
    // Add coins in challenging positions
    const coinPositions = [
      { x: 320, y: 470 }, { x: 580, y: 520 }, // Over gaps and spikes
      { x: 900, y: 100 }, { x: 1200, y: 430 }, // On moving platforms
      { x: 750, y: 250 }, { x: 1150, y: 250 }, // High platforms
      { x: 1400, y: 150 }, { x: 1850, y: 200 },
      { x: 2100, y: 350 }, { x: 2350, y: 250 },
      { x: 2550, y: 300 }, { x: 2750, y: 150 },
      { x: 1050, y: 520 }, { x: 1250, y: 520 }, // Over spikes
      { x: 1450, y: 520 }, { x: 1950, y: 520 }
    ]

    coinPositions.forEach(pos => {
      const coin = this.coins.create(pos.x, pos.y, 'coin')
      coin.setScale(0.05)
      coin.setBounce(0)
      coin.body.setSize(400, 400)
      coin.body.setOffset(80, 80)
      // Make coins static (no gravity)
      coin.body.setAllowGravity(false)
      
      const originalY = pos.y
      this.tweens.add({
        targets: coin,
        y: originalY - 10,
        duration: 500,
        ease: 'Sine.inOut',
        yoyo: true,
        repeat: -1
      })
    })

    // Add collisions
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.movingPlatforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.enemies, this.movingPlatforms)
    
    // Player-spike collision
    this.physics.add.collider(this.player, this.spikes, this.handlePlayerSpikeCollision, undefined, this)
    
    // Enemies will use their internal movement range instead of walls

    // Player-enemy collision
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, undefined, this)

    // Player-coin collision
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)

    // Pass player reference to UI scene
    const uiScene = this.scene.get('UIScene') as any
    uiScene.setPlayer(this.player)
    
    // Add mobile touch controls if in mobile mode
    const controlMode = this.registry.get('controlMode') || 'pc'
    if (controlMode === 'mobile') {
      this.setupMobileControls()
    }

    // Win condition - moved to end of level
    const goal = this.add.rectangle(2950, 450, 80, 80, 0x00ff00, 0.8)
    this.physics.add.existing(goal, true)
    this.physics.add.overlap(this.player, goal, () => this.stageComplete(), undefined, this)
    
    // Add goal text
    this.add.text(2950, 380, 'GOAL', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    // Add stage text
    this.add.text(16, 80, 'Stage 2: Cave', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setScrollFactor(0)
    
    console.log('Stage2Scene: create() completed')
  }

  update() {
    this.player.update()
    
    // Check if player has fallen off the map (player's feet reach the bottom)
    if (this.player.y > 820) {  // 844 - 24 (approximate foot offset)
      console.log('Player fell off screen at Y:', this.player.y)
      this.player.fallOffScreen()
    }
    
    // Parallax scrolling for background
    this.background.tilePositionX = this.cameras.main.scrollX * 0.5

    // Update moving platforms with different ranges
    this.movingPlatforms.children.entries.forEach((platform: any, index: number) => {
      switch (index) {
        case 0: // Platform 1
          if (platform.x > 500 || platform.x < 100) {
            platform.setVelocityX(-platform.body.velocity.x)
          }
          break
        case 1: // Platform 2
          if (platform.y > 300 || platform.y < 100) {
            platform.setVelocityY(-platform.body.velocity.y)
          }
          break
        case 2: // Platform 3
          if (platform.x > 1400 || platform.x < 1000) {
            platform.setVelocityX(-platform.body.velocity.x)
          }
          break
        case 3: // Platform 4
          if (platform.y > 500 || platform.y < 300) {
            platform.setVelocityY(-platform.body.velocity.y)
          }
          break
        case 4: // Platform 5
          if (platform.x > 2500 || platform.x < 2100) {
            platform.setVelocityX(-platform.body.velocity.x)
          }
          break
      }
    })
  }

  handlePlayerEnemyCollision(player: any, enemy: any) {
    const p = player as Player
    const e = enemy as Enemy
    
    // Get player character type from registry
    const characterType = this.registry.get('selectedCharacter') || 1
    
    // Get positions
    const playerCenterY = p.y
    const enemyCenterY = e.y
    const playerCenterX = p.x
    const enemyCenterX = e.x
    
    // Player 1 (Easy): Can defeat enemies on any collision
    if (characterType === 1) {
      console.log('Player 1 - Easy mode: Enemy defeated on contact!')
      
      // Destroy enemy
      e.destroyEnemy()
      
      // Small bounce for feedback
      p.setVelocityY(-200)
      
      // Add score
      const uiScene = this.scene.get('UIScene') as any
      uiScene.updateScore(50)
      return
    }
    
    // Player 2 (Medium): Can only defeat enemies by stomping, but not spikes
    if (characterType === 2) {
      // Check if enemy is a spike - spikes cannot be stomped by player 2
      if (e.getEnemyType() === 'enemy-spike') {
        console.log('Player 2 - Medium mode: Spike collision - taking damage (cannot stomp spikes)')
        const lives = p.takeDamage()
        
        const uiScene = this.scene.get('UIScene') as any
        uiScene.updateLives(lives)
        return
      }
      
      // Stomping conditions for player 2 (non-spike enemies only)
      const isPlayerAbove = playerCenterY < enemyCenterY + 20  // Stricter than before
      const isPlayerFalling = p.body!.velocity.y > 30  // Must be falling with some speed
      const isHorizontallyClose = Math.abs(playerCenterX - enemyCenterX) < 60  // Closer range
      
      if (isPlayerAbove && isPlayerFalling && isHorizontallyClose) {
        console.log('Player 2 - Medium mode: Enemy stomped!')
        
        // Destroy enemy
        e.destroyEnemy()
        
        // Force player to bounce up automatically
        p.setVelocityY(-300)
        
        // Add score
        const uiScene = this.scene.get('UIScene') as any
        uiScene.updateScore(50)
      } else {
        console.log('Player 2 - Medium mode: Side collision - taking damage')
        // Side collision - player takes damage
        const lives = p.takeDamage()
        
        const uiScene = this.scene.get('UIScene') as any
        uiScene.updateLives(lives)
      }
      return
    }
    
    // Player 3 (Hard): Cannot defeat enemies at all
    if (characterType === 3) {
      console.log('Player 3 - Hard mode: Cannot defeat enemies - taking damage')
      // Player 3 always takes damage from any enemy collision
      const lives = p.takeDamage()
      
      const uiScene = this.scene.get('UIScene') as any
      uiScene.updateLives(lives)
      return
    }
  }

  collectCoin(_player: any, coin: any) {
    coin.destroy()
    const uiScene = this.scene.get('UIScene') as any
    uiScene.updateScore(10)
  }

  handlePlayerSpikeCollision(player: any, _spike: any) {
    const p = player as Player
    const lives = p.takeDamage()
    
    const uiScene = this.scene.get('UIScene') as any
    uiScene.updateLives(lives)
  }

  stageComplete() {
    // Prevent multiple calls
    if (this.registry.get('stage2Complete')) return
    
    // Mark as completed
    this.registry.set('stage2Complete', true)
    
    // Stop player physics
    this.physics.pause()
    this.player.setVelocity(0, 0)
    
    // Get the camera's current scroll position
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2
    
    this.add.text(centerX, centerY, 'Stage 2 Complete!', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.time.delayedCall(2000, () => {
      // Clear the flag
      this.registry.remove('stage2Complete')
      
      // Transition to next stage
      this.scene.stop('UIScene')
      this.scene.stop('Stage2Scene')
      this.scene.start('Stage3Scene')
      this.scene.launch('UIScene')
    })
  }

  setupMobileControls() {
    // Create invisible touch zones for mobile controls
    const leftZone = this.add.rectangle(0, 0, this.cameras.main.width / 2, this.cameras.main.height, 0x000000, 0)
    leftZone.setOrigin(0, 0)
    leftZone.setInteractive()
    leftZone.setScrollFactor(0)

    const rightZone = this.add.rectangle(this.cameras.main.width / 2, 0, this.cameras.main.width / 2, this.cameras.main.height, 0x000000, 0)
    rightZone.setOrigin(0, 0)
    rightZone.setInteractive()
    rightZone.setScrollFactor(0)

    // Left side tap: switch to left movement + jump
    leftZone.on('pointerdown', () => {
      this.player.setMobileDirection('left')
      this.player.jump()
    })

    // Right side tap: switch to right movement + jump
    rightZone.on('pointerdown', () => {
      this.player.setMobileDirection('right')
      this.player.jump()
    })
  }
}