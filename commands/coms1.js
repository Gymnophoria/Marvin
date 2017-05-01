const jokes = require('./jokes.js');

module.exports = {
  ping: function (command, message) {
    if (command == 'ping') {
      message.channel.send('pong?');
    }
  },
  say: function(command, message, suffix) {
    if (command == "say") {
      message.channel.send(suffix);
    }
  },
  lenny: function(command, message) {
    if (command == 'lenny') {
      message.channel.send('( ͡° ͜ʖ ͡°)');
    }
  },
  marvin: function(command, message, bot) {
    if (command == 'marvin') {
      var ms = bot.uptime,
          cd = 24 * 60 * 60 * 1000, // calc days
          ch = 60 * 60 * 1000, // calc hours
          cm = 60 * 1000, // calc minutes
          cs = 1000, // calc seconds
          days = Math.floor(ms / cd),
          dms = days * cd, //days, in ms
          hours = Math.floor((ms - dms) / ch),
          hms = hours * ch, //hours, in ms
          minutes = Math.floor((ms - dms - hms) / cm),
          mms = minutes * cm, //minutes, in ms
          seconds = Math.round((ms - dms - hms - mms) / cs);
      if (seconds == 60) {
        minutes++; // increase by 1
        seconds = 0;
      }
      if (minutes == 60) {
        hours++; // inc by 1
        minutes = 0;
      }
      if (hours == 24) {
        days++; // increase by 1
        hours = 0;
      }
      var dateStrings = [];

      if (days === 1) dateStrings.push("**1** day");
      else if (days > 1) dateStrings.push("**" + String(days) + "** days");

      if (hours === 1) dateStrings.push("**1** hour");
      else if (hours > 1) dateStrings.push("**" + String(hours) + "** hours");

      if (minutes === 1) dateStrings.push("**1** minute");
      else if (minutes > 1) dateStrings.push("**" + String(minutes) + "** minutes");

      if (seconds === 1) dateStrings.push("**1** second");
      else if (seconds > 1) dateStrings.push("**" + String(seconds) + "** seconds");

      var dateString = "";
      for (var i = 0; i < dateStrings.length - 1; i++) {
          dateString += dateStrings[i];
          dateString += ", ";
      }
      if(dateStrings.length >= 2) {
          dateString = dateString.slice(0, dateString.length - 2) + dateString.slice(dateString.length - 1);
          dateString += "and ";
      }
      dateString += dateStrings[dateStrings.length - 1];

      message.channel.send('Marvin is currently.. \nRunning on **' + bot.guilds.size + '** servers \nResponding to **' + bot.users.size + '** users\nActive for '+dateString);
    }
  },
  game: function(command, message, args, bot, suffix) {
    if (command == 'game') {
      if (args[0] === undefined || args[0] === '') {
        message.channel.send('Correct syntax: `.game <game>`');
        return;
      }
      message.channel.send({embed :{
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        fields: [{
          name: 'Now playing',
          value: suffix
        }]
      }});
      bot.user.setGame(suffix);
    }
  },
  L: function(command, message) {
    if (command == 'l' || command == 'L') {
      message.channel.send(':regional_indicator_l:\n:regional_indicator_l:\n:regional_indicator_l:\n:regional_indicator_l::regional_indicator_l::regional_indicator_l:');
    }
  },
  invite: function(command, message) {
    if (command == 'invite') {
      message.channel.send({embed: {
        title: 'bit.ly/invitemarvin',
        description: 'You need to be a **server manager** to add bots to a server',
        url: 'https://bit.ly/invitemarvin'
      }});
    }
  },
  airhorn: function(command, message, args) {
    if (command == 'airhorn' || command == 'ah') {
      const channel = message.member.voiceChannel;
      if (!message.member.voiceChannel) {
        message.channel.send('You need to be in a voice channel for me to play sounds');
        return;
      }
      var airType = args[0];
      if (args[0] === undefined || args[0] === '') {airType = 'original';}
      if (airType == 'original' || airType == 'mlg' || airType == 'sad' || airType == 'illuminati') {
        channel.join().then(connection => {
          const dispatcher = connection.playFile('./media/sounds/airhorn/' + airType + '.mp3');
          dispatcher.on("end", end => {
            channel.leave();
          });
        }).catch(console.error);
      } else {
        message.channel.send(':loudspeaker: Please choose airhorn type `original`, `illuminati`, `mlg`, or `sad`');
      }
    }
  },
  kys: function(command, message) {
    if (command == 'kys') {
      if (message.author.id != '179114344863367169') {
        return;
      }
      process.exit(0);
    }
  },
  choose: function(command, message) {
    if (command == 'choose') {
      var request = require('request');
      request('http://yesno.wtf/api', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var yesNo = JSON.parse(body);
          message.channel.send(yesNo.image);
        } else {
          Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
        }
      });
    }
  },
  ud: function(command, message, suffix) {
    if (command == 'ud' || command == 'urbandictionary') {
      var request = require('request');
      request('http://api.urbandictionary.com/v0/define?term=' + suffix, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var uD = JSON.parse(body);
          var uDChoose = Math.floor(Math.random()*(uD.list.length));
          if (uD.result_type !== "no_results") {
            message.channel.send({embed: {
              color: 680000,
              title: uD.list[uDChoose].word,
              url: uD.list[uDChoose].permalink,
              fields: [{
                name: 'Definition',
                value: uD.list[uDChoose].definition,
                inline: true
              },
              {
                name: 'Example',
                value: '*' + uD.list[uDChoose].example + '*',
                inline: true
              },
              {
                name: 'Author',
                value: uD.list[uDChoose].author,
                inline: true
              },
              {
                name: 'Ratings',
                value: ':thumbsup: ' + uD.list[uDChoose].thumbs_up + ' :thumbsdown: ' + uD.list[uDChoose].thumbs_down,
                inline: true
              }]
            }});
          } else {
            message.channel.send('**' + suffix + "**: \nNot even the urban dictionary has something like this..");
          }
        } else {
          Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
        }
      });
    }
  },
  ball: function(command, message) {
    if (command == '8ball') {
      var request = require('request');
      request('https://8ball.delegator.com/magic/JSON/0', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var ball = JSON.parse(body);
          message.channel.send(':8ball: ' + ball.magic.answer);
        } else {
          console.log("warn - Got an error: " + error + ", status code: " + response.statusCode);
        }
      });
    }
  },
  leet: function(command, message, leet, args, suffix) {
    if (command == 'l33t' || command == 'leet') {
      if (args[0] === undefined || args[0] === '') {
        message.channel.send('Please enter something to translate.');
        return;
      }
      var leetR = leet.encode(suffix);
      message.channel.send(leetR);
    }
  },
  joke: function(command, message, suffix, args) {
    if (command == 'joke') {
      var jokeJ = suffix.slice(4);
      if (jokeJ.includes('\n')) {
        message.channel.send('Jokes should be only one line.');
        return;
      }
      if (jokeJ.length > 250) {
        message.channel.send('Jokes should be under 250 chars');
        return;
      }
      if (jokeJ.includes('<@')) {
        message.channel.send('You can\'t mention people in jokes.. ffs');
        return;
      }
      jokes.loadJsonFile('./media/jokes.json');
      jokes.cleanOldJokes(604800000);
      if (args[0] == 'add') {
        jokes.addJoke(jokeJ);
        message.channel.send('`' + jokeJ + '` added as joke.');
        jokes.saveJsonFile('./media/jokes.json');
      } else {
        message.channel.send(jokes.getRandomJoke());
        jokes.saveJsonFile('./media/jokes.json');
      }
    }
  },
  cat: function(command, message) {
    if (command == 'cat' || command == 'kitty' || command == 'kitten') {
      var request = require('request');
      request('http://random.cat/meow', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var cat = JSON.parse(body);
          message.channel.send(cat.file);
        } else {
          console.log("warn - Got an error: " + error + ", status code: " + response.statusCode);
        }
      });
    }
  },
  trump: function(command, message, suffix) {
    if (command == 'trump') {
      if (suffix.length < 3 && suffix !== undefined && suffix != 'random' && suffix !== '') {
        message.channel.send('Search term needs to be 3 or more characters');
      }
      var request = require('request');
      if (suffix === undefined || suffix == 'random' || suffix === '') {
        request('https://api.tronalddump.io/random/quote', function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var trump = JSON.parse(body);
            message.channel.send({embed: {
              author: {
                name: 'Trump',
                icon_url: 'https://pbs.twimg.com/profile_images/1980294624/DJT_Headshot_V2_400x400.jpg'
              },
              color: 099933,
              timestamp: trump.appeared_at,
              url: trump._embedded.source[0].url,
              fields: [{
                name: 'Quote',
                value: trump.value,
                inline: true
              },
              {
                name: 'Tags',
                value: trump.tags.toString(),
                inline: true
              }]
            }});
          } else {
            console.log("warn - Got an error: " + error + ", status code: " + response.statusCode);
          }
        });
      } else {
        request('https://api.tronalddump.io/search/quote?query=' + suffix, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var trump = JSON.parse(body);
            if (trump.count === 0) {
              message.channel.send('Trump hasn\'t even said something that messed up..');
              return;
            }
            var trumpN = Math.floor(Math.random()*trump._embedded.quotes.length);
            message.channel.send({embed: {
              author: {
                name: 'Trump',
                icon_url: 'https://pbs.twimg.com/profile_images/1980294624/DJT_Headshot_V2_400x400.jpg'
              },
              color: 099933,
              timestamp: trump._embedded.quotes[trumpN].appeared_at,
              url: trump._embedded.quotes[trumpN]._embedded.source[0].url,
              fields: [{
                name: 'Quote',
                value: trump._embedded.quotes[trumpN].value,
                inline: true
              },
              {
                name: 'Tags',
                value: trump._embedded.quotes[trumpN].tags.toString(),
                inline: true
              }]
            }});
          } else {
            console.log("warn - Got an error: " + error + ", status code: " + response.statusCode);
          }
        });
      }
    }
  },
  calc: function(command, message, suffix, bot) {
    if (command == 'calc' || command == 'eval') {
      if (suffix === undefined || suffix === '') {
        message.channel.send('Please specify an expression to simplify.');
        return;
      }
      var request = require('request');
      request('https://newton.now.sh/simplify/' + encodeURIComponent(suffix), function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var newton = JSON.parse(body);
          message.channel.send({embed: {
            author: {
              name: 'Marvin',
              icon_url: bot.user.avatarURL
            },
            color: 099930,
            fields:[{
              name: 'Expression',
              value: newton.expression,
              inline: true
            },
            {
              name: 'Result',
              value: newton.result,
              inline:true
            }]
          }});
        } else {
          console.log("warn - Got an error: " + error + ", status code: " + response.statusCode);
        }
      });
    }
  },
  ss: function(command, message, args) {
    if (command == 'ss' || command == 'screenshot') {
      if (args[0] === undefined || args[0] === '') {
        message.channel.send('Please send a website to take a screenshot of');
      }
      var w = args[1];
      var h = args[2];
      if (args[1] === undefined || args[1] === '') {
        w = 960;
        h = 1500;
      }
      message.channel.send('http://api.screenshotlayer.com/api/capture?access_key=a3963a574b8cd45613333b83d5593e9c&viewport=' + w + 'x' + h + '&url=' + args[0]);
    }
  },
  xkcd: function(command, message, bot, args) {
    if (command == 'xkcd') {
      var request = require('request');
      request('https://xkcd.com/info.0.json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var xk = JSON.parse(body);
          var xkN = Math.floor(Math.random()*xk.num);
          if (message.channel.members.has('219764584146403330') && bot.users.get('219764584146403330').presence.status == 'online') {
            message.channel.send('/xkcd ' + xkN);
          } else {
            request('https://xkcd.com/' + xkN + '/info.0.json', function(err, resp, bod) {
              if (!err && resp.statusCode == 200) {
                xk = JSON.parse(bod);
                message.channel.send({embed: {
                  author: {
                    name: 'Marvin',
                    icon_url: bot.user.avatarURL
                  },
                  title: xk.title,
                  description: xk.alt,
                  footer: {text: '#' + xk.num},
                  timestamp: new Date(xk.year, xk.month, xk.day),
                  image: {url: xk.img}
                }});
              } else {
                console.log('Error: ' + err + ', status code: ' + resp.statusCode);
              }
            })
          }
        } else {
          console.log('Error: ' + error + ', status code: ' + response.statusCode);
        }
      })
    }
  },
  cleverbot: function(command, message, suffix, clever) {
    if (command == 'cb' || command == 'cleverbot' || command == 'clever') {
      clever.ask(suffix, function(err, response) {
        message.channel.send(response);
      });
    };
  },
  dog: function(command, message) {
    if (command == 'dog' || command == 'pupper' || command == 'puppy' || command == 'doggo' || command == 'doge') {
      var request = require('request');
      request('https://random.dog/woof.json', function(error, response, body) {
        var dog = JSON.parse(body);
        message.channel.send(dog.url);
      })
    }
  }
};
