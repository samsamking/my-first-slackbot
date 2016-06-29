## Unit Project #1: Slackbot

This project is to showcase a working Slackbot, built by Sam.

### What does my bot do?

1. It creates a "pizzatime" conversation with the users
2. It responses to show all the names in the JS class/general channel
3. To take the names further, it tells you all the names with (a) certain letter(s) in their names
4. It uses attachments, so every time you want to see an animal, it replies you with information about Taronga Zoo, a link to the zoo, an icon and current time in the footer, as well as a random selected animal image each time

Excited? Let's start.

### what commands it responds to?

#### "pizzatime" 
  1. Direct message (private message) or direct mention (@lemmingbot to start) Lemmingbot inside Slack
  2. Type in "pizzatime" or "pizza time"
  3. Lemmingbot will say "What flavor of pizza do you want? Hawaiian, meatlovers, chicken, beef or vegetarian?"
  4. Type in either "Hawaiian", "meatlovers", "chicken", "beef" or "vegetarian"
  5. Lemmingbot will ask you "What size would you like? 10", 12" or 14"?"
  6. You must reply with a number - either 10, 12, or 14, otherwise Lemmingbot is very stubborn and will not let you pass. (There is an if statement here to check the patten of your answer)
  7. Then Lemmingbot will ask you "So where do you want it delivered to?"
  8. Type in any random address eg "10 Oxford St, Surry Hills."
  9. The conversation will finish here "Great, see you soon"

#### all the names
  1. Direct message or direct mention Lemmingbot inside Slack
  2. Type in either 'all the names', 'all the names in JS class', or 'all the names in the class'
  3. Lemmingbot will tell you all the names in the JS class/general channel excluding all the bots' names

#### names with letter(s)
  1. Direct message or direct mention Lemmingbot
  2. Type in "names with"+ a letter eg "s" or letters eg "ss", for example type in "names with s", it will return all the names with that/those letter(s) in the class
  3. If you type in "names with" + letters eg "names with vohkfodhfdnjfd" which are not in anyone's name, Lemmingbot will tell you there is no name matching

#### attachments
  1. Direct message or direct mention Lemmingbot in Slack
  2. Type in either 'show me an animal', 'show me a random animal in the zoo', 'show me a random animal', or 'show me an animal in the zoo'
  3. Lemmingbot will reply you with information about Taronga Zoo, a link to the zoo, an icon and current time in the footer, as well as a random selected animal image each time

### What approach has been taken?

1. I did multiple searches. I started with controller.hears "hello", based on that, I checked out many examples as well as read the documents on slack API
2. I had a clear picture what I wanted to do after the research, had pseudocode in mind
3. One thing really helped me was to test small pieces of functionality frequently as in "Suggested way to get started" 
4. Once you understand the structure of Slack, it is a matter of getting all the data into a structure you want
5. "Google is your friend" when my code was not working
6. Just kept trying until it worked.

### installation instructions (below is stolen from Jess)

-------------------------------------------------------------------------------------------------
The tools used include:

- node
- npm
- [botkit](https://github.com/howdyai/botkit)
- [now.sh](https://now.sh)

## Setup

**Environment**

For our Slackbot to talk to Slack, it needs a secret token. To ensure the secret
token isn't accidentally shown to the world, we _environment variables_ that are
_never_ commited to git or GitHub. These environment variables are stored in a
file called `.env`.

This project comes with sample environment variables in a file `.env.sample`. To
get started, copy it to `.env`:

```bash
$ cp .env.sample .env
```

Edit the new `.env` file to add your slack token. For example, if your token was
`abc123`, you'd edit the file to be:

```
SLACKBOT_TOKEN=abc123
```

_Remember: The `.env` file should never be added to git, otherwise you will be
giving away your secret key!_

**`now.sh`**

We need to deploy our slackbot somewhere, and the easiest way is with the free
service called [`now`](https://now.sh).

Install `now` onto your machine:

```bash
$ npm install -g now
```

---

## Making your slackbot

### Getting Started

You'll first need to install the packages this project requires to run:

```bash
$ npm install
```

Next, you need to install and save the `botkit` package for this project:

```bash
$ npm install --save botkit
```

You will see `botkit` has been added to your `package.json` file for you:

```json
{
  ...
  "dependencies": {
    "botkit": "^0.2.0",
    ...
  }
  ...
}
```

Now that you have `botkit` installed, we can access it in our JavaScript with
the `require` function:

```javascript
var Botkit = require('botkit');
```

### Connecting to Slack

Slack supports a number of different ways for your bot to connect. The most
basic of which is [Real Time Messaging](http://api.slack.com/rtm) (aka, RTM).

> The Real Time Messaging API is an API that allows you to receive
> events from Slack in real time and send messages as a user. It is the basis for
> all Slack clients. It's also commonly used with the bot user integration to
> create helper bots for your team.
> 
> [Slack] will provide a stream of events, including both messages and updates to
> the current state of the team.
> 
> Almost everything that happens in Slack will result in an event being sent [...]
> The simplest event is a message sent from a user:

Botkit comes with support for RTM ready to go. Here is an example modified
slightly [from
botkit's homepage](https://howdy.ai/botkit/#/get-your-bot-online):

```javascript
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: <your-token-here>
  OR token: process.env.SLACKBOT_TOKEN
})
bot.startRTM(function(error, whichBot, payload) {
  if (error) {
    throw new Error('Could not connect to Slack');
  }
});
```

Once we've started the connection to the Real Time Messaging API, we can setup
our bot to listen for keywords, commands, etc.

### Listening

Botkit provides a very useful function `.hears()` that allows our bot to
optionally listen for different message types. 3 useful ones are:
  
* `mention`: When someone uses your bot's name anywhere in their message
  * > Jess: Hey everyone, check out @awesomebot my new bot!
* `direct_mention`: When someone starts their message with your bot's name
  * > Jess: @awesomebot how are you doing?
* `direct_message`: When someone sends a private chat message to your bot

You can read about more Slack event types [in the botkit
documentation](https://github.com/howdyai/botkit/blob/master/readme-slack.md#slack-specific-events)

Here is an example of listening for a `mention` message containing the word
`'hello'`:

```javascript
controller.hears(['hello'], ['mention'], function(whichBot, message) {
  whichBot.reply(message, 'Did you say my name?');
});
```

To trigger that response, you could post a message such as:

> Jess: Everyone say hello to @awesomebot!

**`.hears()`**

`.hears()` has 3 parameters;

1. An array of phrases to listen for. These phrases can also be [regular
   expression strings](https://mdn.io/regex)
2. An array of events to listen to. [See the
   docs](https://github.com/howdyai/botkit/blob/master/readme-slack.md#slack-specific-events)
3. A function to execute after a matching event + phrase is received.

### Testing locally

We can test our slackbot locally to make sure it's working. To do so, we use
`npm` to start up our program:

```bash
$ npm start
```

_Note: This runs the command listed in the `package.json` file under
`scripts.start`, which is itself starting up `node` with a couple of extra
options_

Go check out Slack; your bot should now be listening.

To stop it running, type `<Ctrl-C>` on the command line.

### Adcanced Usage

Botkit provides lots of great ways to interact with Slack and its users. [Read
the
documentation](https://github.com/howdyai/botkit/blob/master/readme-slack.md#outgoing-webhooks-and-slash-commands)
to find out more.

If you would like to setup an Outgoing web hook, or a slash command, let your
instructor know the URL (see _Deploying_ below) and the parameters you'd like to
setup.

---

## Deploying

When you're done testing locally and are ready to deploy your application, make
sure you're in this project's directory then execute:

```bash
$ now
```

_Note: The first time you do this, it will ask for a valid email address. Enter one,
then go click the link in the email you receive._

`now` will automatically upload and deploy your project for you to the web.

Every time you deploy, `now` will give you a new, unique URL for your project.
This means **you should delete any previous deployments to avoid having multiple
copies running at the same time**:

To delete a deployment, first list out the current IDs:

```bash
$ now list

my-first-slackbot

  VGCt1QVxGMj5i84kfbprKlzH      https://myfirstslackbot-ddwbrdgjjm.now.sh      1h ago
```

Then, to remove the deploy with id `VGCt1QVxGMj5i84kfbprKlzH`, run:

```bash
$ now remove VGCt1QVxGMj5i84kfbprKlzH
```

## All done?

Got a Slackbot up and running, responding to commands? Excellent! Ask your
instructor for more info on the Slackbot assignment which you are now prepared
to get started with.
