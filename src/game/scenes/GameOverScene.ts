import Phaser from 'phaser'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0, 0)

    // Game Over text
    this.add.text(width / 2, height / 3, 'GAME OVER', {
      font: '64px Arial',
      color: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 6
    }).setOrigin(0.5)

    // Score
    const uiScene = this.scene.get('UIScene') as any
    const score = uiScene ? uiScene.getScore() : 0
    
    this.add.text(width / 2, height / 2, `Final Score: ${score}`, {
      font: '32px Arial',
      color: '#ffffff'
    }).setOrigin(0.5)

    // Retry button
    const retryButton = this.add.text(width / 2, height * 0.7, 'Retry', {
      font: '32px Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()

    retryButton.on('pointerover', () => {
      retryButton.setStyle({ backgroundColor: '#0f3460' })
    })

    retryButton.on('pointerout', () => {
      retryButton.setStyle({ backgroundColor: '#16213e' })
    })

    retryButton.on('pointerdown', () => {
      this.retry()
    })

    // Add space key for retry
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    spaceKey.on('down', () => {
      this.retry()
    })

    // Instructions
    this.add.text(width / 2, height * 0.85, 'Press Space or Click Retry to continue', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)
  }

  retry() {
    this.scene.stop('UIScene')
    this.scene.start('MenuScene')
  }
}