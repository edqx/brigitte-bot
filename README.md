# Brigitte Bot

Brigitte Bot is a bot that reacts with an emoji to messages that contain a word in a given word list. The word can be shuffled each time or sequentially selected as the previous one is used.

Setup:

`.env`:
```env
TOKEN="<your bot token>"
```

`config.json`:
```json
{
    "words_list": "<path to file containing words, relative to cwd>",
    "emoji_ids": ["<emoji to react with>"],
    "strategy": "shuffle" // or, "sequential"
}
```