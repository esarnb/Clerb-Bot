require("dotenv").config();
require("colors");

const {Client, MessageEmbed, WebhookClient} = require("discord.js");
const client = new Client();

client.prefix = ","
client.rColor = function () { return Math.floor(Math.random()*16777215).toString(16) }

let dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
client.on("message", (msg) => {
    if (msg.author.bot || (msg.content.startsWith(client.prefix) && msg.content.charAt(msg.content.length - 1) == client.prefix)) return;

    //Setup prefix
    let prefixes = [client.prefix, `<@${client.user.id}> `, `<@!${client.user.id}> `];
    for (thisPrefix of prefixes) if (msg.content.startsWith(thisPrefix)) client.prefix = thisPrefix;
    if(msg.content.indexOf(client.prefix) !== 0) return;
    
    //Load Args, cmd
    const args = msg.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case "ping": msg.channel.send("Clerb Bot Script online c:"); break;
        case "ask": ask_cmd(msg, args); break;
        case "pick": pick_cmd(msg, args); break;
        case "help": help_cmd(msg, args); break;
        default: break;
    }

    return;
})


/**
 * 
 *      Events
 * 
 */

client.on("ready", async () => {
    console.log(`Clerb bot online!`);
});

client.on("guildMemberAdd", (member) => {
    
})

client.on("guildMemberRemove", (member) => {
    
})


/**
 * 
 *      Commands
 * 
 */

function pick_cmd(msg, args) {

    if (!args[0]) return msg.channel.send("You forgot to ask a question!")
    else if (!args.join(" ").includes(" or ")) return msg.channel.send("You need the `or` to separate two choices!")

    let choices = args.join(" ").split(" or ");
    let embed = new MessageEmbed();
    // embed.setTitle("Choices:")
    // choices.map((x,i) => { embed.addField(`Choice #${i+1}`, x) })

    let chosen = choices[Math.floor(Math.random() * choices.length)]
    embed.setTitle(`Chosen: ${chosen}`)
        .setFooter(`Chosen: ${chosen}`,  msg.author.avatarURL())
        .setFooter(msg.author.username, msg.author.avatarURL())
        .setColor(client.rColor())
    msg.channel.send({embed: embed})
}



function ask_cmd(msg, args) {

    if (!args[0]) return msg.channel.send("You forgot to ask a question!")
    
    let responses = [
        "As I see it, yes",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don’t count on it",
        "It is certain",
        "It is decidedly so",
        "Most likely",
        "No.",
        "My sources say no",
        "Outlook good",
        "Outlook not so good",
        "Reply hazy try again",
        "Signs point to yes",
        "Very doubtful",
        "Without a doubt",
        "Yes",
        "Yes, definitely",
        "You may rely on it",
    ];
    
    let chosenPrompt = responses[Math.floor(Math.random() * responses.length)]
    
    if (msg.deletable) msg.delete({timeout: 300});
    
    msg.channel.send({
        embed: new MessageEmbed()
        .addField(args.join(" "), `🎊 __${chosenPrompt}__ 🎊`)
        .setFooter(msg.author.username, msg.author.avatarURL())
        .setColor(client.rColor())
    })
}

function help_cmd(m, args) {
    let embed = new MessageEmbed();
    embed.setTitle("Commands List")
    
    // TWITCH COMMANDS
    // .addField("twitch <username>", `
    //     > See the current status of a twitch user
    //     Example: \`${client.prefix}twitch TheresaaRere\`
    // `)
    
    // .addField("streaming", `
    //     > See the current users streaming for the specific guild. Guild streamers list are shown in the bottom of the embed.
    //     Example: \`${client.prefix}streaming\`
    // `)

    // GENERAL COMMANDS
    .addField("ask", "Ask the all mighty conch a question!\nUsage: ,ask Will I be rich tomorrow?")
    .addField("pick", "Choose between choices!\nUsage: ,pick Lambo or Ferarri or Bugatti")
    
    m.channel.send({embed: embed})
}

process.on("SIGINT", async () => {
    // Do something

    //Then exit.
    process.exit()
})

client.login(process.env.TOKEN)
