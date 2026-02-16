import TelegramBot from 'node-telegram-bot-api';
import { supabaseAdmin } from '../utils/supabase';

let bot: TelegramBot | null = null;

export const initTelegramBot = (): void => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn('Telegram bot token not provided');
    return;
  }

  bot = new TelegramBot(token, { polling: true });

  // /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from?.username;

    bot!.sendMessage(
      chatId,
      `🍺⚔️ *Welcome to Tales of SlokBot!*\n\n` +
      `Register at the web app to start your adventure!\n\n` +
      `*Available Commands:*\n` +
      `/slokje @username [reason] - Give someone a slokje\n` +
      `/stats - View your stats\n` +
      `/leaderboard - View top players`,
      { parse_mode: 'Markdown' }
    );
  });

  // /slokje command - Main feature
  bot.onText(/\/slokje(?:\s+@?(\w+))?(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const giverUsername = msg.from?.username;
    const receiverUsername = match?.[1];
    const reason = match?.[2];

    if (!giverUsername) {
      bot!.sendMessage(chatId, '❌ You need a Telegram username to use this command.');
      return;
    }

    if (!receiverUsername) {
      bot!.sendMessage(
        chatId,
        '❌ Usage: /slokje @username [reason]\n\nExample: /slokje @john bad joke'
      );
      return;
    }

    try {
      // Get giver user
      const { data: giver } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('telegram_username', giverUsername)
        .single();

      if (!giver) {
        bot!.sendMessage(
          chatId,
          `❌ You need to register at the web app first!\n\nYour username: @${giverUsername}`
        );
        return;
      }

      // Get receiver user
      const { data: receiver } = await supabaseAdmin
        .from('users')
        .select('id, telegram_username')
        .eq('telegram_username', receiverUsername)
        .single();

      if (!receiver) {
        bot!.sendMessage(chatId, `❌ User @${receiverUsername} not found in the game.`);
        return;
      }

      // Prevent self-slokjes
      if (giver.id === receiver.id) {
        bot!.sendMessage(chatId, `❌ You can't give yourself a slokje! 😅`);
        return;
      }

      // Record slokje
      const { error } = await supabaseAdmin
        .from('slokjes')
        .insert({
          giver_id: giver.id,
          receiver_id: receiver.id,
          reason: reason || null
        });

      if (error) {
        throw error;
      }

      // Update counters
      await supabaseAdmin.rpc('increment', {
        table_name: 'users',
        column_name: 'slokjes_given',
        row_id: giver.id
      });

      await supabaseAdmin.rpc('increment', {
        table_name: 'users',
        column_name: 'slokjes_received',
        row_id: receiver.id
      });

      // Refresh leaderboards
      await supabaseAdmin.rpc('refresh_leaderboards');

      const reasonText = reason ? `\n📝 Reason: ${reason}` : '';
      bot!.sendMessage(
        chatId,
        `🍺 *Slokje Given!*\n\n@${giverUsername} → @${receiverUsername}${reasonText}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      console.error('Error giving slokje:', error);
      bot!.sendMessage(chatId, '❌ Failed to give slokje. Please try again.');
    }
  });

  // /stats command
  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from?.username;

    if (!username) {
      bot!.sendMessage(chatId, '❌ You need a Telegram username.');
      return;
    }

    try {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('*, characters(*)')
        .eq('telegram_username', username)
        .single();

      if (!user) {
        bot!.sendMessage(chatId, '❌ You need to register at the web app first!');
        return;
      }

      const character = user.characters?.[0];
      const statsText = character
        ? `⚔️ *${character.name}* - Level ${character.level}\n` +
          `📊 XP: ${character.xp}\n` +
          `🍺 Slokjes Given: ${user.slokjes_given}\n` +
          `🍺 Slokjes Received: ${user.slokjes_received}`
        : `🍺 Slokjes Given: ${user.slokjes_given}\n` +
          `🍺 Slokjes Received: ${user.slokjes_received}\n\n` +
          `💡 Create a character at the web app!`;

      bot!.sendMessage(chatId, statsText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error fetching stats:', error);
      bot!.sendMessage(chatId, '❌ Failed to fetch stats.');
    }
  });

  // /leaderboard command
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const { data: topSlokjes } = await supabaseAdmin
        .from('leaderboard_slokjes')
        .select('*')
        .limit(5);

      if (!topSlokjes || topSlokjes.length === 0) {
        bot!.sendMessage(chatId, '📊 No data yet!');
        return;
      }

      let leaderboardText = '🏆 *Top Slokjes Champions*\n\n';
      topSlokjes.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔸';
        leaderboardText += `${medal} @${entry.telegram_username}: ${entry.slokjes_received} slokjes\n`;
      });

      bot!.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      bot!.sendMessage(chatId, '❌ Failed to fetch leaderboard.');
    }
  });

  console.log('✅ Telegram bot started');
};

export const sendTelegramNotification = async (
  userId: string,
  message: string
): Promise<void> => {
  if (!bot) return;

  try {
    // Get user's Telegram chat ID (would need to store this during /start)
    // For now, this is a placeholder
    console.log(`Would send notification to user ${userId}: ${message}`);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

export default bot;
