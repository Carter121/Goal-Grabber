import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const eventList = data;

	let events = [];

	for (let i = 0; i < eventList.length; i++) {
		let event = await pb.collection("event").getOne(eventList[i]);

		let qr_codeReq = await pb.collection("qr_code").getList(1, 1, {
			filter: `code = '${event.code}'`,
		});

		let qr_code = qr_codeReq.items[0];

		let data = {
			id: event.id,
			name: event.title,
			points: event.points,
			code: event.code,
			qr_code: pb.getFileUrl(qr_code, qr_code.code_pdf),
		};

		events.push(data);
	}

	events.sort((a, b) => {
		return b.points - a.points;
	});

	return new Response(JSON.stringify(events), {
		headers: { "content-type": "application/json" },
	});
}
