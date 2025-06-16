for (let i = 0; i < window.frames.length; i++) {
    try {
        // Store the original alert function
        let originalAlert = window.frames[i].alert;

        // Override alert function in the frame
        window.frames[i].alert = function(msg) { 
            console.log("Alert detected in frame:", msg);

            // Dispatch event before executing alert
            document.dispatchEvent(new CustomEvent("frameAlertTriggered", { 
                detail: { frameIndex: i, message: msg, status: "started" } 
            }));

            // Execute the original alert function
            originalAlert(msg);

            // Dispatch another event after execution
            document.dispatchEvent(new CustomEvent("frameAlertTriggered", { 
                detail: { frameIndex: i, message: msg, status: "done" } 
            }));
        };
    } catch (e) {
        console.warn("Can't access frame:", e);
    }
}

// Listener in the main document to detect alerts in frames
document.addEventListener("frameAlertTriggered", function(event) {
    console.log(`Alert in iframe index ${event.detail.frameIndex} - Status: ${event.detail.status}`);
    console.log(`Message: ${event.detail.message}`);
});
