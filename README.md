# NovaChatbot

To use the ChatBot you have to first create multiple intent files that will contain the possible questions and answers.

## Intent Files Format

```
{
  "name": "Corpus",
  "locale": "en-US",
  "data": [
    {
      "intent": "agent.acquaintance",
      "utterances": [
        "say about you",
        "why are you here",
        "what is your personality",
        "describe yourself",
        "tell me about yourself",
        "tell me about you",
        "what are you",
        "who are you",
        "I want to know more about you",
        "talk about yourself"
      ],
      "answers": [
        "I'm a virtual agent",
        "Think of me as a virtual agent",
        "Well, I'm not a person, I'm a virtual agent",
        "I'm a virtual being, not a real person",
        "I'm a conversational app"
      ]
    },
  ]
}
```

## 1- Install Modules

`npm i`

## 2- Run the ChatBot

`npm start`
