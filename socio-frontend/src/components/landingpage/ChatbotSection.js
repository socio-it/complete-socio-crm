import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chatbot from 'components/chatbot/Chatbot';

const ChatbotSection = () => (
  <Box sx={{ py: 12.5 }}>
    <Container>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Habla con nosotros
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Envíanos tus datos y resolveremos tus dudas.
          </Typography>
          <Grid container spacing={2} component="form">
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Enviar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Chatbot embedded />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default ChatbotSection;
