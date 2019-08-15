#projj-move

> 基于[projj](https://github.com/popomore/projj)一键迁移工具。
> 
> One-key migration tool based on [projj](https://github.com/popomore/projj).


## Why？
 
 当你有很多项目需要迁移到projj管理时，一个一个的去add 这个举动太疯狂了

 When you have many projects to migrate to projj management, it's crazy to add one by one.
 
## Installation

`npm i projj-move -g`

## Configuration

新建一个config.js 文件。

Create a new `config.js` file.

`module.exports = {
  base: ['/Users/xxxx/code dir']
}`

> base 支持多目录
> base field support multiple directories

## Run

`projj-move -c [config file]`

 没有指定配置文件，则从当前目录读取`config.js`
 
 Read `config.js` from the current directory without specifying the configuration file
  
  
## FAQ

### 1、[(x) not .git or remote origin problem]

当前目录没有git初始化仓库或者没有指定remote

The current directory has no git initialization repository or remote is not specified

### 2、[migration error]

可能是重复迁移（既目录存在了）、可能是代码仓库找不到了（可能是迁移了）、可能是你没有仓库权限（权限被删除了）

Maybe it's a duplicate migration (the directory already exists), Maybe it's not found in the code repository (it's migrated), Maybe you don't have the repository privileges (the privileges are deleted).

### 3、[(x) remote repository problem]

 http的仓库需要输入账号名密码，建议单独迁移

HTTP's repository needs to enter account name and password, it is recommended to migrate separately
