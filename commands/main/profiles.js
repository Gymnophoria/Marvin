/* eslint-disable quotes */
module.exports = {
	profiles: function(command, message, args, suffix, sql, Discord, Canvas, fs) {
		if (command == 'profile' || command == 'profiles' || command == 'p') {
			if (message.author.bot) return;
			var usID;
			if (args[0] == '' || args[0] === undefined) {
				usID = message.author.id;
			} else if (args[0] == 'view' || args[0] == 'v') {
				if (message.mentions.users.first()) {
					usID = message.mentions.users.first().id;
				} else if (args[1] !== undefined && args[1] != '') {
					var bFindU = message.guild.members.find(val => val.user.username.toUpperCase() == suffix.slice(args[0].length + 1).toUpperCase());
					if (bFindU == undefined) {
						bFindU = message.guild.members.find(val => val.displayName.toUpperCase() == suffix.slice(args[0].length + 1).toUpperCase());
					}
					if (bFindU == undefined) {
						return message.channel.send('Could not find user by the name of `' + args[1] + '`');
					} else {
						usID = bFindU.id;
					}
				} else {
					usID = message.author.id;
				}
			} else if (args[0] == 'help' || args[0] == 'h') {
				var hEmbed = new Discord.RichEmbed()
					.setTitle('Profiles')
					.setDescription('Main command: .profile <view/setting>')
					.setColor(0x17c65a)
					.addField('View', '`.profile view [name]`\nView another users profile by mention or display name.')
					.addField('Setting', '`.profile setting <setting> <value>`\nChange a setting of your profile\nPossible settings: `status, bio, server, website, contact, location, gender, age, birthday, color, image, name, embed`');
				return message.channel.send({embed: hEmbed});
			} else if (args[0] == 'setting' || args[0] == 'settings' || args[0] == 's') {
				if (args[1].toLowerCase() == 'list' || args[1].toLowerCase() == 'l' || args[1] === undefined) return message.channel.send('Possible settings: \n`status`, `bio`, `server`, `website`, `contact`, `location`, `gender`, `age`, `birthday`, `color`, `image`, `name`');
				if (args[1].toLowerCase() != 'status' && args[1].toLowerCase() != 'bio' && args[1].toLowerCase() != 'server' && args[1].toLowerCase() != 'website' && args[1].toLowerCase() != 'contact' && args[1].toLowerCase() != 'location' && args[1].toLowerCase() != 'gender' && args[1].toLowerCase() != 'age' && args[1].toLowerCase() != 'birthday' && args[1].toLowerCase() != 'color' && args[1].toLowerCase() != 'image' && args[1].toLowerCase() != 'name' && args[1].toLowerCase() != 'embed') {
					return message.channel.send('Unkown setting name `' + args[1] + '`. Use `.p s l` for a list of settings.');
				}
				usID = message.author.id;
				sql.get(`SELECT * FROM profiles WHERE userId = '${usID}'`).then(row => {
					if (!row) {
						sql.run('INSERT INTO profiles (userId, status, bio, server, website, contact, location, gender, age, birthday, color, image, name, embed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [usID, null, null, null, null, null, null, null, null, null, null, null, null, 'false']);
						return message.channel.send('Profile created - Please run `' + message.content + '` again.');
					}
					function intoRowQ(r, c, i) {
						sql.run(`UPDATE profiles SET ${r} = '${c}' WHERE userId = ${i}`);
					}
					function intoRow(r, c, i) {
						sql.run(`UPDATE profiles SET ${r} = ${c} WHERE userId = ${i}`);
					}
					if (args[2] == 'remove') {
						message.channel.send(`Field ${args[1]} removed.`);
						return intoRow(args[1].toLowerCase(), null, usID);
					}
					var pSuffix = suffix.slice(args[0].length + args[1].length + 2);
					if (args[2] == '' || args[2] == undefined && args[1].toLowerCase() != 'image') return message.channel.send(`Please include a value for \`${args[1]}\`.`);
					if (args[1].toLowerCase() == 'status' && pSuffix.length > 30) return message.channel.send('Statuses cannot be longer than 30 characters.');
					if (args[1].toLowerCase() == 'bio' && pSuffix.length > 120) return message.channel.send('Bios cannot be longer than 120 characters.');
					if (args[1].toLowerCase() == 'server' && pSuffix.length > 30) return message.channel.send('Server links shouldn\'t be more than 30 characters..');
					if (args[1].toLowerCase() == 'website' && pSuffix.length > 50) return message.channel.send('No more than 50 characters of your website, please.');
					if (args[1].toLowerCase() == 'contact' && pSuffix.length > 50) return message.channel.send('Contact info shouldn\'t use more than 50 characters');
					if (args[1].toLowerCase() == 'location' && pSuffix.length > 30) return message.channel.send('It shouldn\'t take more than 30 characters to describe your location');
					if (args[1].toLowerCase() == 'gender' && pSuffix.length > 20) return message.channel.send('I don\'t care what you are, it should be less than 20 characters.');
					if (args[1].toLowerCase() == 'age' && pSuffix.length > 3) return message.channel.send('just no');
					if (args[1].toLowerCase() == 'birthday' && pSuffix.length > 12) return message.channel.send('No birth date is that long.');
					if (args[1].toLowerCase() == 'color' && pSuffix.length != 6) return message.channel.send('Color should be a 6-digit hex code.');
					if (args[1].toLowerCase() == 'image' && message.attachments.size == 0 || message.attachments.size > 0 && message.attachments.first().height === undefined) return message.channel.send('No image was attached. 🤔');
					if (args[1].toLowerCase() == 'name' && pSuffix.length > 25) return message.channel.send('C\'mon, your name isn\'t that long..');
					if (args[1].toLowerCase() == 'embed' && pSuffix != 'false' && pSuffix != 'true') return message.channel.send('Value should be either `true` or `false` (defaults to false)');
					if (args[1].toLowerCase() == 'image') {
						intoRowQ(args[1].toLowerCase(), message.attachments.first().url, usID);
					} else {
						intoRowQ(args[1].toLowerCase(), pSuffix, usID);
					}
					message.channel.send('Setting `' + args[1] + '` updated.');
				}).catch(() => {
					console.error;
				});
				return;
			} else {
				return message.channel.send('Argument `' + args[0] + '` not found. Please use `.profile help`');
			}
			var usMem = message.guild.members.find(val => val.id == usID);

			var Image = Canvas.Image
				, Font = Canvas.Font
				,	canvas = new Canvas(500, 400)
				,	ctx = canvas.getContext('2d')
				, request = require('request');

			var CabinCondensed = new Font('CabinCondensed', './media/fonts/name-CabinCondensed-Regular.ttf'); // names
			var MuliRegular = new Font('MuliRegular', './media/fonts/heading-Muli-Regular.ttf'); // headings
			var MuliLight = new Font('MuliLight', './media/fonts/subheading-Muli-Light.ttf'); // subheading
			var MuliItalic = new Font('MuliItalic', './media/fonts/italics-Muli-LightItalic.ttf'); // italics
			var MuliExtraLight = new Font('MuliExtraLight', './media/fonts/light-Muli-ExtraLight.ttf'); // extra light
			var DidactGothic = new Font('DidactGothic', './media/fonts/random-DidactGothic-Regular.ttf'); // random text
			ctx.addFont(CabinCondensed);
			ctx.addFont(MuliRegular);
			ctx.addFont(MuliLight);
			ctx.addFont(MuliItalic);
			ctx.addFont(MuliExtraLight);
			ctx.addFont(DidactGothic);

			sql.get(`SELECT * FROM profiles WHERE userId = '${usID}'`).then(row => {
				if (!row) {
					sql.run('INSERT INTO profiles (userId, status, bio, server, website, contact, location, gender, age, birthday, color, image, name, embed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [usID, null, null, null, null, null, null, null, null, null, null, null, null, 'false']);
					return message.channel.send('Blank profile created.');
				}
				function sendEmbed() {
					var pEmb = new Discord.RichEmbed()
						.setAuthor(usMem.displayName, usMem.user.avatarURL)
						.setDescription('This person has no profile.. How sad ;-;');

					function pEmbAF(e, h) {
						pEmb.addField(e, h, true);
						pEmb.setDescription('');// userId, status, bio, server, website, contact, location, gender, age, birthday
					}

					if (row.color !== null) pEmb.setColor(row.color);
					if (row.image !== null) pEmb.setThumbnail(row.image);
					if (row.status !== null) pEmbAF('Status', row.status);
					if (row.bio !== null) pEmbAF('Bio', row.bio);
					if (row.name !== null) pEmbAF('Name', row.name);
					if (row.server !== null) pEmbAF('Server', row.server);
					if (row.website !== null) pEmbAF('website', row.website);
					if (row.contact !== null) pEmbAF('Contact', row.contact);
					if (row.location !== null) pEmbAF('Location', row.location);
					if (row.gender !== null) pEmbAF('Gender', row.gender);
					if (row.age !== null) pEmbAF('Age', row.age);
					if (row.birthday !== null) pEmbAF('Birthday', row.birthday);

					return message.channel.send({embed: pEmb});
				}

				if (!message.guild.me.permissions.has("ATTACH_FILES")) {
					message.channel.send('I don\'t have permission to send images.. You get an embed.');
					return sendEmbed();
				}

				if (row.embed == 'true') return sendEmbed();

				var cNum = 0;
				var hasProfile = false;

				fs.readFile('/Users/Nik/Desktop/bots/marvinphoto.png', function(err, marvin){
					if (err) throw err;
					var img = new Image;
					img.src = marvin;
					ctx.drawImage(img, 460, 360, img.width / 15, img.height / 15);
				});

				var requestS1 = {
					url: usMem.user.avatarURL,
					method: 'GET',
					encoding: null
				};

				if (row.image === null) {
					request(requestS1, function (err, response, body) {
						var img = new Image;
						img.src = body;
						ctx.drawImage(img, 415, 10, 75, 75);
						CompleteDrawing();
					});
				} else {
					var requestS2 = {
						url: row.image,
						method: 'GET',
						encoding: null
					};
					request(requestS1, function(err, response, body) {
						var img = new Image;
						img.src = body;
						ctx.drawImage(img, 415, 10, 75, 75);
					});
					request(requestS2, function(err, response, body) {
						var img2 = new Image;
						img2.src = body;
						var im2r = 385 / 75;
						var im2h = img2.width / im2r;
						var im2hh = img2.height / 2;
						var im2mh = 37.5;
						if (img2.height < 75) {
							im2mh = im2hh;
						}
						ctx.drawImage(img2, 0, im2hh - im2mh, img2.width, im2h, 20, 10, 385, 75); // extra args after img2, :  0, 0, 385, 75,
						CompleteDrawing();
					});
				}

				var cH = 150;
				var cS = 170;
				var color;
				var sColor = '#dadada';
				var l;

				function addHeight(height) {
					hasProfile = true;
					cH = cH + height;
					cS = cS + height;
				}

				function normalRow(w, tn, rn, ah, ahM) {
					ctx.fillStyle = color;
					ctx.font = '25px MuliRegular';
					ctx.fillText(tn, w, cH);
					ctx.fillStyle = sColor;
					ctx.font = '20px MuliLight';
					ctx.fillText(rn, w, cS);
					if (ah === true) addHeight(ahM);
				} // width, title name, row name, add height, add height amount

				function CompleteDrawing() {
					if (row.color !== null) {
						color = '#' + row.color;
						ctx.fillStyle = color;
						ctx.fillRect(5, 5, 5, 390);
					} else {
						color = '#f7f2f2';
						ctx.fillStyle = color;
					}
					ctx.font = '40px CabinCondensed';
					ctx.save();
					ctx.translate(460, 95);
					ctx.rotate(90*Math.PI/180);
					ctx.fillText(usMem.displayName, 0, 0);
					ctx.restore();
					// remember to change fillstyle and font.
					if (row.name !== null) {
						hasProfile = true;
						ctx.save();
						ctx.font = '30px CabinCondensed';
						ctx.translate(422, 95);
						ctx.rotate(90*Math.PI/180);
						ctx.fillText(row.name, 0, 0);
						ctx.restore();
					}
					if (row.status !== null) {
						ctx.fillStyle = '#dadada';
						ctx.font = '25px MuliItalic';
						ctx.fillText(row.status, 35, 115);
						hasProfile = true;
					}
					if (row.bio !== null) {
						ctx.fillStyle = color;
						ctx.font = '25px MuliRegular';
						ctx.fillText('Bio', 20, cH);
						ctx.fillStyle = sColor;
						ctx.font = '22px MuliLight';
						if (ctx.measureText(row.bio).width > 800) {
							l = row.bio.length / 3;
							ctx.fillText(row.bio.slice(0, -l - l), 20, cS);
							addHeight(18);
							ctx.fillText(row.bio.slice(l, -l), 20, cS);
							addHeight(18);
							ctx.fillText(row.bio.slice(l + l), 20, cS);
							addHeight(57);
						} else if (ctx.measureText(row.bio).width > 400) {
							l = row.bio.length / 2;
							ctx.fillText(row.bio.slice(0, -l), 20, cS);
							addHeight(18);
							ctx.fillText(row.bio.slice(l), 20, cS);
							addHeight(57);
						} else {
							ctx.fillText(row.bio, 20, cS);
							addHeight(57);
						}
					}
					if (row.server !== null) {
						normalRow(20, 'Server', row.server.replace(/^(https?|ftp):\/\//g, ''), false);
					}
					if (row.website !== null) {
						normalRow(250, 'Website', row.website.replace(/^(https?|ftp):\/\//g, ''), false);
					}
					if (row.website !== null || row.server !== null) addHeight(57);
					if (row.contact !== null) {
						normalRow(20, 'Contact', row.contact.replace(/^(https?|ftp):\/\//g, ''), false);
					}
					if (row.location !== null) { // width, title name, row name, add height, add height amount
						normalRow(295, 'Location', row.location, false);
					}
					if (row.contact !== null || row.location !== null) addHeight(57);
					if (row.gender !== null) {
						normalRow(20, 'Gender', row.gender, false);
					}
					if (row.age !== null) {
						normalRow(200, 'Age', row.age, false);
					}
					if (row.birthday !== null) {
						normalRow(305, 'Birthday', row.birthday, false);
					}

					if (hasProfile === false) {
						ctx.font = '30px DidactGothic';
						ctx.save();
						ctx.translate(150, 180);
						ctx.rotate(-20*Math.PI/180);
						ctx.fillText('This user', 0, 5);
						ctx.fillText('has no', -10, 30);
						ctx.fillText('profile..', -20, 60);
						ctx.fillText('How sad.', -35, 105);
						ctx.restore();
					}

					return message.channel.send({files: [{attachment: canvas.toBuffer(), name: usMem.displayName + '.png'}]});
				}
			}).catch(() => {
				console.error;
			});
		}
	}
};