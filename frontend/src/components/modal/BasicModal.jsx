import { Box, Modal } from '@mui/material';

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

const BasicModal = ({ children, open, onClose, title }) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
    // aria-labelledby="modal-modal-title"
    // aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h2>{title}</h2>
        <br />
        {children}
      </Box>
    </Modal>
  )
}

export default BasicModal;