/**
 * Copyright (c) 2017, Neap Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this gimpy template.
*/
const shell = require('shelljs')
const fs = require('fs')
/*eslint-disable */
const colors = require('colors')
/*eslint-enable */

const APPCONFIGPATH = './appconfig.json'
const updateAppConfigActive = (appconfig, env = 'default') => {
	if (appconfig && appconfig.env) {
		appconfig.env.active = env
		const fileContent = JSON.stringify(appconfig, null, '\t')
		fs.writeFileSync(APPCONFIGPATH, fileContent)
	}
}

const createFirebaserc = (env = 'default', project) => {
	const firebaserc = { projects: {}}
	firebaserc.projects[env] = project
	const fileContent = JSON.stringify(firebaserc, null, '\t')
	fs.writeFileSync('./.firebaserc', fileContent)
}

const deleteFirebaserc = () => {
	if (fs.existsSync('./.firebaserc'))
		fs.unlinkSync('./.firebaserc')
}

const exitIf = (exitCondition, exitMsg) => {
	if (exitCondition) {
		console.log(exitMsg.red)
		/*eslint-disable */
		process.exit()
		/*eslint-enable */
	}
}

const stopIfError = ({ stderr }, msg, ignore) => {
	if (stderr && (!ignore || stderr.indexOf(ignore) < 0)) {
		console.log(stderr.red)
		console.log(msg.red)
		/*eslint-disable */
		process.exit()
		/*eslint-enable */
	}
}

exports.deploy = (env = 'default') => {
	/*eslint-disable */
	if (process.platform == 'win32')
		/*eslint-enable */
		console.log(`${'WARNING'.italic.bold} - Oooch Master!!! I'm not yet fully compatible with Windows. I may crap myself...`.yellow)

	const startClock = Date.now()
	exitIf(!fs.existsSync(APPCONFIGPATH), 'Missing appconfig.json file. Naughty boy...')
	
	const appconfig =  require(APPCONFIGPATH)
	const environments = appconfig.env
	const hosting = appconfig.hosting

	exitIf(!environments, `${'appconfig.json'.italic.bold} is missing the ${'env'.italic.bold} property. Slap slap slap!!!`)
	exitIf(!hosting, `${'appconfig.json'.italic.bold} is missing the ${'hosting'.italic.bold} property. Add that property with one of those 2 values: googlecloud, firebase (e.g. "hosting": "googlecloud") or slap me more.`)
	exitIf(hosting != 'googlecloud' && hosting != 'firebase', `The value ${hosting.italic.bold} of the ${'hosting'.italic.bold} property in the ${'appconfig.json'.italic.bold} file is not valid. Choose one of the following 2 options: googlecloud or firebase. You can also spank me. Just saying...`)

	const config = environments[env]

	exitIf(!config, `${'appconfig.json'.italic.bold} does not define any ${env.italic.bold} property under its ${'env'.italic.bold} property.`)

	if (hosting == 'googlecloud') {
		const gcloudNotInstalled = !shell.exec('which gcloud', {silent:true}).stdout
		exitIf(gcloudNotInstalled, `${'gcloud SDK'.italic} seems to not be installed on your machine.\n\nYou won't be able to use your terminal to deploy this project to your Google Cloud Account or run it locally.\nInstall it (link:${'https://cloud.google.com/sdk/downloads'.underline.italic}). And then come back here and wip me more you dirty pet.`)
		exitIf(!config.trigger, `${'appconfig.json'.italic.bold} does not define any ${'trigger'.italic.bold} property under its ${env.italic.bold} environment. Who's been naughty here?!`)
		exitIf(!config.entryPoint, `${'appconfig.json'.italic.bold} does not define any ${'entryPoint'.italic.bold} property under its ${env.italic.bold} environment. Who's been naughty here?!`)

		if (env == 'default') { // Local environment. Make Sure the Google function emulator is running.
			const functionsNotInstalled = !shell.exec('which functions', {silent:true}).stdout
			exitIf(functionsNotInstalled, `${'Google Function Emulator'.italic} seems to not be installed on your machine. \n\nYou cannot run this project on your local machine. To install it globally, simply run the following: \n${'npm install -g @google-cloud/functions-emulator'.bold.italic}. And then come back here and wip me more you vile beast.`)

			const functionStatus = shell.exec('functions status', {silent:true}).stdout
			const functionsStopped = functionStatus.indexOf('│ STOPPED') > 0

			if (functionsStopped) {
				console.log('No emulator running. Time get my whip slapping and get this dirty pig working!'.cyan)
				shell.exec('functions start')
			}

			updateAppConfigActive(appconfig, 'default')

			console.log(`${'LOCALLY'.italic.bold} deploying entry-point ${config.entryPoint.italic.bold} using trigger type ${config.trigger.italic.bold}. Slap slap!!!`.cyan)
			const deployLocallyCommand = `functions deploy ${config.entryPoint} ${config.trigger}`
			stopIfError(
				shell.exec(deployLocallyCommand), 
				`Naughty gimp!!! The ${deployLocallyCommand.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`
			)
		}
		else {
			exitIf(!config.functionName, `${'appconfig.json'.italic.bold} does not define any ${'functionName'.italic.bold} property under its ${env.italic.bold} environment. Spanking time!`)
			exitIf(!config.project, `${'appconfig.json'.italic.bold} does not define any ${'project'.italic.bold} property under its ${env.italic.bold} environment. Bam bam boom boom!`)
			exitIf(!config.bucket, `${'appconfig.json'.italic.bold} does not define any ${'bucket'.italic.bold} property under its ${env.italic.bold} environment. Go back to your box you gimp!`)

			updateAppConfigActive(appconfig, env)

			console.log(`Deploying entry-point ${config.entryPoint.italic.bold} to ${`GOOGLE CLOUD FUNCTION ${config.functionName}`.italic.bold} located in project ${config.project.italic.bold} using trigger type ${config.trigger.italic.bold}. Time to get the public humiliation started my gimp.`.cyan)
			const settingProjectCommand = `gcloud config set project ${config.project}`
			stopIfError(
				shell.exec(settingProjectCommand),
				`Naughty gimp!!! The ${settingProjectCommand.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`,
				`Updated property`
			)
			const deployCommand = `gcloud beta functions deploy ${config.functionName} --stage-bucket ${config.bucket} ${config.trigger} --entry-point ${config.entryPoint}`
			stopIfError(
				shell.exec(deployCommand),
				`Naughty gimp!!! The ${deployCommand.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`,
				`Deploying function (may take a while`
			)
		}

		console.log(`Deployment successful (${(Date.now() - startClock)/1000} sec.). I'm proud gimp. We didn't use the safety word at the end. I'll be harsher next time!`.green)
	}
	else {
		exitIf(!config.project, `${'appconfig.json'.italic.bold} does not define any ${'project'.italic.bold} property under its ${env.italic.bold} environment.`)
		if (env == 'default') { // Local environment. Make Sure the Google function emulator is running.
			const firbaseToolsNotInstalled = !shell.exec('which firebase', {silent:true}).stdout
			exitIf(firbaseToolsNotInstalled, `${'firebase-tools'.italic} seems to not be installed on your machine. \n\nYou cannot run this project on your local machine or even deploy it to firebase. To install it globally, simply run the following: \n${'npm install -g firebase-tools'.bold.italic}`)

			updateAppConfigActive(appconfig, 'default')
			createFirebaserc(env, config.project)

			try {
				/*eslint-disable */
				process.on('SIGINT', () => deleteFirebaserc())
				/*eslint-enable */
				console.log(`${'LOCALLY'.italic.bold} deploying entry-point ${config.entryPoint.italic.bold} using trigger type ${'HTTP'.italic.bold}.`.cyan)
				const firebaseSwitchProjectCmd = `firebase use ${config.project}`
				stopIfError(
					shell.exec(firebaseSwitchProjectCmd),
					`Naughty gimp!!! The ${firebaseSwitchProjectCmd.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`
				)
				const firebaseServeLocallyCmd = 'firebase serve --only functions'
				stopIfError(
					shell.exec(firebaseServeLocallyCmd),
					`Naughty gimp!!! The ${firebaseServeLocallyCmd.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`
				)	
			}
			catch(err) {
				console.log('Local server has stopped'.magenta)
			}
			finally {
				deleteFirebaserc()
			}
		}
		else {
			updateAppConfigActive(appconfig, env)
			createFirebaserc(env, config.project)

			try {
				console.log(`Deploying entry-point ${config.entryPoint.italic.bold} to ${'FIREBASE'.italic.bold} located in project ${config.project.italic.bold} using trigger type ${'HTTP'.italic.bold}`.cyan)
				const firebaseSwitchProjectCmd = `firebase use ${config.project}`
				stopIfError(
					shell.exec(firebaseSwitchProjectCmd),
					`Naughty gimp!!! The ${firebaseSwitchProjectCmd.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`
				)
				const firebaseDeployCmd = 'firebase deploy --only functions'
				stopIfError(
					shell.exec(firebaseDeployCmd),
					`Naughty gimp!!! The ${firebaseDeployCmd.italic.bold} command crapped itself. Have a look above for more details. Fix it or I'll spank you again!`
				)

				console.log(`Deployment successful (${(Date.now() - startClock)/1000} sec.). I'm proud gimp. We didn't use the safety word at the end. I'll be harsher next time!`.green)
			}
			catch(err) { 
				console.log('Oops! Sorry but something went wrong Master!'.red)
			}
			finally {
				deleteFirebaserc()
			}
		}
	}
}
