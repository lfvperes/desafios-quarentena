const ITEM_SIZE = 15;
const ITEM_SPEED = 1;

class Item extends MovableEntity {
    type = [
        {"name": "laser aim", "duration": 10, "selected": false},
        {"name": "double shot", "duration": 5, "selected": false},
        {"name": "missile", "duration": 5, "selected": false}
    ];
    constructor (
        containerElement,
        mapInstance,
        initialPosition
    ) {
        const size = ITEM_SIZE;
        
        const direction = Item.getRandomDirection();

        super(containerElement, size, initialPosition, initialPosition.scale(-0.001), direction);
        
        this.type = this.selectType();

        this.mapInstance = mapInstance;
        //this.rotationSpeed = 0;
        
        mapInstance.addEntity(this);

        this.rootElement.style.backgroundImage = "url('assets/aim.png')";
        this.rootElement.style.backgroundSize = this.size + 'px';
    }

    static getRandomDirection () {
        return new Vector(Math.random(), Math.random());
    }

    selectType () {
        let selection = Math.floor(this.type.length * Math.random());
        this.type[selection].selected = true;
        return this.type[selection];
    }

    collided (object) {
        if (!(object instanceof Player)) return;
        else {
            this.mapInstance.removeEntity(this);
            this.delete();
        }
    }

    frame () {
        super.frame();
        this.setDirection(this.direction);
    }

}