import { globalConfig, botConfig, debuggerConfig, dashboardConfig } from "@majoexe/config";
import { createErrorEmbed } from "@majoexe/util/embeds";
import { Logger } from "@majoexe/util/functions";
import chalk from "chalk";
import { Client, GatewayIntentBits, PermissionsBitField, Collection } from "discord.js";
import { globby } from "globby";
import giveaway from "../util/giveaway/core.js";
import { loadFonts } from "../util/images/fonts/loadFonts.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

if (process.versions.node.split(".")[0] < 18) {
 Logger("error", "Node version is below 18, please update your node version to 18 or above.");
 process.exit(1);
}

const cwd = dirname(fileURLToPath(import.meta.url)).replace("/client", "");
Logger("info", `Current working directory: ${cwd}`);
process.chdir(cwd);

Logger("info", "Starting Majo.exe Bot...");
Logger("info", `Running version v${process.env.npm_package_version} on Node.js ${process.version} on ${process.platform} ${process.arch}`);
Logger("info", "Check out the source code at https://github.com/igorkowalczyk/majo.exe! Don't forget to star the repository, it helps a lot!");

if (process.env.NODE_ENV !== "production") {
 Logger("warn", "This is a development version of Majo.exe. It may be unstable and may contain bugs. Use at your own risk!");
}

const client = new Client({
 intents: [
  // Prettier
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildMessageReactions,
 ],
});

// Add custom properties to client
client.slashCommands = new Collection();
client.modals = new Collection();
client.additionalSlashCommands = 0;

client.config = {
 ...botConfig,
 ...globalConfig,
 ...debuggerConfig,
 // Deprecated, to be replaced!
 dashboard: dashboardConfig,
};

client.giveawaysManager = giveaway(client);

client.errorMessages = {
 internalError: (interaction, error) => {
  Logger("error", error?.toString() ?? "Unknown error occured");
  const embed = createErrorEmbed("An error occured while executing this command. Please try again later.", "Unknown error occured");
  return interaction.followUp({ embeds: [embed], ephemeral: true });
 },
 createSlashError: (interaction, description, title) => {
  const embed = createErrorEmbed(description, title);
  embed.setFooter({
   text: `Requested by ${interaction.member.user.globalName || interaction.member.user.username}`,
   iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
  });

  return interaction.followUp({ embeds: [embed], ephemeral: true });
 },
};

client.debugger = Logger;
client.performance = (time) => {
 const run = Math.floor(performance.now() - time);
 return run > 500 ? chalk.underline.red(`${run}ms`) : chalk.underline(`${run}ms`);
};

const loadTime = performance.now();
const slashCommands = await globby(`${process.cwd()}/commands/**/*.js`);
for (const value of slashCommands) {
 try {
  const file = await import(value);

  const { default: slashCommand } = file;

  if (!slashCommand) {
   Logger("error", `Slash command ${value} doesn't have a default export!`);
   continue;
  }

  const { name, description, type, run, options, default_member_permissions } = slashCommand;

  if (!name || !description || !type || !run) {
   Logger("error", `Slash command ${value} is missing required properties!`);
   continue;
  }

  const category = value.split("/")[value.split("/").length - 2];

  const commandData = {
   ...slashCommand,
   category,
   options: options || null,
   /* eslint-disable-next-line camelcase */
   default_member_permissions: default_member_permissions ? PermissionsBitField.resolve(default_member_permissions).toString() : null,
  };

  client.slashCommands.set(name, commandData);

  if (options) {
   options.forEach((option) => {
    if (option.type === 1) {
     debuggerConfig.displayCommandList && Logger("info", `Loaded slash subcommand ${option.name} from ${value.replace(process.cwd(), "")}`);
     client.additionalSlashCommands++;
    }
   });
  }

  debuggerConfig.displayCommandList && Logger("info", `Loaded slash command ${name} from ${value.replace(process.cwd(), "")}`);
 } catch (error) {
  Logger("error", `Error loading slash command ${value}: ${error.message}`);
 }
}
Logger("event", `Loaded ${client.slashCommands.size + client.additionalSlashCommands} slash commands from /commands in ${client.performance(loadTime)}`);

const modalLoadTime = performance.now();
const modals = await globby(`${process.cwd()}/modals/**/*.js`);
for (const value of modals) {
 try {
  const file = await import(value);
  const { default: modal } = file;

  if (!modal) {
   Logger("error", `Modal ${value} doesn't have a default export!`);
   continue;
  }

  const { id, run } = modal;

  if (!id || !run) {
   Logger("error", `Modal ${value} is missing required properties!`);
   continue;
  }

  client.modals.set(id, modal);

  if (debuggerConfig.displayModalList) {
   Logger("info", `Loaded modal ${id} from ${value.replace(process.cwd(), "")}`);
  }
 } catch (error) {
  Logger("error", `Error loading modal ${value}: ${error.message}`);
 }
}
Logger("event", `Loaded ${client.modals.size} modals from /modals in ${client.performance(modalLoadTime)}`);

await loadFonts();

Logger("info", "Logging in...");

client.login(process.env.TOKEN);

export default client;
