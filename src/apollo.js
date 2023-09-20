import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

const client = createApolloClient();

function createApolloClient() {
	const link = new HttpLink({
		uri: import.meta.env.VITE_HASURA_URI,
		headers: {
			'x-hasura-admin-secret': import.meta.env.VITE_HASURA_VALUE
		}
	});

	const cache = new InMemoryCache();

	const client = new ApolloClient({
		link,
		cache
	});

	return client;
}

export default client;
