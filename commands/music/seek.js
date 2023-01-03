const ms = require('ms');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Skip Back Or Foward in A Song 🌩️',
    voiceChannel: true,
    options: [
    {
        name: 'time',
        description: 'Time That You Want To Skip To 🌩️',
        type: ApplicationCommandOptionType.String,
        required: true,
    }
    ],
    async execute({ inter }) {
        const queue = player.getQueue(inter.guildId);

        if (!queue || !queue.playing) return inter.reply({ content: `> **No music currently playing ${inter.reply}... try again ? **`, ephemeral: true });

        const timeToMS = ms(inter.options.getString('time'));

        if (timeToMS >= queue.current.durationMS) return inter.reply({ content:`> **The indicated time is higher than the total time of the current song ${inter.member}... try again ? <:2342:1051520390339502222> \n*Try for example a valid time like **5s, 10s, 20 seconds, 1m**..* **`, ephemeral: true });

        await queue.seek(timeToMS);

        inter.reply({ content: `> **Time set on the current song **${ms(timeToMS, { long: true })}**  **`});
    },
};
