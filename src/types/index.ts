import { Session } from "express-session";

/*
===========================================================================
types/index.ts
- merges custom defined types with Session
===========================================================================
*/

declare module "express-session" {
	interface Session {
		returnTo: string;
		activeAdminTab: string;
		breadcrumbs: Array<object>;
	}
}
