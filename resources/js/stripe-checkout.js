// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
var style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

var card = elements.create("card", { style: style });
card.mount("#card-element");

card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

$('#submit').click(function() {
	if (typeof usermail == 'undefined') {
		console.error('no user mail');
	}
	stripe.createPaymentMethod('card', card, {
	  billing_details: {
	    email: usermail,	
	  },
	}).then(function(result) {
		console.warn('RESULT', result);
		if (result.error) {
			console.error(result.error);
			$('#error').html('Erreur ' + result.error.type + ': ' + result.error.message);
			return ;
		}
		axios({
		  method: 'post',
		  url: '/add-sub',
		  data: {
		    email: usermail,
		    payment_method: result.paymentMethod.id
		  }
		}).then((subscription) => {
		  console.log('SUCCESS', subscription);
		  success(subscription);
		}, (error) => {
		  console.error('FAIL', error);
		});
	  // Handle result.error or result.paymentMethod
	});
});

function success(subscription) {
	const { latest_invoice } = subscription;
	const { payment_intent } = latest_invoice;

	if (payment_intent) {
	  const { client_secret, status } = payment_intent;

	  if (status === 'requires_action') {
	    stripe.confirmCardPayment(client_secret).then(function(result) {
	      if (result.error) {
	      	console.error('oh', result)
	        // Display error message in your UI.
	        // The card was declined (i.e. insufficient funds, card has expired, etc)
	      } else {
	      	console.log('final success', result)
	        // Show a success message to your customer
	      }
	    });
	  } else {
	  	console.log('No additional information was needed', result);
	    // No additional information was needed
	    // Show a success message to your customer
	  }
	}
}