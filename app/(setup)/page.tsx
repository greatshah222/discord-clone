import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { initialProfile } from "@/lib/initial-profile";
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {
	const profile = await initialProfile();

	// find any server which user/profile currebtly logged in user is a member of

	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (server) {
		return redirect(`/servers/${server.id}`);
	}
	return <InitialModal />;
};

export default SetupPage;
