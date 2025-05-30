var rev = "fwd";
        function titlebar(pos){
            var msg = "❌nuh uh❌";
            var speed = 100;
            var len = msg.length;

            // Failsafe: never allow empty title
            if (!document.title || document.title.trim() === "") {
                document.title = " ";
            }

            if (rev === "fwd") {
                if (pos < len) {
                    document.title = msg.substring(0, pos + 1);
                    setTimeout(function() {
                        titlebar(pos + 1);
                    }, speed);
                } else {
                    rev = "bwd";
                    // Skip duplicate frame by immediately starting reverse
                    setTimeout(function() {
                        titlebar(pos - 1);
                    }, speed);
                }
            } else {
                if (pos > 0) {
                    document.title = msg.substring(len - pos);
                    setTimeout(function() {
                        titlebar(pos - 1);
                    }, speed);
                } else {
                    rev = "fwd";
                    // Skip duplicate frame by immediately starting forward
                    setTimeout(function() {
                        titlebar(pos + 1);
                    }, speed);
                }
            }
        }
        titlebar(0);
