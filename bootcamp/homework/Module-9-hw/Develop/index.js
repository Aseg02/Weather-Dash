// TODO: Include packages needed for this application

// TODO: Create an array of questions for user input
//const questions = [];

// TODO: Create a function to write README file
//function writeToFile(fileName, data) {}

// TODO: Create a function to initialize app
//function init() {}

// Function call to initialize app
//init();


const inquirer = require('inquirer');
const fs = require ('fs')
const generateMarkdown = require('./utils/generateMarkdown')
inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the title of your project?',
      name: 'title',
    },
    {
      type: 'description',
      message: 'What is the description of your project?',
      name: 'description',
    },
    {
      type: 'installation',
      message: 'How do you install and run the project?',
      name: 'install',
    },
    {
      type: 'input',
      message: 'How to use this project?',
      name: 'Instructions',
    },
    {
      type: 'input',
      message: 'Does your project have a license?',
      name: 'License',
    },
    {
      type: 'input',
      message: 'Does your project have any badges?',
      name: 'badges',
    },
  ])
    .then((response) => {
      console.log(response);
      var markdown = generateMarkdown(response);
fs.writeFileSync ('README.md', markdown);    
});

