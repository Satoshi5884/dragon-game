import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  private selectedCharacter: number = 1
  private characterSprites: Phaser.GameObjects.Image[] = []
  private selectionFrame!: Phaser.GameObjects.Rectangle
  private startButton!: Phaser.GameObjects.Text
  private howToPlayButton!: Phaser.GameObjects.Text
  private selectedControlMode: 'pc' | 'mobile' = 'mobile'
  private pcModeButton!: Phaser.GameObjects.Text
  private mobileModeButton!: Phaser.GameObjects.Text
  
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    console.log('MenuScene creating...')
    
    // Restore previous selection from registry if available
    this.selectedCharacter = this.registry.get('selectedCharacter') || 1
    this.selectedControlMode = this.registry.get('controlMode') || 'mobile'
    
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

    // Control mode selection
    this.add.text(width / 2, height / 4, 'Control Mode', {
      font: '20px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // PC Mode button
    this.pcModeButton = this.add.text(width / 2 - 80, height / 4 + 40, 'PC Mode', {
      font: '18px Arial',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive()

    // Mobile Mode button
    this.mobileModeButton = this.add.text(width / 2 + 80, height / 4 + 40, 'Mobile Mode', {
      font: '18px Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive()

    // Control mode button events
    this.pcModeButton.on('pointerdown', () => this.selectControlMode('pc'))
    this.mobileModeButton.on('pointerdown', () => this.selectControlMode('mobile'))

    // Character selection text
    this.add.text(width / 2, height / 2 - 80, 'Choose Your Character', {
      font: '20px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Character selection area
    const characterY = height / 2 - 20
    const spacing = 120
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
    
    // Set initial selection frame position based on restored selection
    this.selectionFrame.x = startX + (this.selectedCharacter - 1) * spacing
    
    // Set initial control mode based on restored selection
    this.selectControlMode(this.selectedControlMode)

    // Character names with difficulty
    this.add.text(startX, characterY + 80, 'Player 1\n(Easy)', {
      font: '18px Arial',
      color: '#00ff00',
      align: 'center'
    }).setOrigin(0.5)

    this.add.text(width / 2, characterY + 80, 'Player 2\n(Medium)', {
      font: '18px Arial',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5)

    this.add.text(startX + spacing * 2, characterY + 80, 'Player 3\n(Hard)', {
      font: '18px Arial',
      color: '#ff0000',
      align: 'center'
    }).setOrigin(0.5)

    // Start button
    this.startButton = this.add.text(width / 2, height * 0.65, 'ゲーム開始', {
      font: '28px Arial',
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
      this.startGame()
    })

    // How to Play button
    this.howToPlayButton = this.add.text(width / 2, height * 0.75, '操作方法', {
      font: '24px Arial',
      color: '#ffffff',
      backgroundColor: '#2a4d3a',
      padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive()

    this.howToPlayButton.on('pointerover', () => {
      this.howToPlayButton.setStyle({ backgroundColor: '#1e3a29' })
    })

    this.howToPlayButton.on('pointerout', () => {
      this.howToPlayButton.setStyle({ backgroundColor: '#2a4d3a' })
    })

    this.howToPlayButton.on('pointerdown', () => {
      this.scene.start('HowToPlayScene')
    })

    // Add space key for starting game
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    spaceKey.on('down', () => {
      this.startGame()
    })

    // Add arrow keys for character selection
    const leftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    const rightKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
    leftKey.on('down', () => {
      if (this.selectedCharacter > 1) {
        this.selectCharacter(this.selectedCharacter - 1)
      }
    })
    
    rightKey.on('down', () => {
      if (this.selectedCharacter < 3) {
        this.selectCharacter(this.selectedCharacter + 1)
      }
    })

    // Instructions
    this.add.text(width / 2, height * 0.88, '矢印キー: キャラクター変更 | スペース: ゲーム開始\n詳しい操作方法は「操作方法」ボタンをタップ', {
      font: '12px Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    // Add hover effects for characters
    this.characterSprites.forEach((sprite) => {
      sprite.on('pointerover', () => {
        sprite.setScale(0.14)
      })
      sprite.on('pointerout', () => {
        sprite.setScale(0.12)
      })
    })
  }

  selectControlMode(mode: 'pc' | 'mobile') {
    this.selectedControlMode = mode
    
    // Update button styles
    if (mode === 'pc') {
      this.pcModeButton.setStyle({ backgroundColor: '#16213e' })
      this.mobileModeButton.setStyle({ backgroundColor: '#333333' })
    } else {
      this.pcModeButton.setStyle({ backgroundColor: '#333333' })
      this.mobileModeButton.setStyle({ backgroundColor: '#16213e' })
    }
  }

  selectCharacter(character: number) {
    this.selectedCharacter = character
    const spacing = 120
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

  startGame() {
    // Store selected character and control mode in registry
    this.registry.set('selectedCharacter', this.selectedCharacter)
    this.registry.set('controlMode', this.selectedControlMode)
    this.scene.start('Stage1Scene')
    this.scene.launch('UIScene')
  }
}