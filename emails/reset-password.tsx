import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PithyResetPasswordEmailProps {
  username?: string;
  updatedDate?: Date;
}

export const PithyResetPasswordEmail = ({
  username,
  updatedDate,
}: PithyResetPasswordEmailProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);

  return (
    <Html>
      <Head />
      <Preview>You updated the password for your Pithy account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              You updated the password for your Pithy account on {formattedDate}
              . If this was you, then no further action is required.
            </Text>
            <Text style={paragraph}>
              However if you did NOT perform this password change, please{" "}
              <Link href="#" style={link}>
                reset your account password
              </Link>{" "}
              immediately.
            </Text>
            <Text style={paragraph}>
              Remember to use a password that is both strong and unique to your
              Pithy account. To learn more about how to create a strong and
              unique password,{" "}
              <Link href="#" style={link}>
                click here.
              </Link>
            </Text>
            <Text style={paragraph}>
              Still have questions? Please contact{" "}
              <Link href="#" style={link}>
                Pithy Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Pithy Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2022 Pithy, All Rights Reserved <br />
              350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

PithyResetPasswordEmail.PreviewProps = {
  username: "alanturing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
} as PithyResetPasswordEmailProps;

export default PithyResetPasswordEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

// const logo = {
//   display: "flex",
//   justifyContent: "center",
//   alingItems: "center",
//   padding: 30,
// };

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};
