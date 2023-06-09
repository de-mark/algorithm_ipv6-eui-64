const wellKnownManufacturerOUIs = [
    // CISCO
    ["CC","46","D6"],
    // Google
    ["3C","5A","B4"],
    // HP
    ["3C","D9","2B"],
    // Huawei
    ["00","9A","CD"],
    // Lenovo
    ["A4","11","94"],
    // NVIDIA
    ["48","B0","2D"]
]

// Used to randomly create MAC and, during the EUI algorithm, to translate into binary and back
const hexToBinaryDict = {
    "0":"0000",
    "1":"0001",
    "2":"0010",
    "3":"0011",
    "4":"0100",
    "5":"0101",
    "6":"0110",
    "7":"0111",
    "8":"1000",
    "9":"1001",
    "A":"1010",
    "B":"1011",
    "C":"1100",
    "D":"1101",
    "E":"1110",
    "F":"1111"
}

const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
}

// The first 3 bytes of a MAC address represent the manufacturer
// The last 3 bytes of a MAC address are a unique ID the manufacturer creates
// We'll randomly hook onto one of the wellknown manufactuer OUIs from above
// and add a randomly generated last 3 bytes.
const generateMACID = () => {
    // Randomly selecting the first 3 bytes from a known manufacturer
    let manufactuerIndex = getRandomNumber(wellKnownManufacturerOUIs.length - 1);
    let newMacID = []; 
    newMacID.push(...wellKnownManufacturerOUIs[manufactuerIndex]);

    // Randomly selecting hexidecimals for the remaining three bytes
    for (let i = 0; i < 3; i++){
        let randomNum1 = getRandomNumber(16); 
        let randomNum2 = getRandomNumber(16);
        
        newMacID.push(`${Object.keys(hexToBinaryDict)[randomNum1]}${Object.keys(hexToBinaryDict)[randomNum2]}`);
    }

    // Returning the new fake MAC address separated by -
    return newMacID.join("-");
}

// This is what actually adds the generated MAC address to the page
const addNewMACID = () => {
    document.getElementById("macAddress").value = generateMACID();
}

const generateEUI64 = (cleanedMacAddress) => {
    // EUI-64 STEP 1: Split the 48-bit MAC address down the middle
    let OUI = cleanedMacAddress.slice(0, 3);
    let deviceID = cleanedMacAddress.slice(3, 6);

    // EUI-64 STEP 2: The host puts "fffe", a special reserved value between these two addresses
    let newMacAddress = [...OUI, "FF", "FE", ...deviceID];

    // EUI-64 STEP 3: The seventh bit from the left is known as the Universally / Locally (U/L) assigned bit. (Called the "u bit".)
    // A 0 means this was assigned by the IEEE; a 1 means it's locally administered
    // In step 3, we have to inverse the seventh bit from the left
    let firstEightDigits = newMacAddress[0];
    let newBin = [...hexToBinaryDict[firstEightDigits[0]],
    ...hexToBinaryDict[firstEightDigits[1]]]

    newBin[6] = newBin[6] == "0" ? "1" : "0";
    
    // EUI-64 STEP 4: Translate the first eight bits back into hexidecimal
    let firstBin = newBin.slice(0, 4).join("");
    let secondBin = newBin.slice(4, 8).join("");

    let firstHex = Object.entries(hexToBinaryDict).filter(([hex, bin]) => bin == firstBin)[0][0];
    let secondHex = Object.entries(hexToBinaryDict).filter(([hex, bin]) => bin == secondBin)[0][0];

    let newFirstEightDigits = `${firstHex}${secondHex}`;

    newMacAddress[0] = newFirstEightDigits;

    return newMacAddress.join(":");
}

const addNewEUI64 = () => {
    let rawMacAddress = document.getElementById("macAddress").value;
    // Since MAC address bytes can be separated by other symbols as well, we're taking the extra step to replace all symbols with hyphen
    rawMacAddress = rawMacAddress.replace(/[.,\/#!$%+\^&\*;:{}=\-_`~()]/g,"-").toUpperCase();
    let cleanedMacAddress = rawMacAddress.split("-");

    if (cleanedMacAddress.length == 6){
        document.getElementById("errorDiv").innerHTML = "";
        document.getElementById("errorDiv").classList.remove("hasError");
        document.getElementById("generatedID").innerHTML = generateEUI64(cleanedMacAddress);
    } else {
        document.getElementById("errorDiv").innerHTML = `<b>Error:</b> A MAC Address must have 6 Octets; Yours has ${cleanedMacAddress.length}`;
        document.getElementById("errorDiv").classList.add("hasError");
    }  
}

const addEUI64GenPage = () => {
    document.getElementById("mainArea").innerHTML = `
    <p><b>EUI-64</b> is the older way of dynamically generating an Interface ID.</p>
    <p>The algorithm used the device's MAC address to generate the Interface ID:</b>
    
    <div class="euiSteps">
        <p><b>1.</b> The MAC address was split into the Manufacturer's OID and the device ID</p>
        <p><b>2.</b> <i>fffe</i> (a special reserved value) was inserted between the OID and device ID</p>
        <p>The u bit (7th bit from the left) was inverted</p>
    </div>

    <p>Due to potential security risks, EUI-64 is not used for Interface ID creation by newer devices (with the exception of routers)</p>
                
    <div id="generatedID">
        Enter a MAC to see an Interface ID
    </div>
    <div id="errorDiv">
    </div>


    <div class="inputGroup">
        <p><b>MAC Address of Device:</b></p>
        <input type="text" id="macAddress">
        <button onclick="addNewMACID()">Use Random MAC</button>
    </div>
    
    <button onclick="addNewEUI64()">Generate!</button>
    `
}