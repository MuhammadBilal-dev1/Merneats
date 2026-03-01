import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

// Send verification to email
export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  const recipient = [{email}]
  try {
    const res = await client
      .send({
        from: sender,
        to: recipient,
        subject: "Verifying your Email address",
        html: htmlContent.replace("{verificationToken}", verificationToken),
        category: "Email Verification",
      });
  } catch (error) {
    console.log('Error sending email',error);
    throw new Error("Failed to send email verification.")
    
  }
}

// Send welcome message to email
export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [{email}]
  const htmlContent = generateWelcomeEmailHtml(name)
  try {
    const res = await client
    .send({
      from: sender,
      to: recipient,
      html: htmlContent,
      subject: "Welcome to MernEats",
      text: "We’re thrilled to have you join the [Your Service Name] community! 🎉",
      template_variables: {
        company_info_name: "MernEats",
        name: name
      }
    })
    
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email verification.")
  }
}

// send password message to email
export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  const recipient = [{email}]
  const htmlContent = generatePasswordResetEmailHtml(resetURL)
  try {
    const res = await client
    .send({
      from: sender,
      to: recipient,
      html: htmlContent,
      subject: "Reset your password",
      category:"Reset password"
    })
    
  } catch (error) {
    console.log(error);
    throw new Error("Failed to reset password.")
  }
}

// send reset success message to email
export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [{email}]
  const htmlContent = generateResetSuccessEmailHtml()
  try {
    const res = await client
    .send({
      from: sender,
      to: recipient,
      html: htmlContent,
      subject: "Reset your password",
      category:"Reset password"
    })
    
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset success email.")
  }
}
