import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Create loading text
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    })
    loadingText.setOrigin(0.5, 0.5)

    // Progress bar
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(250, 280, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })

    // Load player sprites
    this.load.image('player-idle', '/assets/sprites/player-idle.png')
    this.load.image('player-run-1', '/assets/sprites/player-run-1.png')
    this.load.image('player-run-2', '/assets/sprites/player-run-2.png')
    this.load.image('player-jump', '/assets/sprites/player-jump.png')
    
    // Load player2 sprites
    this.load.image('player2-idle', '/assets/sprites/player2-idle.png')
    this.load.image('player2-run-1', '/assets/sprites/player2-run-1.png')
    this.load.image('player2-run-2', '/assets/sprites/player2-run-2.png')
    this.load.image('player2-jump', '/assets/sprites/player2-jump.png')
    
    // Load player3 sprites
    this.load.image('player3-idle', '/assets/sprites/player3-idle.png')
    this.load.image('player3-run-1', '/assets/sprites/player3-run-1.png')
    this.load.image('player3-run-2', '/assets/sprites/player3-run-2.png')
    this.load.image('player3-jump', '/assets/sprites/player3-jump.png')
    
    // Load enemy sprites
    this.load.image('enemy-slime', '/assets/sprites/enemy-slime.png')
    this.load.image('enemy-bat', '/assets/sprites/enemy-bat.png')
    this.load.image('enemy-spike', '/assets/sprites/enemy-spike.png')
    
    // Load tiles
    this.load.image('ground', '/assets/tiles/ground.png')
    this.load.image('brick', '/assets/tiles/brick.png')
    this.load.image('platform', '/assets/tiles/platform.png')
    this.load.image('spike', '/assets/tiles/spike.png')
    
    // Load items
    this.load.image('coin', '/assets/items/coin.png')
    this.load.image('powerup', '/assets/items/powerup.png')
    
    // Load backgrounds
    this.load.image('bg-forest', '/assets/backgrounds/bg-forest.png')
    this.load.image('bg-cave', '/assets/backgrounds/bg-cave.png')
    this.load.image('bg-castle', '/assets/backgrounds/bg-castle.png')
    
    // Load UI elements
    this.load.image('button-left', '/assets/ui/button-left.png')
    this.load.image('button-right', '/assets/ui/button-right.png')
    this.load.image('button-jump', '/assets/ui/button-jump.png')
  }

  create() {
    console.log('PreloadScene complete, processing textures...')
    
    // Process only specific textures that need transparency
    // SKIP player2 and player3 sprites completely to avoid any processing issues
    const texturesToProcess = [
      'player-idle', 'player-run-1', 'player-run-2', 'player-jump',
      'enemy-slime', 'enemy-bat', 'enemy-spike',
      'coin', 'powerup',
      'ground', 'brick', 'platform',
      'button-left', 'button-right', 'button-jump'
    ]
    
    texturesToProcess.forEach(key => {
      if (this.textures.exists(key)) {
        const texture = this.textures.get(key)
        const source = texture.getSourceImage() as HTMLImageElement
        
        // Create a canvas to process the image
        const canvas = document.createElement('canvas')
        canvas.width = source.width
        canvas.height = source.height
        const ctx = canvas.getContext('2d')!
        
        // Draw the image
        ctx.drawImage(source, 0, 0)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Make white pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // If pixel is white or near-white
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0 // Set alpha to 0 (transparent)
          }
        }
        
        // Put the modified data back
        ctx.putImageData(imageData, 0, 0)
        
        // Update the texture with the new canvas
        this.textures.addCanvas(key, canvas)
      }
    })
    
    console.log('Textures processed, starting MenuScene...')
    // Start the menu scene
    this.scene.start('MenuScene')
  }
}