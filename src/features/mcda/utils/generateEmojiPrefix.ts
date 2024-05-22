import emojiRegex from 'emoji-regex';

export const generateEmojiPrefix = (emoji = '') => {
  const regex = emojiRegex();
  const emojiCount = [...emoji.matchAll(regex)].length;
  const result = emojiCount === 1 ? `\u3000\u00A0\u00A0${emoji}` : `${emoji}`;
  return result;
};
