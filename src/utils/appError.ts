
/*
===========================================================================
appError.ts
- custom error class
-- message, status code, and template (for error handler to render) props
===========================================================================
*/

class AppError extends Error {
	statusCode: Number;
	template: String;
	longMessage: String;

	constructor(statusCode: number, message?: string) {
		super();
		
		this.statusCode = statusCode;
		this.template = 'error';

		// defaults
		var msg = 'Error';
		var longMessage = 'Something went wrong.';

		if (statusCode === 404) {
			msg = 'Page Not Found';
			longMessage = `Sorry, but we couldn't find that page.`;
		} 

		// allowing override of default msg if optional message param is passed
		if (message) {
			this.message = message;
		} else {
			this.message = msg;
		}

		this.longMessage = longMessage;
	}
}


export = AppError;