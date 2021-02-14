const simpleGit = require('simple-git');

const main = async () => {
  const git = simpleGit();
  let status = await git.status();
  let currentBranch = status.current;

  if(status.modified.length) {
    console.log('Cannot continue: You have uncommited files.');
    return;
  }

  console.log('Starting build...');
  
  if (currentBranch === 'master') {
    console.log(JSON.stringify(`Working on 'master' branch.`));
  } else {
    await git.checkout('master');
    status = await git.status();
    currentBranch = status.current;
    console.log(`Switched to '${currentBranch}' branch.`);
  }

  console.log(`Pulling from 'develop' branch...`);

  await git.merge('develop');
}

main();
