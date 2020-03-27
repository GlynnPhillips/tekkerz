const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const querystring = require('querystring');
const { uuid } = require('uuidv4');

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

	const paymentData = querystring.parse(event.body);

	console.log(paymentData)
	console.log(paymentData.stripeToken)
	console.log(paymentData.stripeAmt)
	if (!paymentData.stripeToken || !paymentData.stripeAmt) {
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
				email: 'foo@example.com',
				source: paymentData.stripeToken
			})
			.then(customer => {
				console.log(`starting the charges, amt: ${paymentData.stripeAmt}`);

				return stripe.charges
					.create({
						currency: "GBP",
						amount: paymentData.stripeAmt,
						receipt_email: 'foo@example.com',
						customer: customer.id,
						description: "Sample Charge"
					},
					{
						idempotency_key: uuid()
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
