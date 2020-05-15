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
        const italicsTag = gamesTr[i].querySelector('.hb-key');
        const divTag = gamesTr[i].querySelector('div.js-keyfield');

        if (!divTag || !italicsTag) continue;
        const isKeyRevealed = divTag.classList.value.includes('redeemed');

        let platform = italicsTag.title;
        let name = gamesTr[i].getElementsByTagName("h4")[0]
            .getAttribute("title");
        let bundleName = gamesTr[i].getElementsByTagName("p")[0]
            .getAttribute("title");

        let map = {
            name,
            'redemption-platform': platform,
            'bundle-name': bundleName,
            isKeyRevealed,
        };
        gamesList.push(map);
    }

    // console.log('gamesList from getGamesList', gamesList); // debug
    return gamesList;
}

/**
 * Sets the state of the checkbox to be that of parameter enabled
 * on "Hide Redeemed Keys" button at
 * https://www.humblebundle.com/home/keys
 * @param enabled desired state of the "Hide Redeemed Keys" button
 */
function setHideRedeemedGames(enabled) {
    let checkbox = document.getElementById("hide-redeemed");
    if (checkbox.checked !== enabled) {
        checkbox.click();
    }
}

/**
 * Goes to the first page at home/keys URL path
 */
function goToFirstPage() {
    let button = document.querySelector(
        "div.js-jump-to-page.jump-to-page[data-index='0']");
    if (button !== undefined && button !== null) {
        button.click();
    }
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
    // console.log(buttons); // debug

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
 * Get the metadata of the games from the home/keys URL path and save as JSON
 * argument
 * @param resolve passed from creating new Promise
 * @returns {Promise<void>}
 */
async function parseAndSaveGames(resolve=null) {
    await setHideRedeemedGames(true);

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
    if (typeof(resolve) === 'function') {
        resolve('done');
    }
}

/**
 * Add an input tag of type "button" to the webpage under the div.sort element
 * @returns {HTMLInputElement} the button created
 */
function addActivationButton() {
    let button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "Export Humble Bundle as JSON");
    button.setAttribute("id", "export-humble-bundle-jtara1");

    let div = document.getElementsByClassName("sort")[0];
    div.appendChild(button);
    return button;
}

const logError = (reason) =>
    { console.log("[ExportHumbleBundle] Error:\n", reason); };

// add button that'll activate script once webpage loads
window.onload = () => {
    let button = addActivationButton();
    // activation button is clicked
    button.addEventListener("click", () => {
        goToFirstPage();
        parseAndSaveGames().catch(logError);
    });
};
