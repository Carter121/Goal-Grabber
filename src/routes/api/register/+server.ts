import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const schoolReq = await pb.collection("school").getList(1, 1, {
		filter: `join_key = '${data.joinCode}'`,
	});

	const school = schoolReq.items[0];

	//* Don't allow user to create account with real school code
	if (!school) {
		return new Response(JSON.stringify({ body: "Join Code Not Found" }), {
			headers: { "content-type": "application/json" },
			status: 400,
		});
	}

	const newUser = {
		name: data.name,
		username: data.username,
		email: data.email,
		emailVisibility: false,
		password: data.password,
		passwordConfirm: data.passwordConfirm,
		school_id: data.joinCode,
		grade: parseInt(data.grade),
	};

	let newUserError = {};

	const user = await pb
		.collection("users")
		.create(newUser)
		.catch((e) => (newUserError = e.response.data));

	//* Alert user to account errors
	if (newUserError.password) {
		return new Response(
			JSON.stringify({
				body: "Password",
				data: newUserError.password.message,
			}),
			{
				headers: { "content-type": "application/json" },
				status: 400,
			}
		);
	}

	if (newUserError.passwordConfirm) {
		return new Response(
			JSON.stringify({
				body: "Password",
				data: newUserError.passwordConfirm.message,
			}),
			{
				headers: { "content-type": "application/json" },
				status: 400,
			}
		);
	}

	if (newUserError.username) {
		return new Response(
			JSON.stringify({
				body: "Username",
				data: newUserError.username.message,
			}),
			{
				headers: { "content-type": "application/json" },
				status: 400,
			}
		);
	}

	if (newUserError.email) {
		return new Response(
			JSON.stringify({
				body: "Email",
				data: newUserError.email.message,
			}),
			{
				headers: { "content-type": "application/json" },
				status: 400,
			}
		);
	}

	//* Add user to school
	school.users.push(user.id);

	pb.collection("school").update(school.id, school);

	return new Response(JSON.stringify({ body: "Confirm" }), {
		headers: { "content-type": "application/json" },
	});
}
