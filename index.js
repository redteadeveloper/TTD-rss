let Parser = require('rss-parser');
let parser = new Parser();
const { convert } = require('html-to-text');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/905606601514287136/_mrIJfGJnv-vxwARCCz7g9wT47SaQpibvTHabHXPsAyhCMmp-jDLcIlHaDbVCbg3V70V");

const IMAGE_URL = 'https://opentrackers.org/wp-content/uploads/2013/07/thetradersden_banner_9-21-2013.png';
hook.setUsername('TTD Bot');
hook.setAvatar(IMAGE_URL);

let recentItems = []
let currentItems = []
let recentBuildDate = ""

async function getRecentItems() {

    let feed = await parser.parseURL('http://www.thetradersden.org/forums/external.php?type=rss2&forumids=12,13');
    currentItems = []

    if (feed.lastBuildDate === recentBuildDate) {
        console.log("CONTINUING: Same build date")
        return
    }

    console.log("BUILD DATE: " + feed.lastBuildDate);
    console.log("START LOOP")

    for (let item of feed.items.reverse()) {

        console.log(item.title);
        currentItems.push(item.title)

        if (recentItems.includes(item.title)) {
            console.log("CONTINUING: Same item")
            continue
        }

        let date = item.title.match(/(\d{4}|xxxx)\-((0[1-9]|1[012])|xx)\-((0[1-9]|[12][0-9]|3[01])|xx)/);
        let title = date ? item.title.split(date[0]) : [ item.title ]

        // `**${title[0]}**${date ? `/ ${date[0]}` : ""} ${title[1] ? `/${title[1]}` : ""}\n> ${item.link}`

        try {
            const embed = new MessageBuilder()
                .setTitle(`**${title[0]}**${date ? `/ ${date[0]}` : ""} ${title[1] ? `/${title[1]}` : ""}`)
                .setURL(item.link)
                .setDescription(convert(item.content.replace(/<fieldset class="fieldset">(.*?)<\/fieldset>/, ''), { wordwrap: 130 }))
                .setColor('#77dd77')
                .setFooter(`Published at ${item.pubDate}`, "https://i.ibb.co/pW53h3g/Picture1.png")
            await hook.send(embed);
            console.log('=> Successfully sent webhook');
        } catch (e) {
            console.log(e.message);
        };

        await new Promise(r => setTimeout(r, 1000));

    }

    recentItems = currentItems
    recentBuildDate = feed.lastBuildDate

    console.log(recentItems)

}

getRecentItems()
timerId = setInterval(getRecentItems, 900000);