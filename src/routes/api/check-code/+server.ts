import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const codeReq = await pb.collection("qr_code").getList(1, 1, {
		filter: `code = '${data.code}'`,
	});

	const code = codeReq.items[0];

	if (code == undefined) {
		return new Response(JSON.stringify({ body: "Code does not exist" }), {
			headers: { "content-type": "application/json" },
			status: 400,
		});
	}

	const user = await pb.collection("users").getOne(data.user);

	for (let i = 0; i < user.redeemed_code.length; i++) {
		const currentUserCode = user.redeemed_code[i];

		if (currentUserCode == code.id) {
			return new Response(JSON.stringify({ body: "Code already redeemed" }), {
				headers: { "content-type": "application/json" },
				status: 400,
			});
		}
	}

	user.points += code.points;

	user.redeemed_code.push(code.id);

	await pb.collection("users").update(data.user, user);

	return new Response(JSON.stringify({ body: "Good" }), {
		headers: { "content-type": "application/json" },
	});
}
