# brigitte-bot

Brigitte bot is a bot that reacts with an emoji to messages that contain a word in a given word list. The word can be shuffled each time or sequentially selected as the previous one is used.

Setup:
```env
# .env
TOKEN="<your bot token>"
```

```json
config.json
{
    "words_list": "./words.txt",
    "emoji_ids": [":phoebe_giddy:1017890901097451630"],
    "strategy": "shuffle"
}
```