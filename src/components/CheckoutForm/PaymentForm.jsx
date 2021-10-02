import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({checkoutToken, backStep, shippingData, onCaptureCheckout, nextStep, timeout}) => {

    let shipping = checkoutToken.shipping_methods.filter(shipping => shipping.id === shippingData.ShippingOption)
    
    const shippingPrice = shipping[0].price.raw

    // console.log("datos de envio: ",shippingData)
    // console.log("subtotal: ",checkoutToken)
    
    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault()

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement)

        const { error, paymentMethod } = await stripe.createPaymentMethod({type:'card', card:cardElement})
        const cardToken = await stripe.createToken(cardElement)
        // console.log("Card token: ",cardToken)
        // console.log("stripe: ",stripe)
        

        if(error){
            console.log("payment error: ",error)
        }
        else{
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: {firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email},
                shipping: {
                    name:'primary',
                    street:shippingData.address1,
                    town_city:shippingData.city,
                    county_state:shippingData.ShippingSubdivision,
                    postal_zip_code:shippingData.ZIP,
                    country:shippingData.ShippingCountry
                },
                fulfillment: {shipping_method:shippingData.ShippingOption},
                payment: {
                    gateway:'stripe',
                    card:{
                        token:cardToken.id
                    },
                    stripe:{
                        payment_method_id: paymentMethod.id
                    }
                }
            }
            // console.log("orderData: ",orderData)
            onCaptureCheckout(checkoutToken.id, orderData)
            nextStep()

        }
    }
    return (
        <>
            <Review checkoutToken={checkoutToken} shippingPrice={shippingPrice} />
            <Divider/>
            <Typography variant="h6" gutterBottom style={{margin: '20px 0'}} >Payment method</Typography>
            <Elements stripe={stripePromise} >
                <ElementsConsumer>
                    {({elements, stripe}) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe) } >
                            <CardElement/>
                            <br/> <br/>
                            <div style={{display:'flex', justifyContent:'space-between'}} >
                                <Button variant="outlined" onClick={backStep} >Back</Button>
                                <Button type="submit" variant="contained" disabled={!stripe} color="primary" >
                                    Pay ${checkoutToken.live.subtotal.raw + shippingPrice}
                                </Button>
                            </div>
                        </form>
                     ) }
                </ElementsConsumer>
            </Elements>
        </>
    )
}

export default PaymentForm
