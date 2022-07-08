import { useEffect, useState } from 'react';
import DataService from '../services/data';
import Page from '../components/Page';
import { Grid, Container, Typography, Modal, Box, Button } from '@mui/material';

export default function Home() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        DataService.leave();
        window.location.reload(true);
    };

    const getData = async () => {
        try {
            const data = await DataService.home();
            console.log(data);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleOpen();
            }
        }
    }

    // useEffect(() => {
    //     getData();
    // });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Page title="Home">
            <Container maxWidth="xl">
                <h1>{process.env.REACT_APP_BACKEND}</h1>
                <Button onClick={getData}>Get Data</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            登入失效
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            請重新登入
                        </Typography>
                    </Box>
                </Modal>
            </Container>
        </Page>
    );
}