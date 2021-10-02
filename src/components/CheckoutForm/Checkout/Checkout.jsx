import React, {useState, useEffect} from 'react'
import { Typography, Paper, Stepper, Step, StepLabel, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';
import useStyles from './styles'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce'

const steps = ['Shipping Address', 'Payment Details'];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const classes = useStyles()
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsFinished] = useState(false)
    const history = useHistory()

    useEffect(() => {
        const generateToken = async () =>{
            try {
                const token = await  commerce.checkout.generateToken(cart.id,  {type: 'cart'})
                setCheckoutToken(token)
            } catch (error) {
                console.log("generate token error: ",error)
                // history.push('/')
            }
        }
        generateToken()
    }, [])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    const next = (data) => {
        setShippingData(data)
        // console.log("Checkout Shipping data:  ",shippingData)
        nextStep()
    }

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)            
        }, 5000);
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5" >thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography  variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" >Back to home</Button>
        </>
    ) : isFinished ? (
            <>
                <div>
                    <Typography variant="h5" >thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                    <Divider className={classes.divider} />
                    <Typography  variant="subtitle2">Order ref: {order.customer_reference}</Typography>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" >Back to home</Button>
            </>
    ) : (
        <div style={{textAlign:'center'}}>
            <CircularProgress/>
        </div>
    )


    const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next} /> 
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout} />
    
    return (
        <>
            <CssBaseline/>
            <div className={classes.toolbar} />
            <main className={classes.layout} >
                <Paper className={classes.paper} >
                    <Typography variant="h4" align="center" >Checkout</Typography>
                    <Stepper activeStep={activeStep}  className={classes.stepper} >
                        {steps.map((step) => (
                            <Step key={step} >
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/> }
                </Paper>
            </main>
        </>
    )
}

export default Checkout
