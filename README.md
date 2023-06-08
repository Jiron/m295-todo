# Modul 295 - ToDo API

The ToDo API for module 295 allows you to manage a ToDo application. It includes multiple endpoints for managing tasks, as well as a login system so users can have their individual tasks and passwords.

Make sure that you have [node.js](https://nodejs.org/en) installed before heading on.

## Author

Name: Manassés Zähnler

GitHub: https://github.com/Jiron

## Installing neccessary packages

To install all necessary packages, make sure that you have cloned the entire project, including the `package.json`. After that, simply run the command `npm i` or `npm install`

After the installations have been made, you can jump into the next step.

## Running the project

To run the project, I have already set up a few scripts. It's recommended that you open it inside the dev container. A guide for this can be found [here](https://containers.dev).

### Commands
After opening it in the dev container, you can then run the command `npm run start` from the root folder. You can start the project in the development environment through nodemon. For this, you'll have to set up nodemon (setup instructions and information [here](https://nodemon.io)) and then you're ready to run the `npm run dev` command.

There's also a command for eslint, in case you edit the code and want it to be formatted well. For this, use the `npm run lint` command and the code will be adjusted automatically if possible. If there are any errors left, they will be logged into the console after execution.

## After running the project...

...the console will log that the API is running on port 3000 and then you're ready to go. A full API documentation can be found under the path /api-docs (http://localhost:3000/api-docs)