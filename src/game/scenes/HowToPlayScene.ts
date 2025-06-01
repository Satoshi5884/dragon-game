import Phaser from 'phaser'

export class HowToPlayScene extends Phaser.Scene {
  private backButton!: Phaser.GameObjects.Text
  
  constructor() {
    super({ key: 'HowToPlayScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0)

    // Title
    this.add.text(width / 2, 80, '操作方法', {
      font: '32px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5)

    // PC Mode
    this.add.text(width / 2, 160, 'PCモード', {
      font: '20px Arial',
      color: '#00ff00'
    }).setOrigin(0.5)

    this.add.text(width / 2, 200, '移動: ←→ または WASD\nジャンプ: スペース または ↑\n二段ジャンプ可能', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)

    // Mobile Mode
    this.add.text(width / 2, 300, 'モバイルモード', {
      font: '20px Arial',
      color: '#ffff00'
    }).setOrigin(0.5)

    this.add.text(width / 2, 340, '移動: 画面タップで方向変更\nジャンプ: 画面右下ボタン\n二段ジャンプ可能', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)

    // Characters
    this.add.text(width / 2, 440, 'キャラクター', {
      font: '20px Arial',
      color: '#ff6600'
    }).setOrigin(0.5)

    this.add.text(width / 2, 480, 'Player 1 (緑): 簡単 - 触れて倒す\nPlayer 2 (青): 普通 - 踏んで倒す\nPlayer 3 (赤): 難しい - 高速移動', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)

    // Goal
    this.add.text(width / 2, 580, 'ゲーム目標', {
      font: '20px Arial',
      color: '#ff00ff'
    }).setOrigin(0.5)

    this.add.text(width / 2, 620, 'コインを集めて敵を倒そう！\n画面外に落ちないよう注意', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5)

    // Back button
    this.backButton = this.add.text(width / 2, height - 80, '戻る', {
      font: '24px Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()

    this.backButton.on('pointerover', () => {
      this.backButton.setStyle({ backgroundColor: '#0f3460' })
    })

    this.backButton.on('pointerout', () => {
      this.backButton.setStyle({ backgroundColor: '#16213e' })
    })

    this.backButton.on('pointerdown', () => {
      this.goBackToMenu()
    })

    // Keyboard controls
    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      this.goBackToMenu()
    })
  }

  goBackToMenu() {
    this.scene.start('MenuScene')
  }
}