// Bot de Registro Discord - LAUREA (VERSÃO FINAL)
// Requisitos: Node.js + discord.js v14

const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ================== CONFIG ==================
const TOKEN = "MTQ5ODQxMzEzODMzOTQzNDc1OA.GUnKG3.7lo2nKPMnYujGmbhdSbzay_0sgbzRd4yM-eWMk";

const CARGO_RECLUTA_ID = "1452293995819696204";
const CANAL_CADASTRO_ID = "1498434208807387316";
const CANAL_REGISTRO_ID = "1452293996918345827";
// ============================================

client.once(Events.ClientReady, () => {
  console.log(`✅ Logado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  // BOTÃO
  if (interaction.isButton()) {
    if (interaction.customId === 'abrir_registro') {
      const modal = new ModalBuilder()
        .setCustomId('modal_registro')
        .setTitle('Registro LAUREA');

      const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel('NOME COMPLETO')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const id = new TextInputBuilder()
        .setCustomId('id')
        .setLabel('ID')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const vulgo = new TextInputBuilder()
        .setCustomId('vulgo')
        .setLabel('VULGO')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const deep = new TextInputBuilder()
        .setCustomId('deep')
        .setLabel('DEEP')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const telefone = new TextInputBuilder()
        .setCustomId('telefone')
        .setLabel('TELEFONE')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nome),
        new ActionRowBuilder().addComponents(id),
        new ActionRowBuilder().addComponents(vulgo),
        new ActionRowBuilder().addComponents(deep),
        new ActionRowBuilder().addComponents(telefone)
      );

      await interaction.showModal(modal);
    }
  }

  // MODAL
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'modal_registro') {
      try {
        const nome = interaction.fields.getTextInputValue('nome');
        const id = interaction.fields.getTextInputValue('id');
        const vulgo = interaction.fields.getTextInputValue('vulgo');
        const deep = interaction.fields.getTextInputValue('deep');
        const telefone = interaction.fields.getTextInputValue('telefone');

        const guild = interaction.guild;
        const member = interaction.member;

        // DAR CARGO
        const cargo = guild.roles.cache.get(CARGO_RECLUTA_ID);
        if (!cargo) throw new Error('Cargo não encontrado');
        await member.roles.add(cargo);

        // ALTERAR NICK
        await member.setNickname(`#${id}・${nome.toUpperCase()}`);

        // FORMATAR TELEFONE
        let tel = telefone.replace(/\D/g, '');
        if (tel.length >= 9) {
          tel = `(${tel.slice(0,3)}) ${tel.slice(3,6)}-${tel.slice(6,9)}`;
        }

        // CANAL REGISTRO
        const canalRegistro = guild.channels.cache.get(CANAL_REGISTRO_ID);
        if (!canalRegistro) throw new Error('Canal de registro não encontrado');

        // MENSAGEM FORMATADA (SEM DISCORD DO USUÁRIO)
        const mensagem =
          "📋 **BENVENUTI A LAURÈA**\n\n" +
          "```yaml\n" +
          `👤 NOME:        ${nome.toUpperCase()}\n` +
          `🆔 PASSAPORTE:  ${id.toUpperCase()}\n` +
          `📱 TELEFONE:    ${tel}\n` +
          `🌑 DEEP:        ${deep}\n` +
          `🏷️ VULGO:       ${vulgo}\n` +
          "```\n\n" +
          `💬 Discord: ${member.user.tag}`;

        await canalRegistro.send({ content: mensagem });

        await interaction.reply({
          content: '✅ Registro realizado com sucesso!',
          ephemeral: true
        });

      } catch (error) {
        console.error('❌ ERRO NO REGISTRO:', error);

        if (!interaction.replied) {
          await interaction.reply({
            content: '❌ Deu erro ao fazer registro. Verifique permissões ou IDs.',
            ephemeral: true
          });
        }
      }
    }
  }
});

// PAINEL
client.once(Events.ClientReady, async () => {
  const canal = client.channels.cache.get(CANAL_CADASTRO_ID);

  if (!canal) {
    console.log('❌ Canal de cadastro não encontrado');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('📦 Sistema de Registro LAUREA')
    .setDescription('Clique no botão abaixo para realizar seu registro no servidor.')
    .setFooter({ text: 'LAUREA RP' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('abrir_registro')
      .setLabel('Fazer Registro')
      .setStyle(ButtonStyle.Success)
  );

  await canal.send({ embeds: [embed], components: [row] });
});

client.login(TOKEN);
