import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const prizeList = data;

	let prizes = [];

	for (let i = 0; i < prizeList.length; i++) {
		let prize = await pb.collection("prize").getOne(prizeList[i]);

		let data = {
			id: prize.id,
			name: prize.name,
			points: prize.points,
			image: pb.getFileUrl(prize, prize.image),
		};

		prizes.push(data);
	}

	prizes.sort((a, b) => {
		return b.points - a.points;
	});

	return new Response(JSON.stringify(prizes), {
		headers: { "content-type": "application/json" },
	});
}
