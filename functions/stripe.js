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

	try {
		await stripe.customers
			.create({
				email: data.stripeEmail,
				source: data.stripeToken
			})
			.then(customer => {
				console.log(`starting the charges, amt: ${data.stripeAmt}, email: ${data.stripeEmail}`);

				return stripe.charges
					.create({
						currency: "GBP",
						amount: data.stripeAmt,
						receipt_email: data.stripeEmail,
						customer: customer.id,
						description: "Sample Charge"
					},
					{
						idempotency_key: data.stripeIdempotency
					})
					.then(result => {
						console.log(`Charge created: ${result}`)
					})
			})

			return {
				statusCode: 200,
				headers
			}
	} catch (err) {
		console.log(err)

		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({
				status: err
			})
		}
	}
}
