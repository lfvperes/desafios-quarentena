// DESAFIO

class Counter {
    /**
     * store all existing instances of counters
     * @type { Counter[] }
     */
    static allCounterElements = [];

    /**
     * @argument { HTMLElement } containerElement
     * @argument { String } id the element css id
     */
    constructor (containerElement, id) {
        this.id = id;
        this.count = 0;

        // Creates the counter's element'
        const element = document.createElement('div');

        // DESAFIO BÔNUS 4
        // displays the name of the counter
        const title = document.createElement('div');
        title.innerText = id;
        element.appendChild(title);
        
        // displays the count
        const content = document.createElement('p');
        content.classList.add('counter');
        content.innerText = this.count;
        element.appendChild(content);
        
        this.rootElement = element;
        element.id = id;
        containerElement.appendChild(element);

        Counter.allCounterElements.push(this);
    }

    /**
     * will update the variable value and update the HTML on screen
     * @argument { number } increment the amount to be added to the count
     */
    updateCounter(increment) {
        this.count += increment;
        document.getElementById(this.id).lastChild.innerText = this.count;
    }

    /**
     * will initiate the timer and make it update every second
     */
    setTimer() {
        // initial time
        this.count = 30;
        let timer = setInterval((
            () => {
                // the count will decrease
                this.updateCounter(-1);
                if (this.count <= 0) {
                    // the timer stops when it reaches zero
                    clearInterval(timer);
                    alert('game over');
                }
            }
        ), 1000);
    }
}