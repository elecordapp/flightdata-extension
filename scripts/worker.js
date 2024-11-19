// Copyright (c) 2024 hazzuk
// SPDX-License-Identifier: Apache-2.0

// [background script]

// context menu
{
    const menuPattern = {
        flightradar: "*://www.flightradar24.com/data/*",
        simbrief: "*://dispatch.simbrief.com/options/new"
    };

    // menu structure
    {
        // remove all existing context menus
        chrome.contextMenus.removeAll();

        // flightdata
        chrome.contextMenus.create({
            id: "menu-flightdata",
            title: "flightdata",
            contexts: ["page"],
            documentUrlPatterns: [
                menuPattern.flightradar,
                menuPattern.simbrief
            ]
        });

        // submenu
        {
            // flightradar
            chrome.contextMenus.create({
                id: "menu-flightradar",
                parentId: "menu-flightdata",
                title: "Copy flight data",
                contexts: ["page"],
                documentUrlPatterns: [menuPattern.flightradar]
            });

            // simbrief
            chrome.contextMenus.create({
                id: "menu-simbrief",
                parentId: "menu-flightdata",
                title: "Insert flight data",
                contexts: ["page"],
                documentUrlPatterns: [menuPattern.simbrief]
            });
        }
    };

    // menu event listeners
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        // send message to content scripts
        if (info.menuItemId === "menu-flightradar") {
            chrome.tabs.sendMessage(tab.id, { action: "run_getFlightData" });
        } else if (info.menuItemId === "menu-simbrief") {
            chrome.tabs.sendMessage(tab.id, { action: "run_insertFlightData" });
        }
    });

};
