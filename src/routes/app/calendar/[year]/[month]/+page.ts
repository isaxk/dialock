export const load = async ({ params }) => {
	const { year, month } = params;

	return {
		year: parseInt(year),
		month: parseInt(month)
	};
};
