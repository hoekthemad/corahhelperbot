const { Client, GatewayIntentBits, InteractionContextType, SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { token } = require('../../config.json');
const { FSDB } = require('file-system-db');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        // #region Command Builder
        // I normally use .setName as the 
        .setName('calcgold')
        .setDescription('Calculate the amount of diamonds a sum of gold is worth')
        .addNumberOption(option =>
            option
                .setName('conversion')
                .setDescription('The value you want to convert the gold using (e.g. 1.76 would be 1.76 dia per million).')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName('diamonds')
                .setDescription('The amount of diamonds you want to convert.')
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
            let conversionRate = 1*interaction.options.getNumber(`conversion`);
            let diaToConvert = 1*interaction.options.getNumber(`diamonds`);

            let date = new Date();

            console.log(`Command running by ${interaction.user.globalName} in ${guild.name}\r\nConverting ${diaToConvert} using ${conversionRate} dia per million at ${date}`);
            //fsDB.push('Info1', [`Command running by ${interaction.user.globalName} in ${guild.name}\r\nConverting ${diaToConvert} using ${conversionRate} dia per million at ${date}`]);

            let millionPerDia = 1000000/conversionRate;
            let returnValue = Math.round(diaToConvert*millionPerDia);
            await interaction.reply({ content: `** **`, flags: MessageFlags.Ephemeral });
            let messageEmbed = new EmbedBuilder()
                .setTitle("Convert gold to dia value")
                .setColor(0x00FF00)
                .setAuthor({ name: interaction.user.globalName })
                .setDescription("Find out how much gold your diamonds are worth")
                .setTimestamp()
                .addFields({ name: 'Dia Per Million', value: conversionRate.toString() })
                .addFields({ name: 'Dia To Convert', value: diaToConvert.toLocaleString().toString() })
                .addFields({ name: 'Gold Value', value: `${returnValue.toLocaleString()}` })
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