import GitHubCorners from '@uiw/react-github-corners';

export default ({ children }) => (
  <>
    {children}
    <GitHubCorners
      size={40}
      href="https://github.com/konturio/disaster-ninja-fe"
    />
  </>
);
