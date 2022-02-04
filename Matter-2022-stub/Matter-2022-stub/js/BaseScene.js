class BaseScene extends Phaser.Scene {
  /** @type {string} */
  tileDataKey
  /** @type {string} */
  tileDataSource
  /**@type {Player} */
  player
  /**@type {number} */
  emojiMax = 10
  /**@type {number} */
  emojiCount
  /** @type {number} */
  emojiInterval = 5000
  //@ts-ignore
  matterCollision
  constructor(id) {
    super(id)
    /**@type {string} */
    this.id = id
    /**@type {object} */
    this.emojiSpawnPoint = {}
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
    this.emojiCount = 0
    const map = this.make.tilemap({ key: this.tileDataKey })
    const tileset = map.addTilesetImage('kenney-tileset')
    map.createLayer('background', tileset, 0, 0)
    const platformLayer = map.createLayer('platforms', tileset, 0, 0)
    map.createLayer('foreground', tileset, 0, 0)
    platformLayer.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(platformLayer)
    const objectLayer = map.getObjectLayer('objectLayer')
    let emojiDeathSensor
    let doorSensor
    let emojiStack=this.matter.add.imageStack('emoji',0,200,400,5,1,0,0,{
      ignoreGravity:true,
      //isStatic:true
    })
    let rectangleTest
    rectangleTest = this.matter.add.rectangle(100,100,100,100,{
      isStatic:true,
    })
    console.log(rectangleTest)
    
    
    objectLayer.objects.forEach(function (object) {
      //get correct format objects
      let obj = Utils.RetrieveCustomProperties(object)
      if (obj.type === "playerSpawn") {
        //prevents ghost player problem
        if (this.player != null) {
          //@ts-ignore
          this.player.sprite.destroy()
        }
        this.player = new Player(this, obj.x, obj.y)
      }
      else if (obj.type === "emojiSpawn") {
        //@ts-ignore
        this.emojiSpawnPoint = { x: obj.x, y: obj.y }
      }
      else if (obj.type === "emojiDeathRect") {
        //@ts-ignore
        emojiDeathSensor = this.matter.add.rectangle(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height, { isStatic: true, isSensor: true })
      }
      else if (obj.type === "exitRect") {
        //@ts-ignore
        doorSensor = this.matter.add.rectangle(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height, { isStatic: true, isSensor: true })
      }
    }, this)
    this.time.addEvent({
      delay: this.emojiInterval,
      callback: this.makeEmoji,
      callbackScope: this,
      loop: true
    })
    //https://github.com/mikewesthad/phaser-matter-collision-plugin plugin stuff
    this.matterCollision.addOnCollideStart({
      objectA: emojiDeathSensor,
      callback: function (evenData) {
        let gameObjectB = evenData.gameObjectB
        if (gameObjectB instanceof Phaser.Physics.Matter.Image && gameObjectB.texture.key === 'emoji') {
          gameObjectB.destroy()
          this.emojiCount--
        }
      },
      context: this
    })
    this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      objectB: doorSensor,
      callback: function (evenData) {
        console.log('change scene')
        this.changeScene()
      },
      context: this
    })
    this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: function (eventData) {
        let gameObjectB = eventData.gameObjectB
        if (gameObjectB instanceof Phaser.Tilemaps.Tile && gameObjectB.properties.isDeadly) {
          this.player.freeze()
          this.cameras.main.fade(250,0,0,0)
          this.cameras.main.once('camerafadeoutcomplete', function(){
            this.scene.restart()
          },this)
        }
      },
      context: this
    })
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5)
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  }
  update(time, delta) {
    this.player.update()
  }
  makeEmoji() {
    if (this.emojiCount >= this.emojiMax) {
      return
    }
    const texture = this.textures.get('emoji')
    const frame = Phaser.Math.Between(0, texture.frameTotal - 1)
    let emoji = this.matter.add.image(this.emojiSpawnPoint.x, this.emojiSpawnPoint.y, 'emoji', frame, {
      restitution: 1,
      friction: 0.1,
      density: 0.001,
      //@ts-ignore
      shape: 'circle'
    }).setScale(0.5)
    //this.physics.add.collider()
    this.emojiCount++

  }
  changeScene() {
  }
}
