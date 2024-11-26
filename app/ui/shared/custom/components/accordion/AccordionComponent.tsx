import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";

type AccordionProps = {
  title: string,
  expandedDefault: boolean,
  children: React.ReactNode,
  loading?: boolean,
  saveAction?: () => void,
}

const AccordionComponent : React.FC<AccordionProps> = (
  {title,expandedDefault, children, loading, saveAction}
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
        id='data-account-user'
        disabled={loading}
        >
        <AccordionSummary
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          expandIcon={loading ? <CircularProgress size={20} /> : <ExpandMoreOutlined />}
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
      </Accordion>
    </div>
  );
}

export default AccordionComponent;