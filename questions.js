const shell = require('shelljs')
/*eslint-disable */
const colors = require('colors')
/*eslint-enable */

const sanitizeDest = dest => dest ? dest.split(' ').map(x => x.trim().toLowerCase()).join('') : null
const sanitizeProjectName = name => name ? name.split(' ').join('-') : null
const sanitizeEntryPoint = name => name ? name.split(' ').join('') : null
const sanitizeFunctionName = name => name ? name.trim().split(' ').map(x => x.toLowerCase()).join('-') : null
const sanitizeBucket = name => name ? name.trim().split(' ').map(x => x.toLowerCase()).join('-') : null
const TRIGGERS = { '1': '--trigger-http', '2': '--trigger-topic', '3': '--trigger-bucket' }

exports.preQuestions = () => {
	const gcloudNotInstalled = !shell.exec('which gcloud', {silent:true}).stdout
	const functionsNotInstalled = !shell.exec('which functions', {silent:true}).stdout
	if (gcloudNotInstalled) {
		console.log(
			`${'ERROR'.bold.italic}: The ${'gcloud SDK'.italic} seems to not be installed on your machine.\n`.yellow +
			'You won\'t be able to use your terminal to deploy this project to your Google Cloud Account or run it locally.\n'.yellow +
			`${'We recommend to install it (instructions here:'.yellow} ${'https://cloud.google.com/sdk/downloads'.underline.italic.blue}).\n`)
		/*eslint-disable */
        process.exit(1)
        /*eslint-enable */
	}
	if (functionsNotInstalled) {
		console.log(
			(`${'ERROR'.bold.italic}: ${'Google Function Emulator'.italic} seems to not be installed on your machine.\n` +
			'You won\'t be able to run this project on your local machine.\n' +
			`We recommend to install it globally: ${'npm install -g @google-cloud/functions-emulator'.bold.italic}\n`).yellow)
		/*eslint-disable */
        process.exit(1)
        /*eslint-enable */
	}
}

exports.questions = [{
	question: answers => `project name: ${answers._dest ? `(${sanitizeDest(answers._dest)}) ` : ''} `.cyan,
	answerName: 'projectName',
	defaultValue: answers => answers._dest,
	execute: {
		validate: null,
		onSuccess: answer => sanitizeProjectName(answer)
	},
	files: ['package.json']
},{
	question: () => 'project version: (1.0.0) '.cyan,
	answerName: 'projectVersion',
	defaultValue: () => '1.0.0',
	files: ['package.json']
},{
	question: answers => `Google Cloud Function name : (${sanitizeFunctionName(answers.projectName)}) `.cyan,
	answerName: 'functionName',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeFunctionName(answer)
	},
	files: ['appconfig.json']
},{
	question: () => ('Google Cloud Function trigger: \n' + 
					'  [1] HTTP \n' +
					'  [2] Pub/Sub \n' +
					'  [3] Storage \n' +
					'Choose one of the above: ([1]) ').cyan,
	answerName: 'trigger',
	defaultValue: () => 1,
	execute: {
		validate: answer => TRIGGERS[answer],
		onSuccess: answer => TRIGGERS[answer],
		onError: answer => `'${answer}' is not a valid trigger.`
	},
	files: ['appconfig.json']
},{
	question: answers => `Google Cloud Function entry-point (no spaces, no hyphens): (${sanitizeEntryPoint(answers.projectName)}) `.cyan,
	answerName: 'entryPoint',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeEntryPoint(answer)
	},
	files: ['index.js', 'appconfig.json']
},{
	question: answers => `Google Cloud Project: (${answers.projectName.toLowerCase()}) `.cyan,
	answerName: 'googleProject',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => answer.toLowerCase()
	},
	files: ['appconfig.json']
},{
	question: answers => `Google Cloud Function bucket: (${sanitizeBucket(answers.projectName)}) `.cyan,
	answerName: 'bucket',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeBucket(answer)
	},
	files: ['appconfig.json']
}]
