let Parser = require('rss-parser');
let parser = new Parser();
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/905606601514287136/_mrIJfGJnv-vxwARCCz7g9wT47SaQpibvTHabHXPsAyhCMmp-jDLcIlHaDbVCbg3V70V");

const IMAGE_URL = 'https://opentrackers.org/wp-content/uploads/2013/07/thetradersden_banner_9-21-2013.png';
hook.setUsername('TTD Bot');
hook.setAvatar(IMAGE_URL);

(async () => {

    let feed = await parser.parseURL('http://www.thetradersden.org/forums/external.php?type=rss2&forumids=12,13');
    console.log("TITLE: " + feed.title);
    console.log("BUILD DATE: " + feed.lastBuildDate);

    for (let item of feed.items) {

        console.log(item.title);

        let date = item.title.match(/(\d{4}|xxxx)\-((0[1-9]|1[012])|xx)\-((0[1-9]|[12][0-9]|3[01])|xx)/)[0];
        let title = item.title.split(date);

        try {
            await hook.send(`**${title[0]}** - ${date} - ${title[1]}\n${item.link}`);
            console.log('Successfully sent webhook');
        }
        catch (e){
            console.log(e.message);
        };

        await new Promise(r => setTimeout(r, 1000));

    }

})();