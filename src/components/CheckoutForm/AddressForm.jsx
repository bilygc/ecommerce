import React, { useState, useEffect, useRef } from 'react';
import FormInput from './FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, CircularProgress } from '@material-ui/core';
import { commerce } from '../../lib/commerce';
import { Link } from 'react-router-dom';

const AddressForm = ({checkoutToken, next}) => {
    const [ShippingCountries, setShippingCountries] = useState([])
    const [ShippingCountry, setShippingCountry] = useState('')
    const [ShippingSubdivisions, setShippingSubdivisions] = useState([])
    const [ShippingSubdivision, setShippingSubdivision] = useState('')
    const [ShippingOptions, setShippingOptions] = useState([])
    const [ShippingOption, setShippingOption] = useState('')
    const methods = useForm();
    const isMounted = useRef(null)

    const countries =  Object.entries(ShippingCountries).map(([code, name]) => ({id:code, label:name}) )
    // console.log("Countries: ",countries)

    const subDivisions = Object.entries(ShippingSubdivisions).map(([code, name]) => ({id:code, label:name}) )

    const options = ShippingOptions.map((sO) => ({id: sO.id, label:`${sO.description} - (${sO.price.formatted_with_symbol})`}))

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
        
        if (isMounted){
            setShippingCountries(countries)
            setShippingCountry( Object.keys(countries)[0] )
        }
    }

    const fetchSubdivisions = async (ShippingCountry, checkoutTokenId) => {
        const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, ShippingCountry)

        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
        
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})
        setShippingOptions(options)
        // console.log("options: ",options)
        setShippingOption(options[0].id)
    }


    useEffect(() => {
        isMounted.current= true
        fetchShippingCountries(checkoutToken.id)
        
        return () => {
            isMounted.current= false
        }
    },[])

    useEffect(() => {
        if (ShippingCountry) fetchSubdivisions(ShippingCountry, checkoutToken.id)
    }, [ShippingCountry])

    useEffect(() => {
        if (ShippingSubdivision) fetchShippingOptions(checkoutToken.id, ShippingCountry, ShippingSubdivision)
    }, [ShippingSubdivision])

    if (!ShippingCountry){
        return (
            <>
            <div style={{textAlign:'center'}}> 
                <CircularProgress/>
            </div>
            </>
        )
    } 

    return (
        <>
            <Typography variant="h6" gutterBottom >Shipping Address</Typography>
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit((data) => next({...data, ShippingCountry, ShippingSubdivision, ShippingOption}) )} >
                    <Grid container spacing={3} >
                        <FormInput name='firstName' label='First name' type='text' maxlength='20' minlength='4' />
                        <FormInput name='lastName' label='Last name' type='text' maxlength='20' minlength='4' />
                        <FormInput name='address1' label='Address' type='text' maxlength='40' minlength='10' />
                        <FormInput name='email' label='email' type='email' />
                        <FormInput name='city' label='City' type='text' maxlength='25' minlength='5' />
                        <FormInput name='ZIP' label='ZIP / Postal Code' type='number' maxlength='5' minlength='5' />
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={ShippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)} >
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id} >{country.label}</MenuItem>
                            ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Subdivision</InputLabel>                            
                                <Select value={ShippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value) } >
                                { subDivisions.map( (subDivision) => (
                                    <MenuItem key={subDivision.id} value={subDivision.id} >{subDivision.label}</MenuItem>
                                ) ) }
                                </Select>
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={ShippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value) } >
                                { options.map( (option) => (
                                    <MenuItem key={option.id} value={option.id} >{option.label}</MenuItem>
                                ) ) }
                                </Select>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{display:'flex', justifyContent: 'space-between'}} >
                        <Button component={Link} to="/cart" variant="outlined" >Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary" >Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
