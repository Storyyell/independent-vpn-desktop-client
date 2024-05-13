import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { useRecoilValue } from 'recoil';
import { onlineState } from '../../atoms/app/onlineState';

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
};

function SimpleAlert() {
  return (
    <Alert severity="error" sx={{
      borderRadius: '10px',
    }}>
      Network offline
    </Alert>
  );
}

export default function OfflineModal() {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const networkStatus = useRecoilValue(onlineState);

  return (
    <div>
      <Modal
        open={!networkStatus}
        // onClose={handleClose}
        aria-labelledby="offlie Modal"
        aria-describedby="offlie Modan"
      >
        <Box sx={style}>
        <SimpleAlert/>
        </Box>
      </Modal>
    </div>
  );
}


