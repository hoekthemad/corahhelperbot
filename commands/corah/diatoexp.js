const { Client, GatewayIntentBits, InteractionContextType, SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { token } = require('../../config.json');
const { FSDB } = require('file-system-db');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        // #region Command Builder
        // I normally use .setName as the 
        .setName('diatoexp')
        .setDescription('Calculate the amount of diamonds a sum of gold is worth')
        .addNumberOption(option =>
            option
                .setName('start')
                .setDescription('The amount of exp seen to track from.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('end')
                .setDescription('The amount of exp seen to track to.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('dia')
                .setDescription('The amount of diamonds you spent.')
                .setRequired(true)
        )
        // Set the default permission the user needs in order to even see the command.
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        // Force this command to only be able to be ran within guilds and not direct messages.
        .setContexts(InteractionContextType.Guild),
    // #endregion

    async execute(interaction) {
        // I set a base try{} to just get the error message from the script to the event file.
        try {
            const guildId = interaction.guildId;
            const guild = await client.guilds.fetch(guildId);
            
            let fsDB = new FSDB(`logs/${guildId}.json`);
            fsDB.compact = false;
            let startExp = 1*interaction.options.getNumber(`start`);
            let endExp = 1*interaction.options.getNumber(`end`);

            let expDiff = endExp-startExp;

            let diaSpent = 1*interaction.options.getNumber(`dia`);

            let expToDia = Math.round(expDiff/diaSpent);

            let date = new Date();
            await interaction.reply({ content: `** **`, flags: MessageFlags.Ephemeral });

            // console.log(`Command running by ${interaction.user.globalName} in ${guild.name}\r\nConverting ${goldToConvert} using ${conversionRate} dia per million at ${date}`);
            //fsDB.push('Info1', [`Command running by ${interaction.user.globalName} in ${guild.name}\r\nConverting ${goldToConvert} using ${conversionRate} dia per million at ${date}`]);

            let messageEmbed = new EmbedBuilder()
                .setTitle("Exp:Diamond ratio")
                .setColor(0x00FF00)
                .setAuthor({ name: interaction.user.globalName })
                .setDescription("FInd out how much exp you're getting for every diamond spent")
                .setTimestamp()
                .addFields({ name: 'Starting Exp', value: `${startExp.toLocaleString()}` })
                .addFields({ name: 'End Exp', value: `${endExp.toLocaleString()}` })
                .addFields({ name: 'Exp Diff', value: `${expDiff.toLocaleString()}` })
                .addFields({ name: 'Dia Spent', value: `${diaSpent.toLocaleString()}` })
                .addFields({ name: 'Exp Per Dia', value: `${expToDia.toLocaleString()}` })
                .setFooter({text: "Good luck"});
            await interaction.editReply({ embeds: [messageEmbed], flags: MessageFlags.Ephemeral });
            
            //fsDB.push('Info2', [`Completed successfully`]);
            //fsDB.push('Info3', [`--------------------------------------------------------------`]);
        }
        catch (error) {
            console.log(error);
        }
    },
};
client.login(token);