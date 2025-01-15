import { openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

const faqData = [
  {
    question: "How can I contact Safety First Driving School?",
    answer:
      "You can contact us via phone at (555) 123-4567 or email at info@safetyfirstdriving.com. Our customer service team is always ready to assist you.",
  },
  {
    question: "What are your office hours?",
    answer: "Monday-Friday: 10am-6pm\nSaturday: 10am-2pm\nSunday: Closed",
  },
  {
    question: "How do I enroll in a driving course?",
    answer:
      "To enroll in a driving course, visit our website and click on the 'Enroll Now' button. Follow the prompts to select your preferred course, date, and time. You can also enroll by calling our office during business hours.",
  },
  {
    question: "When can I schedule my driving lessons?",
    answer:
      "Driving lessons can be scheduled after completing the classroom portion of your course. You can book lessons online through our scheduling system or by contacting our office. We offer flexible timing to accommodate your schedule.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For in-person payments, we also accept cash and checks.",
  },
];

const FAQ = () => {
  return (
    <Box
      component={"section"}
      sx={{
        py: "40px",
        px: constants.paddingContainerX,
        backgroundColor: constants.color.primary.main,
      }}
    >
      <Box sx={{ mb: "85px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontFamily: openSans.style.fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            mb: "8px",
          }}
        >
          FAQs?
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            color: "#FAFBFF",
            fontFamily: openSans.style.fontFamily,
            fontSize: "42px",
            fontWeight: 600,
          }}
        >
          Frequently Asked Questions
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "1270px", margin: "0 auto" }}>
        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: "transparent",
              color: "#FFFFFF",
              boxShadow: "none",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              "&:before": { display: "none" },
              "&.Mui-expanded": { margin: 0 },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#FFFFFF" }} />}
              sx={{
                padding: "16px 0",
                "& .MuiAccordionSummary-content": { margin: "0" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: openSans.style.fontFamily,
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                {index + 1}
                {". "} {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 16px 0" }}>
              <Typography
                sx={{
                  fontFamily: openSans.style.fontFamily,
                  fontSize: "16px",
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                  color: "#FFFFFF",
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ;
