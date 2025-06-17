const { Client, GatewayIntentBits, InteractionContextType, SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { token, urlBase } = require('../../config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        // #region Command Builder
        // I normally use .setName as the 
        .setName('calcdia')
        .setDescription('Calculate the amount of diamonds a sum of gold is worth')
        .addStringOption(option =>
            option
                .setName('conversion')
                .setDescription('The value you want to convert the gold using (e.g. 1.76 would be 1.76 dia per million).')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('gold')
                .setDescription('The amount of gold you want to convert.')
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
            let conversionRate = 1*interaction.options.getString(`conversion`);
            let goldToConvert = 1*interaction.options.getString(`gold`);

            let channel = client.channels.cache.get(interaction.channelId);

            console.log(`Command running by ${interaction.user.globalName}\r\nConverting ${goldToConvert} using ${conversionRate} dia per million`);
            // await interaction.reply({ content: `Converting ${goldToConvert} using ${conversionRate} dia per million`, flags: MessageFlags.Ephemeral });

            let returnValue = (goldToConvert/1000000)*conversionRate;

            let messageEmbed = new EmbedBuilder()
                .setTitle("Convert gold to dia value")
                .setColor(0x00FF00)
                .setAuthor({ name: interaction.user.globalName })
                .setDescription("Find out how much your gold is worth")
                .addFields({name: "Dia Per Million", value: conversionRate})
                .addFields({name: "Gold To Convert", value: goldToConvert})
                .addFields({name: "Gold Value", value: `**${returnValue}**`})
                .setTimestamp();
            
            await channel.send({embeds: [messageEmbed]})
            // await interaction.reply({ embeds: [messageEmbed], flags: MessageFlags.Ephemeral });
        }
        catch (error) {
            return error;
        }
    },
};
client.login(token);