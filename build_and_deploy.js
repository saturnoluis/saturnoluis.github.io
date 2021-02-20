const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');

const APP_DIR = path.resolve('./application');

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

  console.log(`Pushing changes to 'origin develop'...`);
  await git.push();

  console.log('Starting build...');
  
  await git.checkout('master');
  status = await git.status();
  currentBranch = status.current;

  if (currentBranch === 'master') {
    console.log(`Switched to 'master' branch.`);
    console.log(`Pulling from 'origin develop'...`);
    await git.pull('origin', 'develop');
  } else {
    console.error(`'${currentBranch}' is not the correct branch.`);
    return;
  }

  console.log(`Creating build from ${APP_DIR}...`);

  try {
    const output = await createBuild(APP_DIR);
    console.log(output);
  } catch (error) {
    console.error(error);
    return;
  }

  console.log('Copying static files...');
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
