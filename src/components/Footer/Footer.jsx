import React from 'react'
import Typography, { TypographyClassKey } from '@material-ui/core/Typography'
import useStyles from './styles'

const Footer = () => {
  const classes = useStyles()
  return (
    <footer className={classes.footer } >
        <Typography variant="h5" >Made with ❤ by Bily</Typography>
    </footer>
  )
}

export default Footer
