import { pb } from "$lib/pocketbase";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";

export async function POST(e) {
	if (!pb.authStore.isValid) {
		await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	const data = await e.request.json();

	const event = await pb.collection("event").getOne(data.id);

	function createPDF(img: string, code: string) {
		const doc = new jsPDF({ unit: "in", format: "letter" });
		doc.setFontSize(50);
		let x = 1.5;
		doc.text("Scan the Qr Code", x, 1);
		doc.text("or enter the code", x + 0.1, 1.75);
		doc.addImage(img, "PNG", 1.75, 3, 5, 5, "Code", "MEDIUM", 0);
		doc.setFontSize(50);
		doc.text(`Code: ${code}`, 1.55, 10);

		return doc.output("blob");
	}

	QRCode.toDataURL(
		`https://goalgrabber.com/code/${event.code}`,
		async (err, url) => {
			const output = createPDF(url, event.code);

			const formData = new FormData();

			formData.append("points", String(event.points));
			formData.append("code", event.code);
			formData.append("code_pdf", output);

			const newCode = await pb.collection("qr_code").create(formData);
		}
	);

	return new Response(JSON.stringify({ body: "Confirm" }), {
		headers: { "content-type": "application/json" },
	});
}
