// DESAFIO 1
const COUNTER_SIZE = new Vector(80, 30);

/**
 * This class defines the counters for score and
 * level (and possibly an FPS counter)
 */

class Counter extends Entity {

    /**
     * @argument { HTMLDivElement } containerElement 
     * @argument { String } name 
     * @argument { number } initialValue 
     * @argument { Vector} position
     */
    constructor (containerElement, name, initialValue, position) {
        super(containerElement, COUNTER_SIZE, position);

        this.rootElement.classList.add("counter");

        this.name = name;
        this.value = initialValue;

        console.log('oi');
    }

    update (increment) {
        // This increments the counter
        this.value += increment;
    }

    display () {
        // This creates a string in the form "score: 3"
        return this.name + ': ' + this.value;
    }
}