class SceneA extends BaseScene{
    /**@type {string} */
    static sceneID ="sceneA"
    constructor(constructor){
    super(SceneA.sceneID)
    this.tileDataKey = "slopes"
    this.tileDataSource = "assets/tiledStuff/slopes.json"
    }
}
