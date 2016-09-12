var childProcess = require('child_process');

module.exports = {
    libraryName: 'gorgon',
    libraryFullName: 'Gorgon',
    versionNumber: '0.0.1',
    versionName: 'Pre-Alpha',
    buildNumber: childProcess.execSync('git rev-list HEAD --count').toString().replace(/(\r\n|\n|\r)/gm,"")
};