var yahooStockPrices = require('yahoo-stock-prices');
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/checkstock', async ({ command, ack, payload, context }) => {
  await ack();
  const price = await yahooStockPrices.getCurrentPrice(`${command.text}`);
  
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${command.text}` + " " + price.toString()
          },
        }
      ],
      // Text in the notification
      text: 'Price of Stock'
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

