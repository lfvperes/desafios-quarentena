// DESAFIO BÔNUS 3
/**
 * This class extends the Gold class, as a Diamond object is the same as the Gold,
 * except for the background image, the score returned, and the chance of spawn.
 */
class Diamond extends Gold {
    /**
     * Store all existing instances of Diamonds, for easier tracking
     * @type { Diamond[] } 
     */
    static allDiamondElements = [];

    /**
     * @argument { HTMLDivElement } containerElement The HTML element in which the diamond should be created.
     * @argument { Vector } initialPosition The initial position of the gold
     */
    constructor (containerElement, initialPosition) {
        super(containerElement, initialPosition);

        // Assigning the correct Diamond sprite
        this.rootElement.style.backgroundImage = "url('assets/diamond.png')";

        Diamond.allDiamondElements.push(this);
    }

    // This method makes the Diamond 3 times worth a gold nugget.
    calculateScore () {
        return 5 * super.calculateScore();
    }
}