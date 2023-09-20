<script>
	// FEEL FREE TO TAKE WHATEVER YOU NEED FROM THIS FILE AND USE IT IN +page.svelte
	// THIS FILE WON'T BE USED IN THE FINAL PRODUCT, JUST A REFERENCE FOR YOU TO USE

	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';

	let emailInput = '',
		usernameInput = '',
		passwordInput = '';

	let emailRes = {},
		usernameRes = {},
		passwordRes = {};

	async function checkEmail(email) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email
				},
				query: gql`
					query checkEmail($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							username
							passwordrequired
						}
					}
				`
			});

			emailRes = (await myres).data.net_users_logins[0];

			return (await myres).data.net_users_logins[0];
		} catch (err) {
			console.log(err);
		}
	}

	async function checkUsername(username) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					username: username
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}

	async function addAccount(email, username) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email,
					username: username
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}

	async function checkPassword(email, username, password) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email,
					username: username,
					password: password
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}
</script>

<h1>Login Page</h1>
<form>
	<input type="text" required for="email" value={emailInput} />
	{#if !!checkEmail(emailInput)}
		{alert('Email not found, you will be creating an account')}
		<input type="text" required for="username" value={usernameInput} />
		{#if checkUsername(usernameInput)}
			{alert('Username already exists, please choose another')}
		{:else}
			{addAccount(emailInput, usernameInput)}
		{/if}
	{:else if emailRes.passwordrequired == true}
		{alert('Password is required')}
		<input type="password" required for="password" value={passwordInput} />
		{#if checkPassword(emailInput, usernameInput, passwordInput)}
			{alert('Incorrect password')}
		{:else}
			{alert('Login successful')}
		{/if}
	{:else}
		{alert('Login successful')}
	{/if}
</form>

<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';

	let emailInput = '',
		userInput = '',
		passInput = '';

	let account = {};

	async function getAccount() {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: emailInput
				},
				query: gql`
					query getAccount($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							email
							password
							username
							passwordrequired
						}
					}
				`
			});

			account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account == undefined) {
				//if the account doesn't exist
				console.log('Create new account');
			} else if (account.username == userInput) {
				//if the userinput matches the account
				if (account.passwordrequired == false) {
					//if it doesn't require a password
					console.log('signed in!');
				} else {
					//if it requires a password
					if (account.password == passInput) {
						console.log('signed in!');
					} else {
						console.log('incorrect password');
					}
				}
			} else {
				console.log('wrong username');
			}
		} catch (err) {
			console.log(err);
		}
	}

	const handleClick = () => {
		//these get the text box value
		userInput = document.getElementById('userInput').value;
		emailInput = document.getElementById('emailInput').value;
		passInput = document.getElementById('passInput').value;
		getAccount();
		// login();
	};

	//main function that calls the other functions in order
	function login() {
		console.log(userInput, emailInput, passInput);
	}
</script>

<h1>Login Page</h1>
<form on:submit={handleClick}>
	<div>
		<label for="emailInput">Email:</label>
		<input type="email" id="emailInput" required value={emailInput} />
	</div>
	<div>
		<label for="userInput">Username:</label>
		<input type="text" id="userInput" required value={userInput} />
	</div>
	<div>
		<label for="passInput">Password:</label>
		<input type="password" id="passInput" value={passInput} />
	</div>

	<button type="submit">Submit</button>
</form>

