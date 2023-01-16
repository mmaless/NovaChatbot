const { dockStart } = require('@nlpjs/basic');
var readline = require("readline");

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  await nlp.train();
  console.log("Chatbot started! you can chat with the bot using this link http://localhost:3000/");
})();