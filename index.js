#!/usr/bin/env node

const chalk = require('chalk');
const instagram = require('instagram-private-api').V1;
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

function upload(username, password, image, caption) {
    let storage = new instagram.CookieFileStorage(__dirname + '/cookies.json');
    let device = new instagram.Device('Google Pixel');
    return instagram.Session.create(device, storage, username, password).then(async (session) => {
        return instagram.Upload.photo(session, image).then(function (upload) {
            return instagram.Media.configurePhoto(session, upload.params.uploadId, caption);
        }).catch(console.log);
    }).catch(console.log);
}

run();