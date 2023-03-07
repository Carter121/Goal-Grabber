import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const users = data.users;

	let students = [];

	for (let i = 0; i < users.length; i++) {
		let student = await pb.collection("users").getOne(users[i]);

		let data = {
			name: student.name,
			id: student.id,
			points: student.points,
			grade: student.grade,
		};

		students.push(data);
	}

	students.sort((a, b) => {
		return b.points - a.points;
	});

	return new Response(JSON.stringify(students), {
		headers: { "content-type": "application/json" },
	});
}
