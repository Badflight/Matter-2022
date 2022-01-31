class BaseScene extends Phaser.Scene {
  /** @type {string} */
  tileDataKey
  /** @type {string} */
  tileDataSource
  player
  constructor(id) {
    super(id)
  }
  preload() {
    this.load.tilemapTiledJSON(this.tileDataKey, this.tileDataSource)
    this.load.image('kenney-tileset', 'assets/tiles/kenney-tileset-64px-extruded.png')
    this.load.spritesheet(
      'player',
      'assets/sprites/0x72-industrial-player-32px-extruded.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2
    }
    )
    this.load.spritesheet("emoji", "assets/sprites/emoji.png", {
      frameWidth: 74,
      frameHeight: 74
    })
  }
  create() {
  }
  update(time, delta) {
  }
  makeEmoji() {
  }
  changeScene() {
  }
}
