import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import React from "react";

type AccordionProps = {
  title: string,
  expandedDefault: boolean,
  children: React.ReactNode
  saveAction?: () => void,
}

const AccordionComponent : React.FC<AccordionProps> = (
  {title,expandedDefault, children, saveAction}
) => {
  return (
    <div>
      <Accordion defaultExpanded={expandedDefault}
        sx={{
          borderRadius: 5,
        }}
        color='primary'
        square
        aria-controls='data-account-user' 
        id='data-account-user'>
        <AccordionSummary
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          expandIcon={<ExpandMoreOutlined />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h6" component={'h3'} sx={{ fontWeight: 700, fontSize: 18 }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
        <AccordionActions sx={{ mr: 2}}>
          <Button variant='outlined' color='secondary' onClick={saveAction}>Guardar</Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}

export default AccordionComponent;