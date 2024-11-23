// Copyright (c) 2024 hazzuk
// SPDX-License-Identifier: Apache-2.0

// [simbrief content script]

function main() {

    function insertFlightData() {

        // simbrief elements
        const simbrief = {
            airline: document.getElementById('airline'),
            number: document.getElementById('fltnum'),
            origin: document.getElementById('orig'),
            dest: document.getElementById('dest'),
            reg: document.getElementById('reg'),
        };

        const inputFillColor = '#ffdc5759';

        // retrieve storage data
        chrome.storage.local.get("flightData", (result) => {

            // log
            if (!result.flightData) {
                console.warn("no flight data found in storage");
            } else {
                console.log("retrieved flight data:", result.flightData);

                // insert
                {
                    // enter input values
                    simbrief.airline.value = result.flightData.airline;
                    simbrief.airline.style.backgroundColor = inputFillColor;

                    simbrief.number.value = result.flightData.number;
                    simbrief.number.style.backgroundColor = inputFillColor;

                    simbrief.origin.value = result.flightData.origin;
                    simbrief.origin.style.backgroundColor = inputFillColor;

                    simbrief.dest.value = result.flightData.dest;
                    simbrief.dest.style.backgroundColor = inputFillColor;

                    simbrief.reg.value = result.flightData.reg;
                    simbrief.reg.style.backgroundColor = inputFillColor;

                    // simbrief auto convert to ICAO
                    {
                        // origin
                        simbrief.origin.focus();
                        simbrief.origin.blur();

                        // dest
                        simbrief.dest.focus();
                        simbrief.dest.blur();
                    }
                }

            }

        });
    };

    // listen for messages from service worker
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "run_insertFlightData") {
            insertFlightData();
        }
    });

};

{
    console.log('start content script');
    main();
}
