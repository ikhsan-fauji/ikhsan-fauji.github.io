export default (url) => {
  if (!url) return './images/team_logo.svg';
  return url.replace(/^http:\/\//i, 'https://');
}