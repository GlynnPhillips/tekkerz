const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async (event, context) => {
	if (event.httpMethod !== 'POST') {
		console.error('Invalid request type')
		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({
				status: 'Method not allowed'
			})
		}
	}
}
