const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');

const main = async () => {
  const git = simpleGit();
  let status = await git.status();
  let currentBranch = status.current;

  if(currentBranch !== 'develop') {
    console.error(`Cannot continue: You must run from the 'develop' branch.`);
    return;
  }
  
  if(status.modified.length) {
    console.error('Cannot continue: You have uncommited files.');
    return;
  }

  console.log(`Pushing any changes to 'origin' 'develop'...`);
  await git.push();

  console.log('Starting build...');
  
  if (currentBranch === 'master') {
    console.log(JSON.stringify(`Working on 'master' branch.`));
  } else {
    await git.checkout('master');
    status = await git.status();
    currentBranch = status.current;
    console.log(`Switched to '${currentBranch}' branch.`);
  }

  console.log(`Pulling from branch 'develop'...`);
  await git.pull('origin', 'develop');

  const cwd = path.resolve('./application');
  console.log(`Creating build from ${cwd}...`);

  try {
    const buildOutput = await createBuild(cwd);
    console.log(buildOutput);
  } catch (error) {
    console.error(error);
    return;
  }

  console.log('pasa');
}

function createBuild(cwd) {
  let output = null;
  let success = false;

  return new Promise((resolve, reject) => {
    const process = exec('npm run build', { cwd });
    
    process.stdout.on('data', data => {
      output += data.toString();
      if(output.includes('Compiled successfully')) {
        success = true;
      }
    });
    
    process.stdout.on('close', () => {
      if(success) {
        return resolve('Build created successfully.');
      }
      
      console.log(output);
      return reject(`Build failed.`)
    });
  });
}

main();
