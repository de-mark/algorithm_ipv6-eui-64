const generateRandomID = () => {
    let newRandomID = [];

    for (let i = 0; i < 6; i++) {
        // Uses getRandomNumber from "./assets/js/eui.js"
        let randomNum1 = getRandomNumber(16); 
        let randomNum2 = getRandomNumber(16);
        
        newRandomID.push(`${Object.keys(hexToBinaryDict)[randomNum1]}${Object.keys(hexToBinaryDict)[randomNum2]}`); 
    }

    return newRandomID.join(":");
}

const addNewRandomID = () => {
    document.getElementById("generatedID").innerHTML = generateRandomID();
}

const addRandomPage = () => {
    document.getElementById("mainArea").innerHTML = `
    <p>Most devices these days (namely modern Windows, Macs, and several Linux distros) will randomly generate an interface ID <b>without</b> using your MAC address</p>

    <p>This works around the potential security risks inherent in EUI-643.</p>
                
    <div id="generatedID">
        Enter a MAC to see an Interface ID
    </div>
    <div id="errorDiv">
    </div>

    <div class="inputGroup">
        <p><b>No input required:</b></p>
        <input type="text" id="macAddress" placeholder="MAC is not used to create Interface ID" disabled>
        <button disabled>Use Random MAC</button>
    </div>
    
    <button onclick="addNewRandomID()">Generate!</button>
    `
}