<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';
	import { goto } from '$app/navigation';

	let emailInput = '',
		userInput = '',
		passInput = '';

	let passwordRequired = false,
		newAccount = false;

	async function getAccount() {
		//gets the account that matches emailInput from the user
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: emailInput
				},
				query: gql`
					query getAccount($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							passwordrequired
							loginid
						}
					}
				`
			});

			const account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account == undefined) {
				//if the account doesn't exist create a new account
				console.log('Create new account');
				newAccount = true; //this makes it so the username textbox shows up
			} else if (account.passwordrequired == false) {
				//if it doesn't require a password
				console.log('signed in!');
				goto(`/profile/${account.loginid}`); //goes to their profile with the loginid
			} else {
				//if it requires a password
				passwordRequired = true; //makes the password textbox show up
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function addAccount() {
		//adds a new account if the emailInput is not found in getAccount and if the username the user inputed is not already used
		try {
			const myres = client.mutate({
				Method: 'POST',
				variables: {
					email: emailInput,
					username: userInput
				},
				mutation: gql`
					mutation addAccount($email: citext!, $username: name!) {
						insert_net_users_logins(objects: { email: $email, username: $username }) {
							returning {
								username
								loginid
							}
						}
					}
				`
			});

			const addAccountRes = (await myres).data.insert_net_users_logins.returning[0];

			//if adding the account was successful
			if (addAccountRes) {
				console.log('account created');
				goto(`/profile/${addAccountRes.loginid}`); //goes to their profile with the loginid
			} else {
				console.log('account creation failed');
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function checkUsername() {
		//checks to see if the userInput is already used by a different account
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					username: userInput
				},
				query: gql`
					query checkUsername($username: name!) {
						net_users_logins(where: { username: { _eq: $username } }) {
							username
							loginid
						}
					}
				`
			});

			const usernameRes = (await myres).data.net_users_logins[0];

			if (usernameRes) {
				//if there was an account found don't add new account
				console.log('Username already exists');
			} else {
				//if there wasn't an account found addAccount
				addAccount();
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function checkPassword() {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: emailInput
				},
				query: gql`
					query checkPassword($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							password
							loginid
						}
					}
				`
			});

			const account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account.password == passInput) {
				//if the password is correct
				console.log('signed in!');
				goto(`/profile/${account.loginid}`); //goes to their profile with the loginid
			} else {
				console.log('incorrect password');
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<div class="center">
	<h1>Login Page</h1>
	<div>
		<label for="emailInput">Email:</label>
		<input type="email" id="emailInput" required bind:value={emailInput} on:change={getAccount} />
	</div>
	{#if newAccount}
		<div>
			<label for="userInput">Username:</label>
			<input type="text" id="userInput" required bind:value={userInput} on:change={checkUsername} />
		</div>
	{/if}
	{#if passwordRequired}
		<div>
			<label for="passInput">Password:</label>
			<input type="password" id="passInput" bind:value={passInput} on:change={checkPassword} />
		</div>
	{/if}
</div>

<style>
	.center {
		margin: auto;
		width: 50%;
		padding: 15px;
		text-align: center;
	}
</style>
