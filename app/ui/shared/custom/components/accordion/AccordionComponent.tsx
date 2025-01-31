import { ExpandMoreOutlined } from "@mui/icons-material";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ButtonCustom from "../button/ButtonCustom";

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

  //controlled accordion
  const [expanded, setExpanded] = useState<boolean>(expandedDefault);

  useEffect(() => {
    setExpanded(expandedDefault);
  }, [expandedDefault]);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}
      sx={{
        borderRadius: 5,
        maxWidth: '100%',
        width: '100%',
        //Disable horizontal scroll
        overflowX: 'hidden',
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
  );
}

export default AccordionComponent;