import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  private selectedCharacter: number = 1
  private characterSprites: Phaser.GameObjects.Image[] = []
  private selectionFrame!: Phaser.GameObjects.Rectangle
  private startButton!: Phaser.GameObjects.Text
  
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    console.log('MenuScene creating...')
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0)

    // Title
    this.add.text(width / 2, height / 6, 'Dragon Adventure', {
      font: '48px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    // Character selection text
    this.add.text(width / 2, height / 3, 'Choose Your Character', {
      font: '24px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Character selection area
    const characterY = height / 2 - 20
    const spacing = 200
    const startX = width / 2 - spacing

    // Selection frame (highlight)
    this.selectionFrame = this.add.rectangle(startX, characterY, 120, 120, 0x00ff00, 0)
    this.selectionFrame.setStrokeStyle(4, 0x00ff00)

    // Character 1
    const char1 = this.add.image(startX, characterY, 'player-idle')
    char1.setScale(0.12)
    char1.setInteractive()
    char1.on('pointerdown', () => this.selectCharacter(1))
    this.characterSprites.push(char1)

    // Character 2
    const char2 = this.add.image(width / 2, characterY, 'player2-idle')
    char2.setScale(0.12)
    char2.setInteractive()
    char2.on('pointerdown', () => this.selectCharacter(2))
    this.characterSprites.push(char2)

    // Character 3
    const char3 = this.add.image(startX + spacing * 2, characterY, 'player3-idle')
    char3.setScale(0.12)
    char3.setInteractive()
    char3.on('pointerdown', () => this.selectCharacter(3))
    this.characterSprites.push(char3)

    // Character names
    this.add.text(startX, characterY + 80, 'Player 1', {
      font: '18px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(width / 2, characterY + 80, 'Player 2', {
      font: '18px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(startX + spacing * 2, characterY + 80, 'Player 3', {
      font: '18px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Start button
    this.startButton = this.add.text(width / 2, height * 0.7, 'Start Game', {
      font: '32px Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()

    this.startButton.on('pointerover', () => {
      this.startButton.setStyle({ backgroundColor: '#0f3460' })
    })

    this.startButton.on('pointerout', () => {
      this.startButton.setStyle({ backgroundColor: '#16213e' })
    })

    this.startButton.on('pointerdown', () => {
      // Store selected character in registry
      this.registry.set('selectedCharacter', this.selectedCharacter)
      this.scene.start('Stage1Scene')
      this.scene.launch('UIScene')
    })

    // Instructions
    this.add.text(width / 2, height * 0.85, 'Click a character to select\nArrow Keys or Touch Controls to Move\nSpace or Jump Button to Jump', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    // Add hover effects for characters
    this.characterSprites.forEach((sprite, index) => {
      sprite.on('pointerover', () => {
        sprite.setScale(0.14)
      })
      sprite.on('pointerout', () => {
        sprite.setScale(0.12)
      })
    })
  }

  selectCharacter(character: number) {
    this.selectedCharacter = character
    const spacing = 200
    const startX = this.cameras.main.width / 2 - spacing
    
    // Update selection frame position
    this.selectionFrame.x = startX + (character - 1) * spacing
    
    // Animate selection
    this.tweens.add({
      targets: this.selectionFrame,
      alpha: { from: 1, to: 0.5 },
      duration: 200,
      yoyo: true
    })
  }
}