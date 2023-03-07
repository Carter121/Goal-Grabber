import { pb } from "$lib/pocketbase";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(event) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await event.request.json();

	const users = data.users;

	let students = {
		byGrade: [],
	};

	for (let i = 1; i < 13; i++) {
		const allStudents = await pb.collection("users").getFullList({
			filter: `school_id = '${data.schoolId}' && grade = ${i}`,
		});

		if (allStudents.length == 0) continue;

		let gradeData = {
			grade: i,
			students: [],
		};

		for (let j = 0; j < allStudents.length; j++) {
			const stu = allStudents[j];
			const thisStudent = {
				name: stu.name,
				points: stu.points,
			};

			gradeData.students.push(thisStudent);
		}

		gradeData.students.sort((a, b) => b.points - a.points);

		students.byGrade.push(gradeData);
	}

	return new Response(JSON.stringify(students), {
		headers: { "content-type": "application/json" },
	});
}
