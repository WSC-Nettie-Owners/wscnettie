# Nettie, A Networking Game

This project is a gamification of concepts from the Networking I, II, III, & IV classes at Wayne State College.

Check out the [current deployment!][Deployment]

---

## Outline

- [Nettie, A Networking Game](#nettie-a-networking-game)
	- [Outline](#outline)
		- [How to Contribute](#how-to-contribute)
		- [Deployment](#deployment)
			- [First Deployment - Main Branch](#first-deployment---main-branch)
			- [First Deployment - Staging Branch](#first-deployment---staging-branch)
		- [Concepts Covered](#concepts-covered)
		- [Minimum Viable Product](#minimum-viable-product)
		- [Hopes \& Dreams](#hopes--dreams)
		- [Further Documentation](#further-documentation)
		- [Commands](#commands)
		- [Dependencies](#dependencies)
		- [Visual Studio Code Extensions](#visual-studio-code-extensions)

---

### How to Contribute
<div name="how-to-contribute"/>

This section outlines how to contribute to this project.

1. Add your skills to your profile's README.
2. Become a collaborator on this project.
3. Clone this project to your local machine.
4. Request access to the environment variables.
5. Create a new branch from the `staging` branch.
6. Make changes to your branch.
7. Change the version number in `package.json`.
8. Push your branch to GitHub.
9. Create a pull request from your branch to the `staging` branch.
10. Wait for the pull request to be reviewed.
11. Merge the pull request.
12. Delete your branch.
13. Repeat steps 5-12.

---

### Deployment
<div name="deployment"/>

This section outlines how to deploy this project.

- Initial deployment was based on [this article][SvelteNgnixDockerDeployment].

#### First Deployment - Main Branch

1. Create a new Debian 13 based VM.
2. Install Docker on the VM.
3. Install Portainer on the VM. Make sure you have community edition.
4. Run the Portainer container.
5. Create a new stack in Portainer.
6. Select the GitHub Repository option.
7. Select the `main` branch.
8. Select the `docker-compose.yml` file.
9. Select the `automatic redeploy on push` option.
10. Select the `Deploy the stack` button.
11. Wait for the stack to deploy.
12. Point the domain to the VM's IP address.

#### First Deployment - Staging Branch

1. Use the same VM and Portainer container as above.
2. Create a new stack in Portainer.
3. Select the GitHub Repository option.
4. Select the `staging` branch.
5. Steps 9-11 are the same as above.
6. Create an OpenVPN Server on the VM.
7. Create a new user for the OpenVPN Server.
8. Download the OpenVPN Client.
9. Connect to the OpenVPN Server.
10. Add rerouting rules to the Staging Stack. 

---

### Concepts Covered
<div name="concepts-covered"/>

This section outlines what concepts will be covered in this project.

- [ ] MAC Addresses
- [ ] IP Addresses
- [ ] Subnetting
- [ ] OSI Model
- [ ] Header Questions
- [ ] Command Questions
- [ ] ANDing
- [ ] Magic Number

...Others to come

---

### Minimum Viable Product
<div name="minimum-viable-product"/>

This section outlines what this website has to at least accomplish to provide use to visitors.

Users are able to:

- [ ] Set up a username and include their email
- [ ] Change their username and email
- [ ] Login with their email, but no password
- [ ] Display recently added concepts broken down by level
- [ ] Choose flashcards based on level, concept, and amount
- [ ] Choose different types of games based on level and concept
- [ ] Choose quizzes based on level and concept
- [ ] Learn about this project in the About section
- [ ] Learn who to contact for this project

---

### Hopes & Dreams
<div name="hopes-dreams"/>

This section outlines what I hope to get to with this project.

---

### Further Documentation
<div name="documentation"/>

This will include information about how I would like this project to look and perhaps some resources that helped me along the way.

- [SvelteKit][SvelteKit] - This is the framework I'm using for this project. It's a lot like React, but it's a lot easier to use.

- [Svelte][Svelte] - This is the framework that SvelteKit is built on.

- [Vite][Vite] - This is the build tool that SvelteKit uses.

- [Apollo Client][ApolloClient] - This is the GraphQL client I'm using for this project.

- [GraphQL][GraphQL] - This is the query language I'm using for this project.

- [Markdown Cheatsheet][MarkdownCheatsheet] - This is a cheatsheet for Markdown. This is what I use to write this README and many others.

---

### Commands
<div name="commands"/>

This section outlines the commands I use to run this project.

- `nvm` This can be used to manage which version of npm is being used. This can be installed [here][nvm].

- `nvm install 19.5.0` Run this before running any of the following commands.

- `nvm use 19.5.0` Run this before running any of the following commands.

- `node -v` Check node version, verify you're on 19.5.0

- `npm install` - Installs the dependencies for this project.

- `npm run dev` - Runs a local version of the app
 
---

### Dependencies
<div name="dependencies"/>

This section outlines the dependencies I use for this project and the command used to install them. They should also be included in the `package.json` file.

YOU DON'T NEED TO ENTER THESE COMMANDS. `npm install` should install them for you.

- `@sveltejs/adapter-node` - Used for deploying with Node.js. Used in `svelte.config.js`.

- `@sveltejs/kit` - Used for SvelteKit. Used in `svelte.config.js`.

- `eslint` - Used for linting JavaScript. Pretty much checks for errors.

- `eslint-config-prettier` - Used for formatting Code.

- `eslint-plugin-svelte` - Used for linting Svelte.

- `prettier` - Used for formatting Code.

- `prettier-plugin-svelte` - Used for formatting Svelte.

- `svelte` - Used for Svelte.

- `vite` - Used for Vite.

- `@apollo/client` - Used for Apollo Client. To make GraphQL requests.

- `graphql` - Used for GraphQL statements. To make GraphQL requests.

- `svelte-apollo` - Used for Svelte Apollo. To make GraphQL requests.

- `svelte-icons-pack` - Used for Svelte Icons.

- `xlsx` - Used to read and write to Excel files.

---

### Visual Studio Code Extensions
<div name="vscode-extensions"/>

This section outlines the extensions I use for this project. These are very helpful for web-development.

- `ESLint` - Used for linting JavaScript.

- `Prettier` - Used for formatting Code.

- `GitHub Copilot` - Used for code suggestions. This is a must for programmers! Can be free with a student email address [here][GitHubEducation].

- `GitLens` - Used for git information. Makes it easier to Git blame people.

- `GitHub Repositories` - Used to see GitHub Repositories and their information.

- `Indent Rainbow` - Makes indentation easier to see.

- `Path Intellisense` - Gives path suggestions and autocompletion.

- `Code Spell Checker` - Used for spell checking.

- `Polacode` - Used for taking screenshots of code.

- `Import Cost` - Used for seeing the size of imports.

- `Highlight Matching Tag` - Used for highlighting matching tags.

- `Auto Rename Tag` - Used for renaming matching tags.

- `Auto Close Tag` - Used for closing matching tags.

- `Advanced New File` - Allows you to create new files in the current directory from the keyboard.

- `vscode-pets` - PETS!

- `WakaTime` - Used for tracking time spent on projects.

- `SynthWave '84` - A nice theme for VSCode.

- `Material Icon Theme` - Nice icons for VSCode.

- `Dotenv Official +Vault` - Used for .env files.

- `Edit csv` - Gives a table UI for CSV files.

- `Excel Viewer` - Gives a table UI for Excel files.

- `Markdown Preview GitHub Styling` - Used for Markdown files. You can use this to preview Markdown files.

- `markdownlint` - Used for linting Markdown files.

- `npm Intellisense` - Used for npm autocompletion in import statements.

- `Svelte for VS Code` - Used for Svelte.

- `Svelte 3 Snippets` - Used for Svelte.

- `Svelte Intellisense` - Used for Svelte.

- `VS Color Picker` - Used for picking colors in CSS.

- `Svelte Auto Import` - Used for Svelte.

[Deployment]: https://www.wscnettie.com
[GitHubEducation]: https://education.github.com/pack
[nvm]: https://github.com/coreybutler/nvm-windows/releases
[SvelteNgnixDockerDeployment]: https://myrmod.de/how-to-host-a-sveltekit-project-with-docker-https
[SvelteKit]: https://kit.svelte.dev/docs
[Svelte]: https://svelte.dev/docs
[Vite]: https://vitejs.dev/guide/
[ApolloClient]: https://www.apollographql.com/docs/react/
[GraphQL]: https://graphql.org/learn/
[MarkdownCheatsheet]: https://www.youtube.com/watch?v=pTCROLZLhDM
