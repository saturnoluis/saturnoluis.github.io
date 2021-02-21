const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');

const APP_DIR = path.resolve('./application');
const ROOT = path.resolve('./');

const main = async () => {
  const git = simpleGit();
  
  console.log('Starting build...');
  
  // let status = await git.status();
  // if(status.current !== 'develop') {
  //   console.error(`Error: You must run from the 'develop' branch.`);
  //   return;
  // }
  
  // if(status.files.length) {
  //   console.error(`Error: Uncommited changes in '${status.current}'.`);
  //   return;
  // }

  // console.log(`Pushing changes to 'origin develop'...`);
  // await git.push();
  
  // await git.checkout('master');
  
  // status = await git.status();
  // if (status.current !== 'master') {
  //   console.error(`Error: '${status.current}' is not master.`);
  //   return;
  // }

  // if(status.files.length) {
  //   console.error(`Error: Uncommited changes in '${status.current}'.`);
  //   return;
  // }

  // console.log(`Pulling from 'origin develop'...`);
  // await git.pull('origin', 'develop');

  // console.log(`\nCreating build from ${APP_DIR}...`);
  // try {
  //   const output = await createBuild();
  //   console.log(output);
  // } catch (error) {
  //   console.error(error);
  //   return;
  // }

  // console.log('\nCopying static files...');
  // const output = await copyStaticFiles();
  // console.log(output);

  status = await git.status();
  if(!status.files.length) {
    console.error('Error: No files to commit.');
    return;
  }

  console.log('\nCreating commit for the following files...');
  const files = status.files.map(file => {
    console.log(`* ${file.path}`);
    return file.path;
  });

  await git.add(files);

  status = await git.status();
  if(!status.staged.length) {
    console.error('Error: No staged files.');
    return;
  }

  const date = new Date();
  const today = date.toDateString();

  await git.commit(`Release ${today}`);

  status = await git.status();
  if(status.files.length) {
    console.error(`Error: Uncommited changes in '${status.current}'.`);
    return;
  }

  console.log('\nPushing changes...');
  await git.push();

  console.log('\nFinished :)')
}

function createBuild() {
  let output = '';
  let success = false;

  return new Promise((resolve, reject) => {
    const process = exec('npm run build', { cwd: APP_DIR });
    
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

function copyStaticFiles() {
  const buildFolder = path.join(APP_DIR, 'build');
  const copyCommand = `cp -rf ${buildFolder}/* ${ROOT}`;
  console.log(copyCommand);

  return new Promise(resolve => {
    const process = exec(copyCommand);
    
    process.stdout.on('data', data => {
      console.log(data.toString());
    });
    
    process.stdout.on('close', () => {
      resolve('Static files copied successfully.');
    });
  });
}

main();
