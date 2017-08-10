const shell = require('shelljs')
/*eslint-disable */
const colors = require('colors')
/*eslint-enable */

const sanitizeDest = dest => dest ? dest.split(' ').map(x => x.trim().toLowerCase()).join('') : null
const sanitizeProjectName = name => name ? name.split(' ').join('-') : null
const sanitizeEntryPoint = name => name ? name.split(' ').join('').replace('-','') : null
const sanitizeFunctionName = name => name ? name.trim().split(' ').map(x => x.toLowerCase()).join('-') : null
const sanitizeBucket = name => name ? name.trim().split(' ').map(x => x.toLowerCase()).join('-') : null
const TRIGGERS = { '1': '--trigger-http', '2': '--trigger-topic', '3': '--trigger-bucket' }
const HOSTING = { '1': 'googlecloud', '2': 'firebase' }

exports.preQuestions = () => {}

exports.onTemplateLoaded = answers => `Congratulation Master! Your new ${answers.projectName.bold} Web Server project hosted on ${answers.hosting == 'googlecloud' ? 'Google Cloud' : 'Firebase'} Function is ready.\nNext step: Run ${answers._dest ? `cd ${answers._dest}; npm install`.italic.bold : 'npm install'.italic.bold}`

exports.questions = [{
	question: answers => `project name: ${answers._dest ? `(${sanitizeDest(answers._dest)}) ` : ''} `.cyan,
	answerName: 'projectName',
	defaultValue: answers => answers._dest,
	execute: {
		validate: answer => answer,
		onSuccess: answer => sanitizeProjectName(answer),
		onError: answer => `Ooch ooch Master! The project name is required. Give it a slap again. Slap slap...`
	},
	files: ['package.json']
},{
	question: () => 'project version: (1.0.0) '.cyan,
	answerName: 'projectVersion',
	defaultValue: () => '1.0.0',
	files: ['package.json']
},{
	question: () => ('Hosting: \n' + 
					'  [1] Google Cloud Functions \n' +
					'  [2] Firebase Functions \n' +
					'Choose one of the above: ([1]) ').cyan,
	answerName: 'hosting',
	defaultValue: () => 1,
	execute: {
		validate: answer => HOSTING[answer],
		onSuccess: answer => HOSTING[answer],
		onError: answer => `'${answer}' is not a valid hosting option.`
	},
	files: ['appconfig.json']
},{
	skip: answers => answers.hosting == 'firebase',
	question: answers => `Google Cloud Function name : (${sanitizeFunctionName(answers.projectName)}) `.cyan,
	answerName: 'functionName',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeFunctionName(answer)
	},
	files: ['appconfig.json']
},
// {
// 	question: () => ('Google Cloud Function trigger: \n' + 
// 					'  [1] HTTP \n' +
// 					'  [2] Pub/Sub \n' +
// 					'  [3] Storage \n' +
// 					'Choose one of the above: ([1]) ').cyan,
// 	answerName: 'trigger',
// 	defaultValue: () => 1,
// 	execute: {
// 		validate: answer => TRIGGERS[answer],
// 		onSuccess: answer => TRIGGERS[answer],
// 		onError: answer => `'${answer}' is not a valid trigger.`
// 	},
// 	files: ['appconfig.json']
// },
{
	question: answers => `${answers.hosting == 'googlecloud' ? 'Google Cloud' : 'Firebase'} Function entry-point (no spaces, no hyphens): (${sanitizeEntryPoint(answers.projectName)}) `.cyan,
	answerName: 'entryPoint',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeEntryPoint(answer)
	},
	files: ['index.js', 'appconfig.json']
},{
	question: answers => `${answers.hosting == 'googlecloud' ? 'Google Cloud' : 'Firebase'} Project (If you're not sure, run ${answers.hosting == 'googlecloud' ? `'gcloud projects list'`.italic.bold : `'firebase list'`.italic.bold} to list all your available projects. If you're deploying locally, this question does not really matter): (${answers.projectName.toLowerCase()}) `.cyan,
	answerName: 'project',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => answer.toLowerCase()
	},
	files: ['appconfig.json']
},{
	skip: answers => answers.hosting == 'firebase',
	question: answers => `Google Cloud Function bucket: (${sanitizeBucket(answers.projectName)}) `.cyan,
	answerName: 'bucket',
	defaultValue: answers => answers.projectName,
	execute: {
		onSuccess: answer => sanitizeBucket(answer)
	},
	files: ['appconfig.json']
}]
