const shell = require('shelljs')
/*eslint-disable */
const colors = require('colors')
/*eslint-enable */

const sanitizeDest = dest => dest ? dest.split(' ').map(x => x.trim().toLowerCase()).join('') : null
const sanitizeProjectName = name => name ? name.match(/[a-zA-Z0-9]/g).join('').toLowerCase() : null
const sanitizeFunctionName = name => name ? name.trim().split(' ').map(x => x.toLowerCase()).join('-') : null

exports.preQuestions = () => {}

exports.onTemplateLoaded = answers => `Congratulation! Your new ${answers.projectName.bold} project is ready.\nNext step: Run ${answers._dest ? `cd ${answers._dest}; npm install; npm run dev`.italic.bold : 'npm install'.italic.bold}`

exports.questions = [{
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// 						 1. PROJECT NAME 						 ///////////////////////////
	
	question: answers => `project name: ${answers._dest ? `(${sanitizeDest(answers._dest)}) ` : ''} `.cyan,
	answerName: 'projectName',
	defaultValue: answers => answers._dest,
	execute: {
		validate: answer => answer,
		onSuccess: answer => sanitizeProjectName(answer),
		onError: answer => `The project name is required.`
	},
	files: ['package.json']
},{
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// 						 2. PROJECT VERSION 					 ///////////////////////////
	
	question: () => 'project version: (1.0.0) '.cyan,
	answerName: 'projectVersion',
	defaultValue: () => '1.0.0',
	files: ['package.json']
},{
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// 						 3. FUNCTION NAME 						 ///////////////////////////
	
	skip: answers => true,
	question: answers => '',
	answerName: 'functionName',
	defaultValue: answers => answers.projectName,
	execute: {
	        onSuccess: answer => sanitizeFunctionName(answer)
	},
	files: ['now.json']
}]
