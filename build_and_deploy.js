const simpleGit = require('simple-git');

const main = async () => {
  const git = simpleGit();
  let status = await git.status();
  let currentBranch = status.current;

  console.log(status);
  return;

  if (currentBranch === 'develop') {
    console.log(JSON.stringify(`Working on branch: 'develop'`));
  } else {
    await git.checkout('develop');
    status = await git.status();
    currentBranch = status.current;
    console.log(`Switched to branch: '${currentBranch}'`);
  }
}

main();
