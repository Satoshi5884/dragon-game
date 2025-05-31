import Phaser from 'phaser'
import { Player } from '../sprites/Player'

export class UIScene extends Phaser.Scene {
  private player?: Player
  private livesText?: Phaser.GameObjects.Text
  private scoreText?: Phaser.GameObjects.Text
  private score: number = 0

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    console.log('UIScene: create() called')

    // Score and lives display
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    })

    this.livesText = this.add.text(16, 48, 'Lives: 3', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    })

    // Virtual controls are disabled
  }

  createVirtualControls() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Left button
    const leftBtn = this.add.image(60, height - 80, 'button-left')
      .setInteractive(new Phaser.Geom.Rectangle(-100, -100, 200, 200), Phaser.Geom.Rectangle.Contains)
      .setAlpha(0.7)
      .setScale(0.08) // Button is 775x776

    leftBtn.on('pointerdown', () => {
      if (this.player) this.player.setMoveLeft(true)
      leftBtn.setAlpha(1)
    })

    leftBtn.on('pointerup', () => {
      if (this.player) this.player.setMoveLeft(false)
      leftBtn.setAlpha(0.7)
    })

    leftBtn.on('pointerout', () => {
      if (this.player) this.player.setMoveLeft(false)
      leftBtn.setAlpha(0.7)
    })

    // Right button
    const rightBtn = this.add.image(140, height - 80, 'button-right')
      .setInteractive(new Phaser.Geom.Rectangle(-100, -100, 200, 200), Phaser.Geom.Rectangle.Contains)
      .setAlpha(0.7)
      .setScale(0.08) // Button is 775x776

    rightBtn.on('pointerdown', () => {
      if (this.player) this.player.setMoveRight(true)
      rightBtn.setAlpha(1)
    })

    rightBtn.on('pointerup', () => {
      if (this.player) this.player.setMoveRight(false)
      rightBtn.setAlpha(0.7)
    })

    rightBtn.on('pointerout', () => {
      if (this.player) this.player.setMoveRight(false)
      rightBtn.setAlpha(0.7)
    })

    // Jump button
    const jumpBtn = this.add.image(width - 80, height - 80, 'button-jump')
      .setInteractive(new Phaser.Geom.Rectangle(-100, -100, 200, 200), Phaser.Geom.Rectangle.Contains)
      .setAlpha(0.7)
      .setScale(0.08) // Button is 818x789

    jumpBtn.on('pointerdown', () => {
      if (this.player) this.player.setJump(true)
      jumpBtn.setAlpha(1)
    })

    jumpBtn.on('pointerup', () => {
      if (this.player) this.player.setJump(false)
      jumpBtn.setAlpha(0.7)
    })

    jumpBtn.on('pointerout', () => {
      if (this.player) this.player.setJump(false)
      jumpBtn.setAlpha(0.7)
    })
  }

  setPlayer(player: Player) {
    console.log('UIScene: setPlayer called with player:', player)
    this.player = player
  }

  updateLives(lives: number) {
    if (this.livesText) {
      this.livesText.setText(`Lives: ${lives}`)
    }
  }

  updateScore(points: number) {
    this.score += points
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`)
    }
  }

  getScore() {
    return this.score
  }
}