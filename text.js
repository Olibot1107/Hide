// numbers are boring, letters would be cooler
const letters = "!<>-_\\/[]{}—=+*^?#________";

// when we hover over the <h1> tag, do the following
document.querySelector("h1").onmouseover = event => {
    // don't want to run this forever, so store it in a variable
    let iterations = 0;


    // run this thing for a particular period of time
    const interval = setInterval(() => {
    // change the <h1> text to a random number
    // letters[...] will change to letters when hovered
    event.target.innerText = event.target.innerText.split("")
    // this will iterate through all the letters, instead of showing just one letetr 
    .map((letter, index) => {
        if (index < iterations) {
            return event.target.dataset.value[index];
        }

        return letters[Math.floor(Math.random() * 22)]
    })
    .join(""); 
      

    if(iterations >= event.target.dataset.value.length) {
        clearInterval(interval);
    }
        

    iterations += 1/3;
    }, 30);
    
}