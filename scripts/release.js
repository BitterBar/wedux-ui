const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');
const { exec, execInteractive } = require('./utils');

const pkgPath = path.resolve(__dirname, '../package.json');
const getPkg = () => JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const currentVersion = getPkg().version;

let versionUpdated = false;

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    dry: { type: 'boolean' },
    tag: { type: 'string' },
    skipBuild: { type: 'boolean' },
    skipGit: { type: 'boolean' },
    skipPrompts: { type: 'boolean' },
    registry: { type: 'string' },
  },
});

const isDryRun = args.dry;

const run = async (bin, runArgs, opts = {}) => execInteractive(bin, runArgs, opts);

const dryRun = async (bin, runArgs, opts = {}) =>
  console.log(`\x1b[34m[dryrun] ${bin} ${runArgs.join(' ')}\x1b[0m`, opts);

const runIfNotDry = isDryRun ? dryRun : run;

const step = (msg) => console.log(`\x1b[36m${msg}\x1b[0m`);

const versionIncrements = ['patch', 'minor', 'major'];

const inc = (i) => {
  const parts = currentVersion.split('.').map(Number);
  if (i === 'patch') {
    parts[2]++;
  } else if (i === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else if (i === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  }
  return parts.join('.');
};

const prompt = async (message, choices) => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (choices) {
      console.log();
      choices.forEach((c, i) => console.log(`  ${i + 1}) ${c}`));
      rl.question(`\n${message} `, (answer) => {
        rl.close();
        const idx = parseInt(answer, 10) - 1;
        resolve(choices[idx] || answer);
      });
    } else {
      rl.question(`${message} `, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
};

const confirm = async (message) => {
  const answer = await prompt(`${message} (y/n)`);
  return answer === 'y' || answer === 'Y';
};

const updateVersion = (version) => {
  const pkg = getPkg();
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
};

async function main() {
  let targetVersion = positionals[0];

  if (!targetVersion) {
    const choices = versionIncrements.map((i) => `${i} (${inc(i)})`);
    choices.push('custom');

    const release = await prompt('Select release type:', choices);

    if (release === 'custom') {
      targetVersion = await prompt(`Input custom version (current: ${currentVersion}):`);
    } else {
      targetVersion = release.match(/\((.*)\)/)?.[1] ?? '';
    }
  }

  if (!/^\d+\.\d+\.\d+/.test(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`);
  }

  if (!args.skipPrompts) {
    const yes = await confirm(`Releasing v${targetVersion}. Confirm?`);
    if (!yes) return;
  }

  // build
  if (!args.skipBuild) {
    step('\nBuilding...');
    await run('node', [path.resolve(__dirname, 'build.js')]);
  }

  // update version
  step('\nUpdating version...');
  updateVersion(targetVersion);
  versionUpdated = true;

  if (!args.skipGit) {
    const { stdout } = await exec('git', ['diff']);
    if (stdout) {
      step('\nCommitting changes...');
      await runIfNotDry('git', ['add', '-A']);
      await runIfNotDry('git', ['commit', '-m', `"release: v${targetVersion}"`]);
    } else {
      console.log('No changes to commit.');
    }
  }

  // publish
  step('\nPublishing...');
  const publishArgs = [
    'publish',
    '--access',
    'public',
    ...(args.tag ? ['--tag', args.tag] : []),
    ...(args.registry ? ['--registry', args.registry] : []),
    ...(isDryRun ? ['--dry-run'] : []),
    ...(isDryRun || args.skipGit ? ['--no-git-checks'] : []),
  ];
  await run('pnpm', publishArgs);
  console.log(`\x1b[32mSuccessfully published wedux-ui@${targetVersion}\x1b[0m`);

  // git tag & push
  if (!args.skipGit) {
    step('\nPushing to remote...');
    await runIfNotDry('git', ['tag', `v${targetVersion}`]);
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
    await runIfNotDry('git', ['push']);
  }

  if (isDryRun) {
    console.log('\nDry run finished - run git diff to see package changes.');
  }

  console.log();
}

main().catch((err) => {
  if (versionUpdated) {
    updateVersion(currentVersion);
  }
  console.error(err);
  process.exit(1);
});
