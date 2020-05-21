const BULLET_SIZE = 10;
const BULLET_SPEED = 1;

/**
* This is a class declaration
* This class is responsible for defining the bullets behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Bullet extends MovableEntity {

	/**
	* @argument { HTMLDivElement } containerElement The DOM element that will contain the bullet
	* @argument { Map } mapInstance The map in which the bullet will spawn
	* @argument { Vector } direction The bullet's direction
	*/
	constructor (
		containerElement,
		mapInstance,
		direction,
		type
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BULLET_SIZE, undefined, direction.normalize().scale(BULLET_SPEED), direction);

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		this.damage = 1;
		// Assigns the bullet's image to it's element
		switch (type.name) {
			default:
				this.rootElement.style.backgroundImage = "url('assets/bullet.svg')";
				this.damage = 1;
				break;
			case "double shot":
				this.rootElement.style.backgroundImage = "url('assets/double.png')";
				this.damage = 2;
				break;
			case "missile":
				this.rootElement.style.backgroundImage = "url('assets/missile.png')";
				this.damage = 5;
				break;
		}
		this.rootElement.style.backgroundSize = this.size + 'px';
		console.log(type.name);
	}

	// If the bullet collides with an asteroid, delete the bullet.
	collided (object) {
		if (object instanceof Asteroid) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}
}