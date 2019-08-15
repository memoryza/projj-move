#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const defaultFilename = 'config.js';

module.exports = function (filename) {
  const filePath = path.join(__dirname, filename === true ? defaultFilename : filename);
  if (!fs.existsSync(filePath)) {
    return console.log(chalk.red(`[no file]: file: ${filePath } not found`));
  }

  const config = require(filePath);
  if (config.base && Array.isArray(config.base)) {
    config.base.forEach(dirPath => {
      fs.readdir(dirPath, { withFileTypes: true}, function (err, data) {
        if (err) return console.log(chalk.red(err));
        const projectList = data.filter(subPath => (subPath.isDirectory() && subPath.name.indexOf('.') !== 0))
        const projectNum = projectList.length;
        let successNum = 0;
        let traversedProjectNum = 0;
        let notGitRepositoryList = []; // 遍历将所有没有.git的文件夹记录
        let httpProjectList = []; // http gitlab projj add 过程中要输入账号密码
        projectList.forEach(subPath => {
            const projectPath = path.join(dirPath, subPath.name);
            exec(`cd ${projectPath} && git remote get-url --push origin`, function (error, stdout, stderr) {
              traversedProjectNum++;
              if (error) {
                notGitRepositoryList.push(subPath.name);
                if (traversedProjectNum === projectNum) {
                  console.log(chalk.yellow(`[${notGitRepositoryList.length} not .git or remote origin problem]: ${dirPath}/{${notGitRepositoryList.join(',')}} can't found .git dir`))
                }
                return;
              }
              const remoteOrigin = stdout.split('.git')[0];
              if (remoteOrigin.match(/^http:\/\//)) {
                httpProjectList.push(subPath.name);
                if (traversedProjectNum === projectNum) {
                  console.log(chalk.cyan(`[${httpProjectList.length} remote repository problem]: ${dirPath}/{${httpProjectList.join(',')}} can't migration for http repository`));
                }
                return;
              }
              if (traversedProjectNum === projectNum) {
                if (notGitRepositoryList.length) {
                  console.log(chalk.yellow(`[${notGitRepositoryList.length} dir not .git or remote origin problem]: ${dirPath}/{${notGitRepositoryList.join(',')}} can't found .git dir`))
                }
                if (httpProjectList.length) {
                  console.log(chalk.cyan(`[${httpProjectList.length} remote repository problem]: ${dirPath}/{${httpProjectList.join(',')}} can't migration for http repository`));
                }
              }
              if (remoteOrigin) {
                exec(`cd ${projectPath} && projj add ${remoteOrigin}.git`, function(error, stdout, stderr) {
                  if (error || stderr) return console.log(chalk.red(`[migration error]: ${projectPath} migration error: ${err || stderr}`));
                  console.log(chalk.green(`[${++successNum}/${projectNum}] ${projectPath} migration success`));
                });
              }
            });
        });
      });
    });
  } else {
    return console.log(chalk.red(`file: ${filePath} can not found base config`));
  }
}

