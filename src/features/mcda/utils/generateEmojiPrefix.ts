import emojiRegex from 'emoji-regex';

export const generateEmojiPrefix = (emoji = '') => {
  try {
    const regex = emojiRegex();
    const emojiCount = [...emoji.matchAll(regex)].length;
    return emojiCount === 1 ? `\u3000\u00A0\u00A0${emoji}` : `${emoji}`;
  } catch {
    return '';
  }
};
