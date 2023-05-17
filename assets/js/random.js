const addRandomPage = () => {
    document.getElementById("mainArea").innerHTML = `
    <h4>Random Interface ID Generation!</h4>
                
    <div id="generatedID">
        <!-- NEW Interface ID will be added here -->
    </div>
    <div id="errorDiv">
        <!-- Error Messages will be added here -->
    </div>


    <div class="inputGroup">
        <p><b>Does Not Use MAC:</b></p>
        <input type="text" id="macAddress" placeholder="MAC is not used to create Interface ID" disabled>
        <button disabled>Generate a Random Mac Address For Me!</button>
    </div>
    
    <button>Generate!</button>
    `
}