<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';
	import { goto } from '$app/navigation';

	let emailInput = '',
		passInput = '';

	let passwordRequired = false,
		correctPassword = false,
		correctEmail = false;

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
							passwordrequired
						}
					}
				`
			});

			const account = (await myres).data.net_users_logins[0];

			if (account == undefined) {
				//if the account doesn't exist create a new account
				console.log("Account doesn't exist");
			} else if (account.passwordrequired == false) {
				//if it doesn't require a password
				correctEmail = true;
				correctPassword = true;
			} else {
				//if it requires a password
				correctEmail = true;
				passwordRequired = true; //makes the password textbox show up
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
						}
					}
				`
			});

			const account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account.password == passInput) {
				//if the password is correct
				correctPassword = true;
				console.log('correct password');
			} else {
				console.log('incorrect password');
				correctPassword = false;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function login() {
		if (correctEmail && correctPassword) {
			try {
				const myres = client.query({
					Method: 'POST',
					variables: {
						email: emailInput
					},
					query: gql`
						query login($email: citext!) {
							net_users_logins(where: { email: { _eq: $email } }) {
								loginid
							}
						}
					`
				});

				const account = (await myres).data.net_users_logins[0];
				// console.log(account);

				if (account) {
					console.log('logged in');
					goto(`/profile/${account.loginid}`); //goes to their profile with the loginid
				} else {
					console.log('login fail');
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
</script>

<div class="center">
	<h1>Login Page</h1>
	<div>
		<label for="emailInput">Email:</label>
		<input
			type="email"
			id="emailInput"
			required
			bind:value={emailInput}
			on:change={checkEmail}
			placeholder="example@gmail.com"
		/>
	</div>
	{#if passwordRequired}
		<div>
			<label for="passInput">Password:</label>
			<input type="password" id="passInput" bind:value={passInput} on:change={checkPassword} />
		</div>
	{/if}
	<button on:click={login}>Login</button>
	<div>
		Don't have an account? <a href="/signup">Sign up</a>
	</div>
</div>

<style>
	.center {
		margin: auto;
		width: 50%;
		padding: 15px;
		text-align: center;
	}
</style>
