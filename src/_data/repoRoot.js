// Absolute path of the repo on the build machine. Used by the dev-only
// "Open in VS Code" button so the browser can hand VS Code an absolute path.
// Harmless in production: the button only appears on localhost.
module.exports = () => process.cwd();
