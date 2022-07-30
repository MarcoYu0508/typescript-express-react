import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, title, content, cancelOnClick, confirmOnClcik }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelOnClick}>取消</Button>
        <Button onClick={confirmOnClcik} color="error" autoFocus>
          確定
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog;