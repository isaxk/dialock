export const load = async ({ url }) => {
	const afterUnlock = url.searchParams.get('afterUnlock');
	return { url: url.pathname, afterUnlock };
};
