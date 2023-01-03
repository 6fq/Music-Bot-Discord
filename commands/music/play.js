const { QueryType } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
module.exports = {
    name: 'play',
    description: "Play A Song 🌩️",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'The Song You Want To Play 🌩️',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const song = inter.options.getString('song');
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return inter.reply({ content: `> No results found ${inter.member}... try again ? `, ephemeral: true });

        const queue = await player.createQueue(inter.guild, {
            metadata: inter.channel,
            spotifyBridge: client.config.opt.spotifyBridge,
            initialVolume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd
        });

        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel);
        } catch {
            await player.deleteQueue(inter.guildId);
            return inter.reply({ content: `> I can't join the voice channel ${inter.member}... try again ?`, ephemeral: true});
        }

       await inter.reply({ content:`> **Loading your** ${res.playlist ? 'playlist' : 'Song'}... <:file:1057602816941756416>`});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
    },
};
