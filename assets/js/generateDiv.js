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

const possibleHexidecimal = ["A","B","C","D","E","F","0","1","2","3","4","5","6","7","8","9"];

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
        let randomNum1 = getRandomNumber(possibleHexidecimal.length - 1); 
        let randomNum2 = getRandomNumber(possibleHexidecimal.length - 1);
        
        newMacID.push(`${possibleHexidecimal[randomNum1]}${possibleHexidecimal[randomNum2]}`);
    }

    // Returning the new fake MAC address separated by :
    return newMacID.join(":");
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

    return newMacAddress.join(":");
}

const addNewEUI64 = () => {
    let rawMacAddress = document.getElementById("macAddress").value;
    // Since MAC address bytes can be separated by other symbols as well, we're taking the extra step to replace all symbols with colons
    rawMacAddress = rawMacAddress.replace(/[.,\/#!$%+\^&\*;:{}=\-_`~()]/g,":");
    let cleanedMacAddress = rawMacAddress.split(":");

    if (cleanedMacAddress.length == 6){
        document.getElementById("errorDiv").innerHTML = "";
        document.getElementById("generatedID").innerHTML = generateEUI64(cleanedMacAddress);
    } else {
        document.getElementById("errorDiv").innerHTML = `<b>Error:</b> A MAC Address must have 6 Octets; Yours has ${cleanedMacAddress.length}`;
    }  
}