# ExportHumbleBundleLibrary
Exports the list of games you've purchased on humblebundle.com

Install via chrome app store https://chrome.google.com/webstore/detail/export-humblebundle-libra/pkkkphehloknahihekpiaemeaajpbflm

Steps to use:

1. Install this extension
2. Go to https://www.humblebundle.com/home/keys (need to be logged in at humblebundle.com)
3. Click on the `Export Humble Bundle as JSON` button above your list of games.

You should now have a file `Humble_Bundle_Games.json` saved through chrome as a local file on you pc. 

If not, press F12, select and copy errors there from Console and paste them in a new issue at https://github.com/jtara1/ExportHumbleBundleLibrary/issues or report issue via feedback through chrome web store.

sample output: https://pastebin.com/X7jk9buh

```json
[
{
    "name": "LiEat",
    "redemption-platform": "Steam",
    "bundle-name": "Humble Staff Picks Bundle: Scribble"
},
{
    "name": "Punch Club",
    "redemption-platform": "Steam",
    "bundle-name": "Humble Staff Picks Bundle: Scribble"
},
{
    "name": "Tempest: Pirate Action RPG",
    "redemption-platform": "Steam",
    "bundle-name": "Humble Staff Picks Bundle: Scribble"
},
{
    "name": "25% Off Guild Wars 2: Path of Fire",
    "redemption-platform": "Guild Wars 2: Path of Fire coupon",
    "bundle-name": "Yogscast Jingle Jam 2017"
}]
```