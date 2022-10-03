export const wait = (sec = 1, opt: { failWithMessage?: string } = {}) =>
  new Promise((res, rej) =>
    setTimeout(
      opt?.failWithMessage ? () => rej({ message: opt.failWithMessage }) : res,
      sec,
    ),
  );
