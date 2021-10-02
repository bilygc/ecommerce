import React, {useEffect} from 'react'
import {Button,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'

const Alert = ({title, text, resetErrorMessage}) => {
    const [open, setOpen] = React.useState(true);

    console.log("ENTRO A ALERT")

    // const handleClickOpen = () => {
    //     setOpen(true);
    //   };
    
    console.log("ENTRO A ALERT")  
    
    const handleClose = () => {
        resetErrorMessage()
        setOpen(false);
      };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {title}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {/* <Button onClick={handleClose}>Disagree</Button> */}
                <Button onClick={handleClose} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Alert
