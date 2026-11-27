// Copyright (c) 2024 hazzuk
// SPDX-License-Identifier: Apache-2.0

// [flightradar content script]

function main() {

    // simbrief data
    let flightData = {
        airline: "",        // "UAL" optional
        number: "",         // "1581" optional
        origin: "",         // "LAX"
        dest: "",           // "EWR"
        callsign: "",       // "UAL1581"
    };

    function getFlightData() {

        // flight number
        {
            // find flight number link, e.g. "/data/flights/ua1581"
            const flightLink = document.querySelector('a[href*="/data/flights/"]');

            if (flightLink === null) {
                console.warn('no flight link found');
            } else {
                const flightNumberSlug = flightLink.getAttribute('href').split('/').pop();

                // extract the flight number (removing the prefix and any non-digits)
                flightData.number = flightNumberSlug.replace(/[^\d]/g, '');
            }

            console.log(`number: ${flightData.number}`);
        }

        // flight callsign
        {
            // find related call sign element
            const relatedCallsignEl = document.getElementById('flight-related-title-callsign');

            if (relatedCallsignEl === null || relatedCallsignEl.firstChild === null) {
                console.warn('no related call sign element found');
            } else {
                flightData.callsign = relatedCallsignEl.firstChild.textContent.trim(); // "UAL1581"
            }

            console.log(`callsign: ${flightData.callsign}`);
        }

        // flight airline
        {
            // find airline link, e.g. "/data/airlines/ua-ual" or "/data/airlines/axq"
            const airlineLink = document.querySelector('a[href*="/data/airlines/"]');

            if (airlineLink === null) {
                console.warn('no airline link found');
            } else {
                const airlineSlug = airlineLink.getAttribute('href').split('/').pop();

                // icao code always last three characters (sometimes iata code prefixes it)
                flightData.airline = airlineSlug.slice(-3).toUpperCase(); // "UAL"
            }

            console.log(`airline: ${flightData.airline}`);
        }

        // flight origin and destination
        {
            // find airport links
            const airportLinks = document.querySelectorAll('a[href*="/data/airports/"]');

            if (airportLinks.length === 0) {
                console.warn('no airport links found');
            } else {
                // extract airport codes, e.g. "/data/airports/lax" -> "LAX"
                const airportCodes = Array.from(airportLinks, (link) => {
                    const href = link.getAttribute('href');         // "https://.../data/airports/lax"
                    return href.split('/').pop().toUpperCase();     // "LAX"
                });

                [flightData.origin, flightData.dest] = airportCodes; // "LAX", "EWR"
            }

            console.log(`origin: ${flightData.origin}`);
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
