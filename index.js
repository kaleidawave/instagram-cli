#!/usr/bin/env node

const chalk = require('chalk');
const {IgApiClient} = require('instagram-private-api');
const inquirer = require('inquirer');
const fs = require('fs');

async function run() {
    console.log(chalk.green('Instagram Upload Client'));

    let images = fs.readdirSync(process.cwd()).filter(value => value.endsWith('.jpg'));
    if(images.length === 0) {
        console.log(chalk.red('No JPG images found in the current directory'));
        return;
    }

    const questions = [
        { name: "USERNAME", type: "input", message: "Username:" },
        { name: "PASSWORD", type: "password", message: "Password:" },
        { name: "IMAGE", type: "list", message: "Image To Upload:", choices: images },
        { name: "CAPTION", type: "input", message: "Caption:" },
    ]

    const { USERNAME, PASSWORD, IMAGE, CAPTION } = await inquirer.prompt(questions);

    await upload(USERNAME, PASSWORD, IMAGE, CAPTION).then(() => {
        console.log(chalk.blue("Uploaded"));
    }).catch(console.log);

};

async function upload(username, password, image, caption) {
    const ig = new IgApiClient();

    ig.state.generateDevice(username);
    await ig.account.login(username, password);

    return ig.publish.photo({
        file: fs.readFileSync(image),
        caption
    }).then(() => {
        return ig.account.logout();
    });
}

run();