/**
 * Your slackbot token is available as the global variable:

process.env.SLACKBOT_TOKEN

 * When deployed to now.sh, the URL of your application is available as the
 * global variable:

process.env.NOW_URL

 * The URL is useful for advanced use cases such as setting up an Outgoing
 * webhook:
 * https://github.com/howdyai/botkit/blob/master/readme-slack.md#outgoing-webhooks-and-slash-commands
 *
 */
 
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: process.env.SLACKBOT_TOKEN
})
bot.startRTM(function(error, whichBot, payload) {
	if (error) {
		throw new Error('Could not connect to Slack');
	}
});

/*pizza time conversation*/
controller.hears(['pizzatime', 'pizza time'],['direct_message', 'direct_mention'],function(bot,message) {
	bot.startConversation(message, askFlavor);
});
askFlavor = function(response1, convo1) {
	convo1.ask("What flavor of pizza do you want? Hawaiian, meatlovers, chicken, beef or vegetarian?", function(response1, convo1) {
		convo1.say("Awesome, " +response1.text+" it is.");
		askSize(response1, convo1);
		convo1.next();
	});
	askSize = function(response2, convo2) {
		convo2.ask("What size would you like? 10\", 12\" or 14\"", function(response2, convo2) {
			var pattern=/^[0-9]\S\w*/;
			if (pattern.test(response2.text)) {
				convo2.say("Sweet, " +response2.text+" it is.")
				askWhereDeliver(response2, convo2);
				convo2.next();
			}else{
				askSize(response1, convo1);
				convo2.next();
			}
		});
		askWhereDeliver = function(response3, convo3) { 
			convo3.ask("So where do you want it delivered?", function(response3, convo3) {
				convo3.say("Great, see you soon.");
				convo3.next();
			});
		}	
	}
}

/*all the names in JS class excluding bots*/
controller.hears(['all the names', 'all the names in JS class', 'all the names in the class'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
	bot.api.channels.info({channel: 'C0ZSX0Z9N'}, function channelsInfo(err1, response1) {
		var membersInGeneral=response1.channel.members;
		var newMemberArray=[];
		bot.api.users.list({},function usersList(err2,response2) {
			var allMembers=response2.members;
			for (var j=0; j<membersInGeneral.length; j++){
				for (var i=0; i<allMembers.length; i++){	
					if (membersInGeneral[j]==allMembers[i].id){
						newMemberArray.push(allMembers[i].name);
					};
				}
			}
			var user =newMemberArray.join(", ")
			bot.reply(message, user);
		});
	});
});

//put "names with" or "name with" + any character(s) may or may not be in the user names in the general channel only
controller.hears(['names with .*', 'name with .*' ], ['direct_message', 'direct_mention'], function(bot, message) {
	bot.api.channels.info({channel: 'C0ZSX0Z9N'}, function channelsInfo(err1, response1) {
		var membersInGeneral=response1.channel.members;
		var newMemberArray=[];
		var isMatchFound = false;
		function keepLastWord(words) {
			var n = words.split(" ");
			return n[n.length - 1];
		}
		var characters=keepLastWord(message.text).toLowerCase();
		bot.api.users.list({},function usersList(err2,response2) {
			var allMembers=response2.members;
			allMembers.forEach(function(eachMember, index){
				for(var i = 0; i < membersInGeneral.length; i++){
					if (eachMember.id ==membersInGeneral[i]){
						var memberName=eachMember.name;
						if(memberName.toLowerCase().indexOf(characters) != -1){
							newMemberArray.push(memberName);
							isMatchFound = true;
							break;
						}
					}
				}
			})
			var user =newMemberArray.join(", ")
			bot.reply(message, user);
			if(!isMatchFound){
				bot.reply(message, "Sorry there is no name with the charater(s) you entered.");
			}
						
		});
	});
});

/*Attachments - attachs names, url, title, title link ect. and a random picture of the animals in the zoo*/
controller.hears(['show me a random animal in the zoo', 'show me a random animal', 'show me an animal', 'show me an animal in the zoo'],['direct_message', 'direct_mention'],function(bot,message) {
	var imageUrls= [
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Koala_0.png?itok=S5QfwpB6", 
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Sumatran-Tiger.png?itok=PQkD4xqi",
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Australian-Sea-lion.png?itok=dw0EfbJV",
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Ring-tailed-Lemur.png?itok=qwJbu_4Q",
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Black-Rhinoceros.png?itok=NQ1eE9WZ",
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Goodfellow%27s-Tree-Kangaroo.png?itok=4kqQbrnG",
		"https://taronga.org.au/sites/tarongazoo/files/styles/large/public/images/puz_Tas-Devil_0.png?itok=O3tb9SQM"
	];
	var randomImage=imageUrls[Math.floor(Math.random() * imageUrls.length)];
	var attachments=[
		{
		"fallback": "Taronga is a not-for-profit organisation supporting wildlife conservation.",
		"color": "#36a64f",
		"pretext": "Taronga is a not-for-profit organisation supporting wildlife conservation.",
		"title": "Taronga Zoo",
		"title_link": "https://taronga.org.au/",
		"text": "Securing a shared future for wildlife and people",
		"image_url": randomImage,
		"footer": "one of the cute animals",
		"footer_icon": "https://taronga.org.au/sites/tarongazoo/themes/custom/taronga/favicon.ico",
		"ts":message.ts
		}]
	bot.reply(message,{
		text: 'Please see below...',
		attachments: attachments,
	},function(err,resp) {
		console.log(err,resp);
	});
});
