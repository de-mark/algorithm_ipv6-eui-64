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
        document.getElementById("euiTab").classList.add("selected");
    } else {
        document.getElementById("randomTab").classList.add("selected");
    }
}

buildPage();