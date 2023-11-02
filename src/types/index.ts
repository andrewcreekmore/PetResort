import { Session } from "express-session";

// merging custom defined types with Session

declare module "express-session" {
	interface Session {
		returnTo: string;
		activeTab: string;
	}
}
