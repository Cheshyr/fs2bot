const { mongo_url } = require('../config.json');
const db = require('monk')(mongo_url);

module.exports = {
	name: 'gameprefs',
	description: 'Discord ID details',
	execute(message, args) {

		const players = db.get('players');
		var returnMessage = "";
		var querySet = {};

		if (args.length != 2) {
			returnMessage += `\`\`\`usage:\n!gameprefs <setting> <preference>` +

			`\n\nSetting:            Preference_Options` +
			`\n(1)Extermination:   (no/dark/light/any)` +
			`\n(2)Charge:          (no/dark/light/any)` +
			`\n(3)Disputed:        (no/dark/light/any)` +
			`\n(4)Secure:          (no/dark/light/any)` +
			`\n(5)Hostage:         (no/dark/light/any)` +
			`\n(6)Bomb Defusal:    (no/dark/light/any)` +
			`\n(7)Timed Turns:     (no/ok/only)`+
			`\n\neg: !gameprefs 1 dark` +
			`\neg: !gameprefs 7 no`;

			returnMessage += `\`\`\``;	

			return message.author.send(returnMessage);
		}

		// so I know I have 2 arguments.
		// lets do a validity check on those arguments

		if((args[0] < 1) || (args[0] > 7))
		{
			returnMessage += `\`\`\`usage:\n!gameprefs <setting> <preference>` +

			`\n\nSetting:            Preference_Options` +
			`\n(1)Extermination:   (no/dark/light/any)` +
			`\n(2)Charge:          (no/dark/light/any)` +
			`\n(3)Disputed:        (no/dark/light/any)` +
			`\n(4)Secure:          (no/dark/light/any)` +
			`\n(5)Hostage:         (no/dark/light/any)` +
			`\n(6)Bomb Defusal:    (no/dark/light/any)` +
			`\n(7)Timed Turns:     (no/ok/only)`+
			`\n\neg: !gameprefs 1 dark` +
			`\neg: !gameprefs 7 no`;

			returnMessage += `\`\`\``;	

			return message.author.send(returnMessage);
		}

		if((args[0] > 0) && (args[0] < 7))
		{
			if( (args[1] != "no") &&
				(args[1] != "dark") &&
				(args[1] != "light") &&
				(args[1] != "any")
			)
			{
				returnMessage += `\`\`\`usage:\n!gameprefs <setting> <preference>` +

				`\n\nSetting:            Preference_Options` +
				`\n(1)Extermination:   (no/dark/light/any)` +
				`\n(2)Charge:          (no/dark/light/any)` +
				`\n(3)Disputed:        (no/dark/light/any)` +
				`\n(4)Secure:          (no/dark/light/any)` +
				`\n(5)Hostage:         (no/dark/light/any)` +
				`\n(6)Bomb Defusal:    (no/dark/light/any)` +
				`\n(7)Timed Turns:     (no/ok/only)`+
				`\n\neg: !gameprefs 1 dark` +
				`\neg: !gameprefs 7 no`;

				returnMessage += `\`\`\``;	

				return message.author.send(returnMessage);
			}
			else
			{
				// valid setting and preference for a game type



				// find player
				players.findOne({ discordID: message.author.id }).then((doc) => {
					//console.log(doc);

					if (doc === null) {
						// discord id does not exist

						// create dummy data spots:
						//  - discordID
						//  - FS2_username [none]
						//  - pref_Exte (no/dark/light/any) [any]
						//  - pref_Char (no/dark/light/any) [any]
						//  - pref_Disp (no/dark/light/any) [any]
						//  - pref_Secu (no/dark/light/any) [any]
						//  - pref_Host (no/dark/light/any) [any]
						//  - pref_Bomb (no/dark/light/any) [any]
						//  - pref_timed (no/ok/only) [ok]

						// do an insert
						players.insert([{
							discordID: message.author.id,
							FS2_username: "none",
							pref_Exte: "any",
							pref_Char: "any",
							pref_Disp: "any",
							pref_Secu: "any",
							pref_Host: "any",
							pref_Bomb: "any",
							pref_timed: "ok",
							lfg_time: -2 
						}]).then((updatedDoc) => {

							// created user.  Now update
							switch(+args[0])
							{
								case 1:
									querySet['pref_Exte'] = args[1];
									break;
								case 2:
									querySet['[pref_Char'] = args[1];
									break;
								case 3:
									querySet['pref_Disp'] = args[1];
									break;
								case 4:
									querySet['pref_Secu'] = args[1];
									break;
								case 5:
									querySet['pref_Host'] = args[1];
									break;
								case 6:
									querySet['pref_Bomb'] = args[1];
									break;
							}

							console.log(querySet);

							// do an update
							players.findOneAndUpdate({ discordID: message.author.id }, { $set: querySet }).then((updatedDoc2) => {
								console.log(updatedDoc2);
								returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
									`\nFS2_username:  ` + updatedDoc2.FS2_username +
									`\n\nGame Preferences:` +
									`\nExtermination: ` + updatedDoc2.pref_Exte +
									`\nCharge:        ` + updatedDoc2.pref_Char +
									`\nDisputed:      ` + updatedDoc2.pref_Disp +
									`\nSecure:        ` + updatedDoc2.pref_Secu +
									`\nHostage:       ` + updatedDoc2.pref_Host +
									`\nBomb Defusal:  ` + updatedDoc2.pref_Bomb +
									`\nTimed Turns:   ` + updatedDoc2.pref_timed + `\n`;

								//if (updatedDoc2.FS2_username == "none") {
									returnMessage += `\n!setname to set FS2_username`;
								//}
								returnMessage += `\n!profile to view your details`;
								returnMessage += `\n!gameprefs to change game preferences`;
								returnMessage += `\n!lfg to find players looking for games`;
                        
								returnMessage += `\`\`\``;
								return message.author.send(returnMessage);
							})

						})

					}

					else {

						// discord id has been registered
						switch(+args[0])
						{
							case 1:
								querySet['pref_Exte'] = args[1];
								break;
							case 2:
								querySet['[pref_Char'] = args[1];
								break;
							case 3:
								querySet['pref_Disp'] = args[1];
								break;
							case 4:
								querySet['pref_Secu'] = args[1];
								break;
							case 5:
								querySet['pref_Host'] = args[1];
								break;
							case 6:
								querySet['pref_Bomb'] = args[1];
								break;
						}

						console.log(querySet);

						// do an update
						players.findOneAndUpdate({ discordID: message.author.id }, { $set: querySet }).then((updatedDoc2) => {
							console.log(updatedDoc2);
							returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
								`\nFS2_username:  ` + updatedDoc2.FS2_username +
								`\n\nGame Preferences:` +
								`\nExtermination: ` + updatedDoc2.pref_Exte +
								`\nCharge:        ` + updatedDoc2.pref_Char +
								`\nDisputed:      ` + updatedDoc2.pref_Disp +
								`\nSecure:        ` + updatedDoc2.pref_Secu +
								`\nHostage:       ` + updatedDoc2.pref_Host +
								`\nBomb Defusal:  ` + updatedDoc2.pref_Bomb +
								`\nTimed Turns:   ` + updatedDoc2.pref_timed + `\n`;

							//if (updatedDoc2.FS2_username == "none") {
								returnMessage += `\n!setname to set FS2_username`;
							//}
							returnMessage += `\n!profile to view your details`;
							returnMessage += `\n!gameprefs to change game preferences`;
							returnMessage += `\n!lfg to find players looking for games`;
                        
							returnMessage += `\`\`\``;
							return message.author.send(returnMessage);
						})

					}
				})


			}
		}

		if(args[0] == 7)
		{
			if( (args[1] != "no") &&
				(args[1] != "ok") &&
				(args[1] != "only") 
			)
			{
				return message.author.send(`invalid Preference_Options argument for timed turns`);
			}
			else
			{
				// valid setting and preference for a game type

				// find player
				players.findOne({ discordID: message.author.id }).then((doc) => {
					//console.log(doc);

					if (doc === null) {
						// discord id does not exist

						// create dummy data spots:
						//  - discordID
						//  - FS2_username [none]
						//  - pref_Exte (no/dark/light/any) [any]
						//  - pref_Char (no/dark/light/any) [any]
						//  - pref_Disp (no/dark/light/any) [any]
						//  - pref_Secu (no/dark/light/any) [any]
						//  - pref_Host (no/dark/light/any) [any]
						//  - pref_Bomb (no/dark/light/any) [any]
						//  - pref_timed (no/ok/only) [ok]

						// do an insert
						players.insert([{
							discordID: message.author.id,
							FS2_username: "none",
							pref_Exte: "any",
							pref_Char: "any",
							pref_Disp: "any",
							pref_Secu: "any",
							pref_Host: "any",
							pref_Bomb: "any",
							pref_timed: "ok",
							lfg_time: -2 
						}]).then((updatedDoc) => {

							// do an update
							players.findOneAndUpdate({ discordID: message.author.id }, { $set: {pref_timed: args[1]} }).then((updatedDoc2) => {
								console.log(updatedDoc2);
								returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
									`\nFS2_username:  ` + updatedDoc2.FS2_username +
									`\n\nGame Preferences:` +
									`\nExtermination: ` + updatedDoc2.pref_Exte +
									`\nCharge:        ` + updatedDoc2.pref_Char +
									`\nDisputed:      ` + updatedDoc2.pref_Disp +
									`\nSecure:        ` + updatedDoc2.pref_Secu +
									`\nHostage:       ` + updatedDoc2.pref_Host +
									`\nBomb Defusal:  ` + updatedDoc2.pref_Bomb +
									`\nTimed Turns:   ` + updatedDoc2.pref_timed + `\n`;

								//if (updatedDoc2.FS2_username == "none") {
									returnMessage += `\n!setname to set FS2_username`;
								//}
								returnMessage += `\n!profile to view your details`;
								returnMessage += `\n!gameprefs to change game preferences`;
								returnMessage += `\n!lfg to find players looking for games`;
                        
								returnMessage += `\`\`\``;
								return message.author.send(returnMessage);
							})

						})
					}
					else 
					{

						// discord id exists

						// do an update
						players.findOneAndUpdate({ discordID: message.author.id }, { $set: {pref_timed: args[1]} }).then((updatedDoc2) => {
							console.log(updatedDoc2);
							returnMessage = `\`\`\`\nDiscord Name:  ` + message.author.username +
								`\nFS2_username:  ` + updatedDoc2.FS2_username +
								`\n\nGame Preferences:` +
								`\nExtermination: ` + updatedDoc2.pref_Exte +
								`\nCharge:        ` + updatedDoc2.pref_Char +
								`\nDisputed:      ` + updatedDoc2.pref_Disp +
								`\nSecure:        ` + updatedDoc2.pref_Secu +
								`\nHostage:       ` + updatedDoc2.pref_Host +
								`\nBomb Defusal:  ` + updatedDoc2.pref_Bomb +
								`\nTimed Turns:   ` + updatedDoc2.pref_timed + `\n`;

							//if (updatedDoc2.FS2_username == "none") {
								returnMessage += `\n!setname to set FS2_username`;
							//}
							returnMessage += `\n!profile to view your details`;
							returnMessage += `\n!gameprefs to change game preferences`;
							returnMessage += `\n!lfg to find players looking for games`;
                        
							returnMessage += `\`\`\``;
							return message.author.send(returnMessage);
						})

					}

				})
			}
		}        
	}
};