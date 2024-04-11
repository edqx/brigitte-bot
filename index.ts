import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs/promises";
import * as path from "path";
import * as djs from "discord.js";

const CONFIG_FILE = "config.json";

enum Strategy {
    Sequential = "sequential",
    Shuffle = "shuffle"
}

interface Config {
    words_list: string;
    emoji_ids: string[];
    strategy: Strategy;
}

async function getConfig() {
    const configData = await fs.readFile(path.join(process.cwd(), CONFIG_FILE), "utf8");
    return JSON.parse(configData) as Config;
}

async function getWordList(config: Config) {
    const wordsListData = await fs.readFile(path.join(process.cwd(), config.words_list), "utf8");
    return wordsListData.split("\n").map(line => line.trim()).filter(line => line.length > 0);
}

function getNextWordIdx(config: Config, numWords: number, previousWordIdx: number) {
    switch (config.strategy) {
    case Strategy.Sequential:
        return (previousWordIdx + 1) % numWords;
    case Strategy.Shuffle:
        return Math.floor(Math.random() * numWords);
    }
}

function trimNonAlphanumeric(a: string) {
    return a.replace(/^[^a-zA-Z0-9]/, "").replace(/[^a-zA-Z0-9]$/, "");
}

async function main() {
    const config = await getConfig();
    const words = await getWordList(config);
    const client = new djs.Client({ intents: [ "Guilds", "MessageContent", "GuildMessages" ] });

    let wordIdx = getNextWordIdx(config, words.length, -1);
    let emojiIdx = 0;

    client.on("ready", () => {
        console.log("Bot is ready!");
    });

    client.on("messageCreate", async message => {
        if (message.content.toLowerCase().split(" ").map(trimNonAlphanumeric).includes(words[wordIdx])) {
            await message.react(config.emoji_ids[emojiIdx]);
            console.log("User found word %s, moving on..", words[wordIdx]);
            emojiIdx = (emojiIdx + 1) % config.emoji_ids.length;
            wordIdx = getNextWordIdx(config, words.length, wordIdx);
        }
    });

    await client.login(process.env.TOKEN as string);
}

main();