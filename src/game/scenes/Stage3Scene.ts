import Phaser from 'phaser'
import { Player } from '../sprites/Player'
import { Enemy } from '../sprites/Enemy'

export class Stage3Scene extends Phaser.Scene {
  private player!: Player
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private enemies!: Phaser.Physics.Arcade.Group
  private coins!: Phaser.Physics.Arcade.Group
  private movingPlatforms!: Phaser.Physics.Arcade.Group
  private spikes!: Phaser.Physics.Arcade.StaticGroup
  private background!: Phaser.GameObjects.TileSprite
  private worldWidth: number = 4800

  constructor() {
    super({ key: 'Stage3Scene' })
  }

  create() {
    // Set world bounds for scrolling
    this.physics.world.setBounds(0, 0, this.worldWidth, 600)

    // Add scrolling background
    this.background = this.add.tileSprite(0, 0, 800, 600, 'bg-castle')
    this.background.setOrigin(0, 0)
    this.background.setScrollFactor(0)
    this.background.setDisplaySize(800, 600)

    // Create platforms
    this.platforms = this.physics.add.staticGroup()
    
    // Minimal ground - mostly gaps
    const groundTileWidth = 836 * 0.08
    // Start platform
    for (let i = 0; i < 5; i++) {
      const ground = this.platforms.create(i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    
    // Small islands of ground throughout the level
    for (let i = 0; i < 2; i++) {
      const ground = this.platforms.create(800 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    
    for (let i = 0; i < 2; i++) {
      const ground = this.platforms.create(1400 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    
    for (let i = 0; i < 3; i++) {
      const ground = this.platforms.create(2200 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    
    for (let i = 0; i < 2; i++) {
      const ground = this.platforms.create(3000 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }
    
    // End platform
    for (let i = 0; i < 5; i++) {
      const ground = this.platforms.create(4200 + i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      ground.setScale(0.08)
      ground.refreshBody()
    }

    // Challenging platform layout - Extended and more difficult
    // First section - warm up
    this.platforms.create(150, 500, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(300, 400, 'platform').setScale(0.12, 0.08).refreshBody()
    this.platforms.create(500, 450, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(650, 350, 'platform').setScale(0.12, 0.08).refreshBody()
    
    // Second section - vertical challenge
    this.platforms.create(850, 250, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(950, 150, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(1050, 100, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(1150, 200, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(1250, 300, 'platform').setScale(0.08, 0.08).refreshBody()
    
    // Third section - precision jumps
    this.platforms.create(1600, 400, 'platform').setScale(0.06, 0.08).refreshBody()
    this.platforms.create(1750, 350, 'platform').setScale(0.06, 0.08).refreshBody()
    this.platforms.create(1900, 300, 'platform').setScale(0.06, 0.08).refreshBody()
    this.platforms.create(2050, 250, 'platform').setScale(0.06, 0.08).refreshBody()
    
    // Fourth section - moving platform gauntlet area
    this.platforms.create(2400, 450, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(2600, 350, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(2800, 250, 'platform').setScale(0.08, 0.08).refreshBody()
    
    // Fifth section - zigzag ascent
    this.platforms.create(3200, 500, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(3350, 400, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(3200, 300, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(3350, 200, 'platform').setScale(0.08, 0.08).refreshBody()
    this.platforms.create(3500, 150, 'platform').setScale(0.12, 0.08).refreshBody()
    
    // Final section - ultimate challenge before goal
    this.platforms.create(3800, 250, 'platform').setScale(0.06, 0.08).refreshBody()
    this.platforms.create(3950, 350, 'platform').setScale(0.06, 0.08).refreshBody()
    this.platforms.create(4100, 300, 'platform').setScale(0.08, 0.08).refreshBody()

    // Multiple moving platforms
    this.movingPlatforms = this.physics.add.group()
    
    // Section 1 moving platforms
    const movingPlatform1 = this.movingPlatforms.create(350, 500, 'platform')
    movingPlatform1.setScale(0.08)
    movingPlatform1.setImmovable(true)
    movingPlatform1.body.allowGravity = false
    movingPlatform1.setVelocityX(80)
    
    // Section 2 moving platforms
    const movingPlatform2 = this.movingPlatforms.create(1000, 350, 'platform')
    movingPlatform2.setScale(0.08)
    movingPlatform2.setImmovable(true)
    movingPlatform2.body.allowGravity = false
    movingPlatform2.setVelocityY(60)

    const movingPlatform3 = this.movingPlatforms.create(1350, 400, 'platform')
    movingPlatform3.setScale(0.08)
    movingPlatform3.setImmovable(true)
    movingPlatform3.body.allowGravity = false
    movingPlatform3.setVelocityX(-70)
    
    // Section 3 moving platforms - precision required
    const movingPlatform4 = this.movingPlatforms.create(1800, 200, 'platform')
    movingPlatform4.setScale(0.06)
    movingPlatform4.setImmovable(true)
    movingPlatform4.body.allowGravity = false
    movingPlatform4.setVelocityY(80)
    
    // Section 4 - gauntlet of moving platforms
    const movingPlatform5 = this.movingPlatforms.create(2500, 400, 'platform')
    movingPlatform5.setScale(0.08)
    movingPlatform5.setImmovable(true)
    movingPlatform5.body.allowGravity = false
    movingPlatform5.setVelocityX(100)
    
    const movingPlatform6 = this.movingPlatforms.create(2700, 300, 'platform')
    movingPlatform6.setScale(0.08)
    movingPlatform6.setImmovable(true)
    movingPlatform6.body.allowGravity = false
    movingPlatform6.setVelocityY(-50)
    
    // Final section moving platform
    const movingPlatform7 = this.movingPlatforms.create(4000, 250, 'platform')
    movingPlatform7.setScale(0.06)
    movingPlatform7.setImmovable(true)
    movingPlatform7.body.allowGravity = false
    movingPlatform7.setVelocityX(-80)

    // Create spikes (deadly obstacles)
    this.spikes = this.physics.add.staticGroup()
    const spikeWidth = 636 * 0.06
    
    // Spike sections throughout the level
    // Section 1 spikes
    for (let x = 5 * groundTileWidth; x < 800; x += spikeWidth) {
      const spike = this.spikes.create(x + spikeWidth/2, 584, 'spike')
      spike.setScale(0.06)
      spike.refreshBody()
    }
    
    // Section 2 spikes
    for (let x = 950; x < 1400; x += spikeWidth) {
      const spike = this.spikes.create(x + spikeWidth/2, 584, 'spike')
      spike.setScale(0.06)
      spike.refreshBody()
    }
    
    // Section 3 spikes
    for (let x = 1550; x < 2200; x += spikeWidth) {
      const spike = this.spikes.create(x + spikeWidth/2, 584, 'spike')
      spike.setScale(0.06)
      spike.refreshBody()
    }
    
    // Section 4 spikes
    for (let x = 2400; x < 3000; x += spikeWidth) {
      const spike = this.spikes.create(x + spikeWidth/2, 584, 'spike')
      spike.setScale(0.06)
      spike.refreshBody()
    }
    
    // Section 5 spikes
    for (let x = 3150; x < 4200; x += spikeWidth) {
      const spike = this.spikes.create(x + spikeWidth/2, 584, 'spike')
      spike.setScale(0.06)
      spike.refreshBody()
    }

    // Create player with selected character
    const selectedCharacter = this.registry.get('selectedCharacter') || 1
    this.player = new Player(this, 50, 450, selectedCharacter)

    // Set camera to follow player
    this.cameras.main.setBounds(0, 0, this.worldWidth, 600)
    this.cameras.main.startFollow(this.player)

    // Create many enemies
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    })

    // Add lots of enemies throughout the extended level
    // Section 1 enemies
    this.enemies.add(new Enemy(this, 150, 450, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 300, 350, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 500, 400, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 650, 300, 'enemy-spike'))
    
    // Section 2 enemies
    this.enemies.add(new Enemy(this, 850, 200, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 950, 100, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 1050, 50, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 1150, 150, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 1250, 250, 'enemy-bat'))
    
    // Section 3 enemies - precision area
    this.enemies.add(new Enemy(this, 1600, 350, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 1750, 300, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 1900, 250, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 2050, 200, 'enemy-bat'))
    
    // Section 4 enemies - gauntlet
    this.enemies.add(new Enemy(this, 2400, 400, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 2500, 300, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 2600, 300, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 2700, 200, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 2800, 200, 'enemy-spike'))
    
    // Section 5 enemies - zigzag
    this.enemies.add(new Enemy(this, 3200, 450, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 3350, 350, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 3200, 250, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 3350, 150, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 3500, 100, 'enemy-spike'))
    
    // Final section enemies
    this.enemies.add(new Enemy(this, 3800, 200, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 3950, 300, 'enemy-spike'))
    this.enemies.add(new Enemy(this, 4100, 250, 'enemy-bat'))
    this.enemies.add(new Enemy(this, 4300, 520, 'enemy-spike'))

    // Create coins in very challenging positions
    this.coins = this.physics.add.group()
    
    const coinPositions = [
      // Section 1 coins
      { x: 350, y: 450 }, { x: 250, y: 300 }, { x: 550, y: 200 },
      { x: 400, y: 550 }, { x: 600, y: 550 },
      
      // Section 2 coins - vertical challenge
      { x: 850, y: 200 }, { x: 950, y: 100 }, { x: 1050, y: 50 },
      { x: 1150, y: 150 }, { x: 1250, y: 250 },
      
      // Section 3 coins - precision jumps
      { x: 1600, y: 350 }, { x: 1750, y: 300 }, { x: 1900, y: 250 },
      { x: 2050, y: 200 },
      
      // Section 4 coins - over spikes
      { x: 2500, y: 350 }, { x: 2700, y: 250 }, { x: 2900, y: 300 },
      
      // Section 5 coins - zigzag
      { x: 3200, y: 450 }, { x: 3350, y: 350 }, { x: 3200, y: 250 },
      { x: 3350, y: 150 }, { x: 3500, y: 100 },
      
      // Final section coins - ultimate challenge
      { x: 3800, y: 200 }, { x: 3950, y: 300 }, { x: 4100, y: 250 },
      { x: 4400, y: 450 }
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

    // Add power-ups at strategic locations
    const powerup1 = this.physics.add.sprite(1100, 50, 'powerup')
    powerup1.setScale(0.06)
    powerup1.setBounce(0)
    powerup1.body.setSize(500, 500)
    powerup1.body.setOffset(135, 115)
    this.physics.add.overlap(this.player, powerup1, () => {
      powerup1.destroy()
      this.player.takeDamage()
      const uiScene = this.scene.get('UIScene') as any
      uiScene.updateScore(50)
    })
    
    const powerup2 = this.physics.add.sprite(2600, 200, 'powerup')
    powerup2.setScale(0.06)
    powerup2.setBounce(0)
    powerup2.body.setSize(500, 500)
    powerup2.body.setOffset(135, 115)
    this.physics.add.overlap(this.player, powerup2, () => {
      powerup2.destroy()
      this.player.takeDamage()
      const uiScene = this.scene.get('UIScene') as any
      uiScene.updateScore(50)
    })
    
    const powerup3 = this.physics.add.sprite(3500, 50, 'powerup')
    powerup3.setScale(0.06)
    powerup3.setBounce(0)
    powerup3.body.setSize(500, 500)
    powerup3.body.setOffset(135, 115)
    this.physics.add.overlap(this.player, powerup3, () => {
      powerup3.destroy()
      this.player.takeDamage()
      const uiScene = this.scene.get('UIScene') as any
      uiScene.updateScore(50)
    })

    // Add collisions
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.movingPlatforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.enemies, this.movingPlatforms)
    
    // Spike collision (instant death)
    this.physics.add.collider(this.player, this.spikes, () => {
      this.player.die()
    })

    // Enemies will use their internal movement range instead of walls

    // Player-enemy collision
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, undefined, this)

    // Player-coin collision
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)

    // Pass player reference to UI scene
    const uiScene = this.scene.get('UIScene') as any
    uiScene.setPlayer(this.player)

    // Win condition - at the very end
    const goal = this.add.rectangle(4400, 450, 80, 120, 0x00ff00, 0.8)
    this.physics.add.existing(goal, true)
    this.physics.add.overlap(this.player, goal, () => this.gameComplete(), undefined, this)
  }

  update() {
    this.player.update()
    
    // Check if player has fallen off the map
    if (this.player.y > 600) {
      this.player.fallOffScreen()
    }
    
    // Parallax scrolling for background
    this.background.tilePositionX = this.cameras.main.scrollX * 0.5

    // Update moving platforms with different patterns
    this.movingPlatforms.children.entries.forEach((platform: any, index: number) => {
      if (index === 0) { // Section 1 - Horizontal
        if (platform.x > 550 || platform.x < 250) {
          platform.setVelocityX(-platform.body.velocity.x)
        }
      } else if (index === 1) { // Section 2 - Vertical
        if (platform.y > 450 || platform.y < 250) {
          platform.setVelocityY(-platform.body.velocity.y)
        }
      } else if (index === 2) { // Section 2 - Horizontal
        if (platform.x > 1450 || platform.x < 1250) {
          platform.setVelocityX(-platform.body.velocity.x)
        }
      } else if (index === 3) { // Section 3 - Vertical (precision)
        if (platform.y > 350 || platform.y < 150) {
          platform.setVelocityY(-platform.body.velocity.y)
        }
      } else if (index === 4) { // Section 4 - Horizontal (wide)
        if (platform.x > 2700 || platform.x < 2300) {
          platform.setVelocityX(-platform.body.velocity.x)
        }
      } else if (index === 5) { // Section 4 - Vertical
        if (platform.y > 400 || platform.y < 200) {
          platform.setVelocityY(-platform.body.velocity.y)
        }
      } else if (index === 6) { // Final - Horizontal
        if (platform.x > 4100 || platform.x < 3900) {
          platform.setVelocityX(-platform.body.velocity.x)
        }
      }
    })
  }

  handlePlayerEnemyCollision(player: any, enemy: any) {
    const p = player as Player
    const lives = p.takeDamage()
    
    const uiScene = this.scene.get('UIScene') as any
    uiScene.updateLives(lives)
  }

  collectCoin(player: any, coin: any) {
    coin.destroy()
    const uiScene = this.scene.get('UIScene') as any
    uiScene.updateScore(10)
  }

  gameComplete() {
    // Prevent multiple calls
    if (this.scene.isPaused()) return
    
    this.scene.pause()
    
    const uiScene = this.scene.get('UIScene') as any
    const finalScore = uiScene.getScore()
    
    // Get the camera's current scroll position
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2
    
    const completeText = this.add.text(centerX, centerY - 50, 'Congratulations!', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    const scoreText = this.add.text(centerX, centerY + 50, `Final Score: ${finalScore}`, {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    this.time.delayedCall(3000, () => {
      this.scene.stop('UIScene')
      this.scene.stop('Stage3Scene')
      this.scene.start('MenuScene')
    })
  }
}