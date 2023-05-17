const current = {"algorithm":false};

const toggleAlgorithm = () => {
    current.algorithm = !current.algorithm;
    buildPage();
}

const clearTabClasses = () => {
    document.querySelectorAll(".tab").forEach((e) => {
        e.classList.remove("selected");
    })
}

const buildPage = () => {
    clearTabClasses();

    if (current.algorithm){
        document.getElementById("randomTab").classList.add("selected");
    } else {
        document.getElementById("euiTab").classList.add("selected");
        // Located at the bottom of ./assets/js/eui.js
        addEUI64GenPage();
    }
}

buildPage();