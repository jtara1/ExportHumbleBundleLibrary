async function run() {
    // if (document === undefined || document === null) {
    //     console.log('make http request');
    //     let xhr = XMLHttpRequest("https://www.humblebundle.com/home/keys");
    //     let document = xhr.document;
    // }
    await sleep(100); // wait for page to load
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
    console.log(gamesList);
    return gamesList;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleHideRedeemedGames() {
    let button = document.getElementById("hide-redeemed");
    // console.log(button.valueOf());
    button.click();
}

function hasNextPage(clickNextPageButton=true) {
    let buttons = document
        .getElementsByClassName("js-jump-to-page jump-to-page");
    // same page select buttons at top of webpage as the ones at the bottom
    // buttons = buttons.slice(0, buttons.length / 2);

    for (let i = 0; i < buttons.length / 2; ++i) {
        let buttonClassValue = buttons[i].getAttribute("class");
        if (buttonClassValue.includes("current")) {
            // there is no next button
            if (i === buttons.length / 2 - 1) {
                return false;
            }
            if (clickNextPageButton) {
                buttons[i + 1].click();
            }
            return true;
        }
    }
    throw new DOMException("Could not find next page buttons at " +
        "humblebundle.com/home/keys");
}

async function main(resolve, reject) {
    await sleep(1500); // wait for page to load
    console.log("[ExportHumbleBundle] begin script");
    await toggleHideRedeemedGames();

    let gamesList = [];
    setTimeout(
        () => {
            while (hasNextPage(true)) {
                let p = run();
                p.catch(logError);
                p.then((games) => {
                    gamesList.concat(games);
                });
            }
        },
        10000
    );
    // save as a local file
    saveAs(
        new Blob([JSON.stringify(gamesList)]),
        'Humble_Bundle_Games.json'
    );
    return resolve;
}

const logError = (reason) =>
    { console.log("[ExportHumbleBundle] Error:\n", reason); };

// start the program
let p = new Promise(main);
p.catch(logError);