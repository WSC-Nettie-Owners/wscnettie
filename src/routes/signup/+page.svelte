<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';
	import { goto } from '$app/navigation';

	let emailInput = '',
		userInput = '';

	let newEmail = false,
		newUsername = false;

	async function checkEmail() {
		//gets the account that matches emailInput from the user
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: emailInput
				},
				query: gql`
					query checkEmail($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							email
						}
					}
				`
			});

			const account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account != undefined) {
				console.log('account already exists');
			} else {
				newEmail = true;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function addAccount() {
		//adds a new account if the emailInput is not found in getAccount and if the username the user inputed is not already used
		if (newEmail && newUsername) {
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
				newUsername = true;
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<form class="center">
	<h1>Sign up</h1>
	<div>
		<label for="emailInput">Email:</label>
		<input
			type="email"
			id="emailInput"
			required
			placeholder="example@gmail.com"
			bind:value={emailInput}
			on:change={checkEmail}
		/>
	</div>
	<div>
		<label for="userInput">Username:</label>
		<input
			type="text"
			id="userInput"
			required
			placeholder="username"
			bind:value={userInput}
			on:change={checkUsername}
		/>
	</div>
	<button on:click={addAccount}>Create Account!</button>
    <div>
        Already have an account? <a href="/login">Login</a>
    </div>
</form>

<style>
	.center {
		margin: auto;
		width: 50%;
		padding: 15px;
		text-align: center;
	}
</style>
