//let a;
document.addEventListener('DOMContentLoaded', function() {

//if you don't want ads running in the background, start deleting here
const worker = new Worker('worker.js');
worker.postMessage('start');

    
    
worker.addEventListener("message", function (e) {
        window.getKaiAd({
            publisher: "0b7a2f6a-4113-4b9d-bce7-e3b0ba119873",
            app: "whatsapp",
            slot: "whatsapp",
            h: 80,
            w: 240,
            container: document.getElementById('ads'),
            onerror: function (err) {
                console.error("Custom catch:", err);
            },
            onready: function (ad) {
                ad.call("display", {
                    tabindex: 0,
                    navClass: "items",
                    display: "block"
                });
                ad.on("click", function () {
                    console.log("click event");
                });
            }
        });
    });

//stop deleting here
	
document.addEventListener("keydown", (function(e) {
            switch (e.key) {
                case "Enter":
                    var n = document.getElementsByClassName("items")[document.getElementsByClassName("items").length - 1];
                n.focus();
                    break;
            }
        }))

// Function to generate QR code
        function generateQRCode(text) {
            // Create a QR code element
            const qrCodeElement = document.createElement('img');
            qrCodeElement.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=240x240`; //i didn't think an offline solution would be needed
            // Append the QR code element to the body									       if you want one, look at perry's passport repo
            document.body.appendChild(qrCodeElement);									     //and implement the same logic here 
        }
	let a;
        // Function to check if the response includes "api.whatsapp.com"
        function checkResponse(timestamp) {
            const url = `https://wpp-connect.fly.dev/wpp/get/${timestamp}`;
		
            fetch(url)
                .then(response =>  response.text())
  		.then(responseText => {
                    if (responseText.includes("api.whatsapp.com")) {
                        const whatsappLink = responseText.replace('+', '%2B');
                        //window.location.href = whatsappLink; -- The app didn't work on the background if you set the redirect as the window loc
			
			if (a && !a.closed) {
    				console.log('The window is open.');
				a.close();
				setTimeout(function() {
				a = window.open(whatsappLink);
				}, 3000); //timeout can be reduced for devices that perform better (messages will be received faster)
			    //console.log("done");
			    checkResponse(timestamp);
			} else {
			    a = window.open(whatsappLink);
    			    //setTimeout(function() {
  			    //a.close();
			    //}, 20000); this didn't work properly when the interner connection was bad, 
			    //		 if your internet speed is high, you could try to uncomment this and delete line 64
			    checkResponse(timestamp);
			}
                    } else {
                        // if the response does not include "api.whatsapp.com", retry after 5 seconds (this is useless, i used it when my approach was dif)
                        setTimeout(() => checkResponse(timestamp), 5000);
                    }
                })
                .catch(error =>{
		 console.error("Error:", error);
		 checkResponse(timestamp);
		});
        }

        const currentTimestamp = Math.floor(new Date().getTime() / 1000);

        // Generate QR code and start checking for the response
        const url = `https://wpp-connect.fly.dev/whatsapp/${currentTimestamp}`;
        generateQRCode(url);
        checkResponse(currentTimestamp);
})
