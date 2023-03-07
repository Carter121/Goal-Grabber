import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const student = await pb.collection("users").getOne(data.student);

	const user = await pb.collection("users").getOne(data.user);

	if (student.school_id != user.school_id) {
		return new Response(JSON.stringify("Not in School"), {
			headers: { "content-type": "application/json" },
			status: 401,
		});
	}

	const school = await getSchool(user.school_id);

	if (school.admin != user.id) {
		return new Response(JSON.stringify("Not Admin"), {
			headers: { "content-type": "application/json" },
			status: 401,
		});
	}

	const stuSchData = {
		student: {
			name: student.name,
			grade: student.grade,
			points: student.points,
		},
		school,
	};

	return new Response(JSON.stringify(stuSchData), {
		headers: { "content-type": "application/json" },
	});
}

async function getSchool(id: string) {
	const schoolReq = await pb.collection("school").getList(1, 1, {
		filter: `join_key = '${id}'`,
	});

	return schoolReq.items[0];
}
