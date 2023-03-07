import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const schoolReq = await pb.collection("school").getList(1, 1, {
		filter: `join_key = '${data.school_id}'`,
	});

	const school = schoolReq.items[0];

	let isInSchool = false;

	for (let i = 0; i < school.users.length; i++) {
		if (data.id == school.users[i] || data.id == school.admin) {
			isInSchool = true;
			break;
		}
	}

	if (!isInSchool) {
		return new Response(JSON.stringify({ body: "Not in school" }), {
			headers: { "content-type": "application/json" },
			status: 401,
		});
	}

	return new Response(JSON.stringify(school), {
		headers: { "content-type": "application/json" },
	});
}
