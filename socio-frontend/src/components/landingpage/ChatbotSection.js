import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chatbot from 'components/chatbot/Chatbot';

import BackendService from 'api_services/backendService';

const ChatbotSection = () => {
  const [product, setProduct] = useState('');
  const [industry, setIndustry] = useState('');
  const [functionality, setFunctionality] = useState('');
  const [area, setArea] = useState('');
  const [businessGoals, setBusinessGoals] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [problemSituation, setProblemSituation] = useState('');
  
  const [firstMessage, setFirstMessage] = useState(null);
  const [proposal, setProposal] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      "product": product,
      "industry": industry,
      "functionality": functionality,
      "problemSituation": problemSituation,
      "businessGoals": businessGoals,
      "area": area,
      "restrictions": restrictions
    }
    setFirstMessage(`
        product: ${product},
        industry: ${industry},
        functionality: ${functionality},
        problemSituation: ${problemSituation},
        area: ${area},
        businessGoals: ${businessGoals},
        restrictions: ${restrictions}
    `)

    const { data } = await BackendService.postLandingPageStartChatBot(localStorage.getItem('serviceToken'),formData);
    setProposal(data.proposal)
  };

  return (
    <Box sx={{ py: 12.5 }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Cuentanos acerca de tus problemas.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Ayudanos a entender cuales son los principales problemas de tu negocio.
            </Typography>
            <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Area</InputLabel>
                  <Select
                    value={area}
                    label="Producto"
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {['Recursos Humanos', 'TI', 'Legal', 'Cumplimiento', 'Ventas', 'Logistica', 'Finanzas', 'Mejora Continua'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={product}
                    label="Producto"
                    onChange={(e) => setProduct(e.target.value)}
                  >
                    {['crm', 'erp', 'ecommerce', 'chatbot', 'integración', 'automatización'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Industria</InputLabel>
                  <Select
                    value={industry}
                    label="Industria"
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    {['retail', 'salud', 'finanzas', 'educación', 'otro'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Funcionalidad</InputLabel>
                  <Select
                    value={functionality}
                    label="Funcionalidad"
                    onChange={(e) => setFunctionality(e.target.value)}
                  >
                    {[
                      'increase_sales',
                      'improve_customer_retention',
                      'optimize_processes',
                      'reduce_costs'
                    ].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Describe la situacion problemas!"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={problemSituation}
                  onChange={(e) => setProblemSituation(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Describe las metas del negocio!"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={businessGoals}
                  onChange={(e) => setBusinessGoals(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dinos las restricciones que podriamos tener al buscar una solucion!"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Chatbot embedded firstMessage={firstMessage} proposal={proposal}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatbotSection;
