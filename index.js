const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart({ use: ['Basic'] });
  const nlp = dock.get('nlp');
  await nlp.train();

  var readline = require("readline");
  var rl = readline.createInterface(process.stdin, process.stdout);

  console.log("Chatbot started!");
  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const response = await nlp.process(line);
    console.log(response.answer);
    rl.prompt();
  }).on("close", function () {
    process.exit(0);
  });
})();