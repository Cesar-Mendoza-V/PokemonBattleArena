import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Verify all required fields are present in the request
if len(sys.argv) < 3:
    print("ERROR: No email or code provided")
    sys.exit(1)

recipient_email = sys.argv[1]
verification_code = sys.argv[2]  # Code received from cpp

# Email configuration
sender_email = "pokemon.battle.notification@gmail.com"
password = "wihs owit pkmu dovh"
subject = "Password Reset Request"
body = f"""
Hi,

You requested a new password.

Your request ID: {verification_code}

Please note that this email is for notifications only. Any replies will not be answered.

Best regards,
Your Service Team
"""

msg = MIMEMultipart()
msg["From"] = sender_email
msg["To"] = recipient_email
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
    print("SUCCESS")  # Success message
    sys.exit(0)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
