// import * as fs from "FileSaver";
// import "FileSaver";
// import * as jquery from "jquery-3.2.1.min";
// let script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = '//code.jquery.com/jquery-3.2.1.min.js';
// document.getElementsByTagName('head')[0].appendChild(script);

async function run(resolve, reject) {
    console.log('begin wait');
    await sleep(1000); // wait for page to load
    console.log('begin script');

    if (document === undefined || document === null) {
        console.log('make http request');
        let xhr = XMLHttpRequest("https://www.humblebundle.com/home/keys");
        let document = xhr.document;
        return reject;
    }

    let games_div = document.getElementsByClassName("unredeemed-keys-table")[0];
    let games_tr = games_div.getElementsByTagName("tr");
    let games_list = [];

    for (let i = 1; i < games_tr.length; ++i) {
        let platform = games_tr[i].getElementsByClassName("hb-key")[0].getAttribute("title");
        console.log(platform);
        let name = games_tr[i].getElementsByTagName("h4")[0].getAttribute("title");
        let bundle_name = games_tr[i].getElementsByTagName("p")[0].getAttribute("title");

        let map = new Map([
            ['redemption-platform', platform],
            ['name', name],
            ['bundle-name', bundle_name]]
        );
        games_list.push(map);
    }
    saveAs(JSON.stringify(games_list), 'some_file.json');
    // $("#btn-save").click( function() {
    //     var text = $("#textarea").val();
    //     var filename = $("#input-fileName").val();
    //     var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    //     saveAs(blob, filename+".txt");
    // });
    return resolve;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addListenerDOMContentLoaded(callback) {
    window.addEventListener("DOMContentLoaded", callback, false);
}

console.log('jtara1 script loaded');
let p = new Promise((res, rej) => {
    window.addEventListener("DOMContentLoaded", () => run(res, rej), false);
});

p.catch((reason) => {console.log(reason);});
// run(null);
// window.onhashchange = run;