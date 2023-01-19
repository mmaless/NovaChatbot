const { dockStart } = require('@nlpjs/basic');
const fs = require('fs');
const formidable = require('formidable');
const { Connector } = require('@nlpjs/connector');
const DirectlineController = require('./directline-controller');
const log = require("./log")

class DirectlineConnector extends Connector {
  constructor(settings, container) {
    super(settings, container);
    if (this.settings.autoRemoveFiles === undefined) {
      this.settings.autoRemoveFiles = true;
    }
    if (this.settings.uploadDir === undefined) {
      this.settings.uploadDir = './uploads/';
    }
    if (this.settings.maxFileSize === undefined) {
      this.settings.maxFileSize = 8000000;
    }
  }



  registerDefault() {
    this.container.registerConfiguration(
      'directline',
      { log: true, channelId: 'emulator' },
      false
    );
  }

  logger(level, message) {
    if (this.settings.log) {
      log('Connector', 'debug', message);
    }
  }

  start() {
    const server = this.container.get('api-server').app;
    if (!server) {
      throw new Error('No api-server found');
    }
    this.controller = new DirectlineController(this.settings, this);
    if (this.onCreateConversation) {
      this.controller.onCreateConversation = this.onCreateConversation;
    }
    if (this.onHear) {
      this.controller.onHear = this.onHear;
    }

    server.options('/directline', (req, res) => {
      this.logger('debug', `OPTIONS /directline`);
      res.status(200).end();
    });

    server.post(`/directline/conversations`, async (req, res) => {
      this.logger('info', `POST /directline/conversations`);
      const result = await this.controller.createConversation();
      res.status(result.status).send(result.body);
    });

    server.get(
      `/directline/conversations/:conversationId/activities`,
      async (req, res) => {
        const watermark =
          req.query.watermark && req.query.watermark !== 'null'
            ? Number(req.query.watermark)
            : 0;
        const result = await this.controller.getActivities(
          req.params.conversationId,
          watermark
        );
        res.status(result.status).send(result.body);
      }
    );

    server.post(
      `/directline/conversations/:conversationId/activities`,
      async (req, res) => {
        const result = await this.controller.addActivity(
          req.params.conversationId,
          req.body
        );
        res.status(result.status).send(result.body);
      }
    );

    server.post('/directline/tokens/refresh', (req, res) => {
      this.logger('trace', `POST /directline/tokens/refresh`);
      res.status(200).end();
    });

    server.post(
      `/directline/conversations/:conversationId/upload`,
      async (req, res) => {
        this.logger(
          'debug',
          `POST /directline/conversations/:conversationId/upload`
        );
        const activity = {
          conversation: {
            id: req.params.conversationId
          }
        }
        this.say(activity, 'Uploading files is not supported yet!');
        // Remove ability to upload files

        // this.logger(
        //   'debug',
        //   `POST /directline/conversations/:conversationId/upload`
        // );
        // const form = formidable({
        //   multiples: true,
        //   uploadDir: this.settings.uploadDir,
        //   keepExtensions: false,
        //   maxFileSize: this.settings.maxFileSize,
        // });
        // form.parse(req, async (err, fields, files) => {
        //   if (err) {
        //     res.status(500).send('There was an error processing the message');
        //   } else {
        //     const activity = JSON.parse(
        //       fs.readFileSync(files.activity.path, 'utf-8')
        //     );
        //     activity.file = files.file;
        //     const result = await this.controller.addActivity(
        //       req.params.conversationId,
        //       activity
        //     );
        //     if (this.settings.autoRemoveFiles) {
        //       fs.unlinkSync(files.activity.path);
        //       fs.unlinkSync(files.file.path);
        //     }
        //     res.status(result.status).send(result.body);
        //   }
        // });
      }
    );

    server.get(`/v3/directline/conversations/:conversationId`, (req, res) => {
      this.logger('debug', `GET /v3/directline/conversations/:conversationId`);
      res.status(200).end();
    });

    server.post(
      `/v3/directline/conversations/:conversationId/upload`,
      (req, res) => {
        this.logger(
          'debug',
          `POST /v3/directline/conversations/:conversationId/upload`
        );
        res.status(200).end();
      }
    );

    server.get(
      '/v3/directline/conversations/:conversationId/stream',
      (req, res) => {
        this.logger(
          'debug',
          'GET /v3/directline/conversations/:conversationId/stream'
        );
        res.status(200).end();
      }
    );

    server.post('/v3/conversations', (req, res) => {
      this.logger('debug', 'POST /v3/conversations');
      res.status(200).end();
    });

    server.post('/v3/conversations/:conversationId/activities', (req, res) => {
      this.logger('debug', 'POST /v3/conversations/:conversationId/activities');
      res.status(200).end();
    });

    server.post(
      '/v3/conversations/:conversationId/activities/:activityId',
      async (req, res) => {
        this.logger(
          'debug',
          'POST /v3/conversations/:conversationId/activities/:activityId'
        );
        const result = await this.controller.postActivityV3(
          req.params.conversationId,
          req.body
        );
        res.status(result.status).send(result.body);
      }
    );

    server.get('/v3/conversations/:conversationId/members', (req, res) => {
      this.logger('debug', 'GET /v3/conversations/:conversationId/members');
      res.status(200).end();
    });

    server.get(
      '/v3/conversations/:conversationId/activities/:activityId/members',
      (req, res) => {
        this.logger(
          'debug',
          'GET /v3/conversations/:conversationId/activities/:activityId/members'
        );
        res.status(200).end();
      }
    );

    server.get('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.logger('debug', 'GET /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.get('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.logger('debug', 'GET /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.get(
      '/v3/botstate/:channelId/conversations/:conversationId/users/:userId',
      (req, res) => {
        this.logger(
          'debug',
          'GET /v3/botstate/:channelId/conversations/:conversationId/users/:userId'
        );
        res.status(200).end();
      }
    );

    server.post('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.logger('debug', 'POST /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });

    server.post(
      '/v3/botstate/:channelId/conversations/:conversationId',
      (req, res) => {
        this.logger(
          'debug',
          'POST /v3/botstate/:channelId/conversations/:conversationId'
        );
        res.status(200).end();
      }
    );

    server.post(
      '/v3/botstate/:channelId/conversations/:conversationId/users/:userId',
      (req, res) => {
        this.logger(
          'debug',
          'POST /v3/botstate/:channelId/conversations/:conversationId/users/:userId'
        );
        res.status(200).end();
      }
    );

    server.delete('/v3/botstate/:channelId/users/:userId', (req, res) => {
      this.logger('debug', 'DELETE /v3/botstate/:channelId/users/:userId');
      res.status(200).end();
    });
  }

  createAnswer(srcActivity) {
    return this.controller.createAnswer(srcActivity);
  }

  say(srcActivity, text) {
    if (typeof text === 'string') {
      const answer = this.createAnswer(srcActivity.activity || srcActivity);
      answer.text = text || srcActivity.text;
      this.controller.say(answer);
    } else {
      this.controller.say(srcActivity);
    }
  }
}

(async () => {
  const dock = await dockStart();
  const nlp = dock.get('nlp');
  await nlp.train();
  nlp.save();
  const directLine = new DirectlineConnector(nlp);
  directLine.start();
  directLine.onCreateConversation = (connector, conversation) => {
    const activity = {
      conversation: {
        id: conversation.conversationId
      }
    }
    connector.say(activity, 'Hello! my name is Nova, how can I help you?');
  }
  log("Startup", "info", "Chatbot started! you can chat with the bot using this link http://localhost:3000/");
})();