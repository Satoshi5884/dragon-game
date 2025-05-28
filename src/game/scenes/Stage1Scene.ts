import Phaser from 'phaser'
import { Player } from '../sprites/Player'
import { Enemy } from '../sprites/Enemy'

export class Stage1Scene extends Phaser.Scene {
  private player!: Player
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private enemies!: Phaser.Physics.Arcade.Group
  private coins!: Phaser.Physics.Arcade.Group
  private background!: Phaser.GameObjects.TileSprite
  private worldWidth: number = 2400 // Extended level width

  constructor() {
    super({ key: 'Stage1Scene' })
  }

  create() {
    console.log('Stage1Scene creating...')
    
    // Set world bounds for scrolling
    this.physics.world.setBounds(0, 0, this.worldWidth, 600)

    // Check if texture exists
    if (!this.textures.exists('bg-forest')) {
      console.warn('bg-forest texture not found, creating solid color background')
      // Create a simple colored background
      this.add.rectangle(0, 0, this.worldWidth, 600, 0x228B22).setOrigin(0, 0).setScrollFactor(0, 0)
    } else {
      // Add scrolling background
      this.background = this.add.tileSprite(0, 0, 800, 600, 'bg-forest')
      this.background.setOrigin(0, 0)
      this.background.setScrollFactor(0)
      this.background.setDisplaySize(800, 600)
    }

    // Create platforms
    this.platforms = this.physics.add.staticGroup()
    
    // Ground throughout the level
    console.log('Creating ground, texture exists:', this.textures.exists('ground'))
    const groundTileWidth = 836 * 0.08 // Actual scaled width of ground tile
    for (let i = 0; i < Math.floor(this.worldWidth / groundTileWidth); i++) {
      // Add gaps for challenge
      const tileIndex = Math.floor(i * groundTileWidth / 32)
      if ((tileIndex > 20 && tileIndex < 23) || (tileIndex > 40 && tileIndex < 44) || (tileIndex > 60 && tileIndex < 65)) {
        continue // Skip ground for gaps
      }
      const ground = this.platforms.create(i * groundTileWidth + groundTileWidth/2, 584, 'ground')
      if (ground) {
        ground.setScale(0.08) // Ground tile is 836x420
        ground.refreshBody()
      }
    }

    // Floating platforms throughout the level
    const platformData = [
      { x: 200, y: 450, scale: 3 },
      { x: 400, y: 350, scale: 2 },
      { x: 600, y: 400, scale: 2 },
      { x: 800, y: 300, scale: 2 },
      { x: 1000, y: 450, scale: 3 },
      { x: 1200, y: 350, scale: 2 },
      { x: 1400, y: 300, scale: 2 },
      { x: 1600, y: 400, scale: 2 },
      { x: 1800, y: 250, scale: 3 },
      { x: 2000, y: 350, scale: 2 },
      { x: 2200, y: 200, scale: 2 }
    ]

    platformData.forEach(p => {
      const platform = this.platforms.create(p.x, p.y, 'platform')
      platform.setScale(p.scale * 0.08, 0.08) // Platform tile is 716x335
      platform.refreshBody()
    })

    // Create player with selected character
    console.log('Creating player...')
    const selectedCharacter = this.registry.get('selectedCharacter') || 1
    this.player = new Player(this, 100, 450, selectedCharacter)
    console.log('Player created:', this.player, 'Character type:', selectedCharacter)

    // Set camera to follow player
    this.cameras.main.setBounds(0, 0, this.worldWidth, 600)
    this.cameras.main.startFollow(this.player)

    // Create enemies
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    })

    // Add enemies throughout the level
    const enemyData = [
      { x: 350, y: 520, type: 'enemy-slime' },
      { x: 600, y: 350, type: 'enemy-slime' },
      { x: 800, y: 250, type: 'enemy-bat' },
      { x: 1000, y: 400, type: 'enemy-slime' },
      { x: 1200, y: 300, type: 'enemy-bat' },
      { x: 1400, y: 250, type: 'enemy-spike' },
      { x: 1700, y: 520, type: 'enemy-slime' },
      { x: 1900, y: 520, type: 'enemy-slime' },
      { x: 2100, y: 520, type: 'enemy-spike' }
    ]

    enemyData.forEach(e => {
      this.enemies.add(new Enemy(this, e.x, e.y, e.type))
    })

    // Create coins
    this.coins = this.physics.add.group()
    
    // Add coins throughout the level
    const coinPositions = [
      { x: 200, y: 400 }, { x: 250, y: 400 }, { x: 300, y: 400 },
      { x: 400, y: 300 }, { x: 450, y: 300 },
      { x: 600, y: 350 }, { x: 650, y: 350 }, { x: 700, y: 350 },
      { x: 800, y: 250 }, { x: 850, y: 250 },
      { x: 1000, y: 400 }, { x: 1050, y: 400 }, { x: 1100, y: 400 },
      { x: 1200, y: 300 }, { x: 1250, y: 300 },
      { x: 1400, y: 250 }, { x: 1450, y: 250 },
      { x: 1600, y: 350 }, { x: 1650, y: 350 },
      { x: 1800, y: 200 }, { x: 1850, y: 200 }, { x: 1900, y: 200 },
      { x: 2000, y: 300 }, { x: 2050, y: 300 },
      { x: 2200, y: 150 }, { x: 2250, y: 150 }
    ]

    coinPositions.forEach(pos => {
      const coin = this.coins.create(pos.x, pos.y, 'coin')
      coin.setScale(0.05) // Smaller scale for 565x563 coin
      coin.setBounce(0)
      // Set collision box for coin
      coin.body.setSize(400, 400)
      coin.body.setOffset(80, 80)
      // Make coins static (no gravity)
      coin.body.setAllowGravity(false)
      
      // Store original Y position for animation
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
    this.physics.add.collider(this.enemies, this.platforms)
    
    // Enemies will use their internal movement range instead of walls

    // Player-enemy collision
    this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, undefined, this)

    // Player-coin collision
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this)

    // Pass player reference to UI scene
    const uiScene = this.scene.get('UIScene') as any
    uiScene.setPlayer(this.player)

    // Win condition - reach the end
    const goal = this.add.rectangle(2200, 300, 80, 120, 0x00ff00, 0.8)
    this.physics.add.existing(goal, true)
    this.physics.add.overlap(this.player, goal, () => this.stageComplete(), undefined, this)
    
    // Add goal text
    this.add.text(2200, 220, 'GOAL', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    // Add stage text
    this.add.text(16, 80, 'Stage 1: Forest', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setScrollFactor(0)
  }

  update() {
    this.player.update()
    
    // Check if player has fallen off the map
    if (this.player.y > 600) {
      this.player.fallOffScreen()
    }
    
    // Parallax scrolling for background
    this.background.tilePositionX = this.cameras.main.scrollX * 0.5
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

  stageComplete() {
    console.log('Stage1Scene: stageComplete called')
    // Prevent multiple calls
    if (this.registry.get('stage1Complete')) {
      console.log('Stage1Scene: Already completed, returning')
      return
    }
    
    // Mark as completed
    this.registry.set('stage1Complete', true)
    
    console.log('Stage1Scene: Pausing player physics')
    this.physics.pause()
    this.player.setVelocity(0, 0)
    
    // Get the camera's current scroll position
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2
    
    const completeText = this.add.text(
      centerX, 
      centerY, 
      'Stage 1 Complete!', 
      {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5)

    console.log('Stage1Scene: Setting delayed call for stage transition')
    this.time.delayedCall(2000, () => {
      console.log('Stage1Scene: Starting stage transition')
      
      // Clear the flag
      this.registry.remove('stage1Complete')
      
      // Transition to next stage
      this.scene.stop('UIScene')
      this.scene.stop('Stage1Scene')
      this.scene.start('Stage2Scene')
      this.scene.launch('UIScene')
    })
  }
}