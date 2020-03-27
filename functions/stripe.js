const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

	const paymentData = JSON.parse(event.body)

	if (!paymentData.stripeToken || !paymentData.stripeAmt || !paymentData.stripeIdempotency) {
		console.error('Missing Stripe data in payload')
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({
				status: 'Bad request'
			})
		}
	}
}
