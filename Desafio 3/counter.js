class Counter {
    
    /**
     * Separate containers for each counter, both inside a parent container
     * @argument { HTMLDivElement } containerElement
     * @argument { event } trigger
     */
    constructor (
        containerElement,
        trigger
    ) {
        this.containerElement = containerElement;
        this.count = 0;
        this.trigger = trigger;
    }

    /**
     * Increases the value of the counter by 1
     */
    update () {
        this.count++;
        this.containerElement.innerText = this.count;
    }
}