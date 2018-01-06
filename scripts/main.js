/**
 * Get the list of games currently shown from
 * https://www.humblebundle.com/home/keys
 * e.g. of return value:
 *   [
 *       {
 *           "name": "Chainsaw Warrior",
 *           "redemption-platform": "Steam",
 *           "bundle-name": "Yogscast Jingle Jam 2017"
 *       },
 *       {
 *           "name": "Chime Sharp",
 *           "redemption-platform": "Steam",
 *           "bundle-name": "Yogscast Jingle Jam 2017"
 *       }
 *   ]
 * @returns {Promise<Array>}
 */
async function getGamesList() {
    // console.log("calling getGamesList"); // debug
    let gamesDiv = document.getElementsByClassName("unredeemed-keys-table")[0];
    let gamesTr = gamesDiv.getElementsByTagName("tr");
    let gamesList = [];

    // the first one is the header of the table (not a game listing)
    for (let i = 1; i < gamesTr.length; ++i) {
        let platform = gamesTr[i].getElementsByClassName("hb-key")[0]
            .getAttribute("title");
        let name = gamesTr[i].getElementsByTagName("h4")[0]
            .getAttribute("title");
        let bundle_name = gamesTr[i].getElementsByTagName("p")[0]
            .getAttribute("title");

        let map = {
            'name': name,
            'redemption-platform': platform,
            'bundle-name': bundle_name
        };
        gamesList.push(map);
    }

    // console.log('gamesList from getGamesList', gamesList); // debug
    return gamesList;
}

/**
 * Clicks on "Hide Redeemed Keys" button at
 * https://www.humblebundle.com/home/keys
 */
function toggleHideRedeemedGames() {
    document.getElementById("hide-redeemed").click();
}

/**
 * Gets all of the next page buttons at webpage
 * https://www.humblebundle.com/home/keys
 * returns true if there exists a next page button, false otherwise
 * Optionally clicks on next page button depending on parameter
 * clickNextPageButton
 * @param clickNextPageButton
 * @returns {boolean}
 */
function hasNextPage(clickNextPageButton=true) {
    let buttons = document
        .getElementsByClassName("js-jump-to-page jump-to-page");

    // same page select buttons at top of webpage as the ones at the bottom
    for (let i = 0; i < buttons.length / 2; ++i) {
        let buttonClassValue = buttons[i].getAttribute("class");
        if (buttonClassValue.includes("current")) {
            // there is no next button
            if (i === buttons.length / 2 - 1) {
                return false;
            }
            if (clickNextPageButton) {
                // console.log('clicking next button', buttons[i + 1]);
                buttons[i + 1].click();
            }
            return true;
        }
    }
    throw new DOMException("Could not find any page navigation buttons at " +
        "humblebundle.com/home/keys");
}

/**
 * Entry point for script. Create a new Promise with this function as the first
 * argument
 * @param resolve passed from creating new Promise
 * @returns {Promise<void>}
 */
async function main(resolve) {
    await toggleHideRedeemedGames();

    let gamesList = [];
    do {
        let list = getGamesList();
        gamesList = gamesList.concat(list);
    } while (hasNextPage(true));

    // console.log(gamesList); // debug
    // when each Promise in gamesList is resolved, then save as local JSON file
    Promise.all(gamesList).then((values) => {
        // merge lists
        values = values.reduce((a, b) => {
            return a.concat(b);
        });

        // console.log(values); // debug
        saveTextAs(
            JSON.stringify(values),
            'Humble_Bundle_Games.json'
        );
    });
    resolve('done');
}

const logError = (reason) =>
    { console.log("[ExportHumbleBundle] Error:\n", reason); };


window.onload = () => {
    // start the program
    console.log("[ExportHumbleBundle] begin script");
    let p = new Promise(main);
    p.catch(logError);
};
