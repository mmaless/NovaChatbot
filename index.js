const { dockStart } = require('@nlpjs/basic');
var readline = require("readline");

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  await nlp.train();

  var rl = readline.createInterface(process.stdin, process.stdout);

  console.log("Chatbot started!");
  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const response = await nlp.process(line);
    console.log(response);
    console.log(response.answer);
    rl.prompt();
  }).on("close", function () {
    process.exit(0);
  });
})();