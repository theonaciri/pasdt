<input id="card-holder-name" type="text">

<!-- Stripe Elements Placeholder -->
<div id="card-element"></div>

<button id="card-button" data-secret="{{ $intent->client_secret }}">
    Update Payment Method
</button>

<script src="https://js.stripe.com/v3/"></script>

<script>
    const stripe = Stripe('pk_test_yaEdZMBc0hOwjjxKU0fo8Hs200Rv55MeEQ');

    const elements = stripe.elements();
    const cardElement = elements.create('card');

    cardElement.mount('#card-element');
</script>


<script type="text/javascript">
const cardHolderName = document.getElementById('card-holder-name');
const cardButton = document.getElementById('card-button');
const clientSecret = cardButton.dataset.secret;

cardButton.addEventListener('click', async (e) => {
    const { setupIntent, error } = await stripe.handleCardSetup(
        clientSecret, cardElement, {
            payment_method_data: {
                billing_details: { name: cardHolderName.value }
            }
        }
    );

    if (error) {
    	console.error('card verification not OK', error);
        // Display "error.message" to the user...
    } else {
    	console.log('card verification OK',setupIntent);
        // The card has been verified successfully...
    }
});

</script>