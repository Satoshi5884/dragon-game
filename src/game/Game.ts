import Phaser from 'phaser'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'
import { Stage1Scene } from './scenes/Stage1Scene'
import { Stage2Scene } from './scenes/Stage2Scene'
import { Stage3Scene } from './scenes/Stage3Scene'
import { GameOverScene } from './scenes/GameOverScene'
import { UIScene } from './scenes/UIScene'

export class Game {
  private game: Phaser.Game

  constructor(container: HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      parent: container,
      width: 390,
      height: 844,
      backgroundColor: 0x87CEEB,
      render: {
        pixelArt: true,
        transparent: true
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 800 },
          debug: false
        }
      },
      scene: [
        PreloadScene,
        MenuScene,
        Stage1Scene,
        Stage2Scene,
        Stage3Scene,
        GameOverScene,
        UIScene
      ]
    }

    this.game = new Phaser.Game(config)
  }

  destroy() {
    this.game.destroy(true)
  }
}