/*
===========================================================================
escapeRegex.ts
- replaces symbol characters, for use in query strings
===========================================================================
*/

export = function escapeRegex(text: String) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
