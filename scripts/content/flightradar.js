// Copyright (c) 2024 hazzuk
// SPDX-License-Identifier: Apache-2.0

// [flightradar content script]

function main() {

    // simbrief data
    let flightData = {
        airline: "AAA",
        number: "1234",
        origin: "BBB",
        dest: "CCC",
        reg: "DDD00",
    };

    function getFlightData() {

        // flightradar elements
        const flightRadar = {
            header: document.getElementById('txt-playback-header'),
            origin: document.getElementById('txt-airport-origin'),
            dest: document.getElementById('txt-airport-dest'),
        };

        // flight number
        {
            // extract only the main text (ignoring child elements and whitespace)
            let mainText = flightRadar.header.firstChild.nodeValue.trim();

            // extract the flight number (removing the prefix and any non-digits)
            flightData.number = mainText.replace('Playback of flight ', '').replace(/[^\d]/g, '');
            console.log(`number: ${flightData.number}`);
        }

        // flight registration
        {
            let smallText = flightRadar.header.querySelector('small').textContent
            flightData.reg = smallText.replace('/ ', '');
            console.log(`reg: ${flightData.reg}`);

            // flight airline
            {
                // extracts characters from index 0 up to index 3
                flightData.airline = flightData.reg.substring(0, 3);
                console.log(`airline: ${flightData.airline}`);
            }
        }

        // flight origin
        {
            let originText = flightRadar.origin.querySelector('small').textContent;
            // remove parentheses
            flightData.origin = originText.replace(/[()]/g, '');
            console.log(`origin: ${flightData.origin}`);
        }

        // flight destination
        {
            let destText = flightRadar.dest.querySelector('small').textContent;
            // remove parentheses
            flightData.dest = destText.replace(/[()]/g, '');
            console.log(`dest: ${flightData.dest}`);
        }

        // save data to storage
        chrome.storage.local.set({ flightData }, () => {
            console.log("data saved");
        });

    };

    // listen for messages from service worker
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "run_getFlightData") {
            getFlightData();
        }
    });

};

{
    console.log('start content script');
    main();
}
