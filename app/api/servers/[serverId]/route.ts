import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { serverId: string } }) => {
	try {
		const profile = await currentProfile();
		const { name, imageUrl } = await req.json();

		if (!profile) {
			return new NextResponse("Unauthorized", {
				status: 401,
			});
		}

		if (!params?.serverId) {
			return new NextResponse("Server ID is missing", {
				status: 400,
			});
		}

		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id, // can only be done by admin
			},
			data: {
				name,
				imageUrl,
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log(["SERVER_ID_PATCH", error]);
		return new NextResponse("Interal Error", {
			status: 500,
		});
	}
};
