import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { ServerHeader } from "@/components/server/server-header";

interface ServerSidebarProps {
	serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	const profile = await currentProfile();

	if (!profile) {
		return redirect("/");
	}

	// FETCHING SERVER AGAIN CAUSE WE NEED IN THE MOBIEL SIDEBAR AS WELL

	const server = await db.server.findUnique({
		where: { id: serverId },
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc", // SHOW AMDIN FIRST AND THEN MODERATOR AND THEN GUEST
				},
			},
		},
	});
	if (!server) {
		return redirect("/");
	}

	const textChannels = server?.channels.filter((el) => el.type === ChannelType.TEXT);
	const audioChannels = server?.channels.filter((el) => el.type === ChannelType.AUDIO);
	const videoChannels = server?.channels.filter((el) => el.type === ChannelType.VIDEO);

	const members = server?.members.filter((el) => el.profileId !== profile.id); // NOT SHOWING OURSERLF

	const role = server.members.find((el) => el.profileId === profile.id)?.role; // CHECKING OUR ROLE IN THE CURRENT SERVER

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
		</div>
	);
};
