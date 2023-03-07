import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const prize = await pb.collection("prize").getOne(data.prize);

	const student = await pb.collection("users").getOne(data.student);

	const prizePoints = prize.points;

	if (!(student.points >= prizePoints)) {
		return new Response(JSON.stringify("Not enough points."), {
			headers: { "content-type": "application/json" },
		});
	}

	student.points -= prizePoints;

	await pb.collection("users").update(data.student, student);

	return new Response(JSON.stringify("Update"), {
		headers: { "content-type": "application/json" },
	});
}
