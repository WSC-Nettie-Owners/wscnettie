<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';
	import { page } from '$app/stores';
	import Admin from './Admin.svelte';

	const loginID = $page.params.profileid;

	let isAdmin = false;

	async function checkForAdmin() {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					loginid: loginID
				},
				query: gql`
					query checkAccountForAdmin($loginid: uuid!) {
						net_users_logins(where: { loginid: { _eq: $loginid } }) {
							passwordrequired
						}
					}
				`
			});

			const myresWhy = await myres;

			return await myresWhy.data.net_users_logins[0].passwordrequired;
		} catch (err) {
			console.log(err);
		}
	}

	let username = '';

	async function getUsername() {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					loginid: loginID
				},
				query: gql`
					query getAccountUsername($loginid: uuid!) {
						net_users_logins(where: { loginid: { _eq: $loginid } }) {
							username
						}
					}
				`
			});

			const myresWhy = await myres;

			return await myresWhy.data.net_users_logins[0].username;
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		username = await getUsername();
		isAdmin = await checkForAdmin();
	});
</script>

<h1>Hello {username}</h1>

{#if isAdmin}
	<h2>Admin</h2>
	<Admin />
{:else}
	<h2>Not Admin</h2>
{/if}
