import emojiRegex from 'emoji-regex';

const SPACE_CHAR = '\u3000';

export const padEmojiStringToLength = (emoji = '', targetLength = 2) => {
  try {
    const regex = emojiRegex();
    const emojiCount = [...emoji.matchAll(regex)].length;
    return emojiCount < targetLength
      ? SPACE_CHAR.repeat(targetLength - emojiCount) + emoji
      : emoji;
  } catch {
    return emoji;
  }
};
