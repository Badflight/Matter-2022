class Player {
  /**@type {boolean} */
  isFrozen

  constructor(scene, x, y) {
    this.scene = scene
    this.touchData = {}
    this.sprite = scene.matter.add
      .sprite(0, 0, 'player',0)
      .setBody({
        type: "circle",
        radius: 14
      })
      .setScale(2)
      .setFixedRotation()
      .setPosition(x, y)
      .setBounce(0.01)
      .setFriction(0.001)
      .setMass(1)
      //animations
      this.scene.anims.create({
        key:'idle',
        frames: this.scene.anims.generateFrameNumbers('player',{
          start:0,
          end:3
        }),
        frameRate:3,
        repeat:-1
      })
      this.scene.anims.create({
        key:'run',
        frames: this.scene.anims.generateFrameNumbers('player',{
          start:8,
          end:15
        }),
        frameRate:12,
        repeat:-1
      })
      //
    this.scene.input.on('pointerdown', this.handlePointerDown, this)
    this.scene.input.on('pointerup', this.handlePointerUp, this)

  }
  handlePointerDown(pointer) {

    this.touchData.startX = pointer.x
    this.touchData.startY = pointer.y
  }
  handlePointerUp(pointer) {
    this.scene.scale.startFullscreen()
    this.touchData.endX = pointer.x
    this.touchData.endY = pointer.y
    this.handleTouch()
  }
  handleTouch() {
    const dx = this.touchData.endX - this.touchData.startX
    const dy = this.touchData.endY - this.touchData.startY
    console.log(dx,dy)
    this.touchData.startX = this.touchData.startY = this.touchData.endX = this.touchData.endY = 0
    const tolerance = 20
    if (dx > tolerance) {
      this.moveRight = true
    }
    else if(dx <-tolerance){
      this.moveLeft = true
    }
    if(dy <-tolerance){
      this.moveUp = true
    }
  }


  update() {
    if(this.isFrozen){
      return
    }
    const yForce = 0.025
    const xForce = 0.025
    if(this.moveRight){
      this.sprite.applyForce({x:xForce,y:0})
    }
    else if(this.moveLeft){
      this.sprite.applyForce({x:-xForce,y:0})
    }
    if(this.moveUp){
      this.sprite.applyForce({x:0, y:-yForce})
    }
    if(this.sprite.body.force.x !=0){
      this.sprite.anims.play('run',true)
    }
    else{
      this.sprite.anims.play('idle',true)
    }
    this.moveLeft = this.moveRight = this.moveUp = false
    
  }
  freeze(){
    this.sprite.setStatic(true)
    this.isFrozen=true
  }
  
  }
