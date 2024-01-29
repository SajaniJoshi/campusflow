import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from user.models import UserData, UserProfile
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import ssl
import os


@csrf_exempt
@require_POST
def save_transferred_credits_by_user(request):
     # Get the raw request body
    body = request.body.decode('utf-8')
    try:
        # Parse JSON data from the request body
        data = json.loads(body)
        email = data.get('email','')
        transferCreditsRequest = data.get('transferCreditsRequest','')

        try:
            user_data = UserData.objects.get(email=email)

            # Check for existing transfer_credits_requests
            existing_transfer_requests = user_data.transfer_credits_requests or []

            # Condition to repeatative data not get added
            # (From->To both data checked if any one does not matches it will get added in db)
            if existing_transfer_requests != []:
            
                # Get unique moduleUri values already present in the database
                existing_module_uris = set()
                for existing_request in existing_transfer_requests:
                    existing_module_uris.add(existing_request['fromModule'][0]['moduleUri'])
                    existing_module_uris.add(existing_request['toModule'][0]['moduleUri'])

                # Add only new transfer_credits_requests with previously unseen moduleUri values
                new_requests = []
                for new_request in transferCreditsRequest:
                    if (new_request['fromModule'][0]['moduleUri'] not in existing_module_uris) \
                            or (new_request['toModule'][0]['moduleUri'] not in existing_module_uris):
                        new_requests.append(new_request)
                        
                # Update the transfer_credits_requests field
                user_data.transfer_credits_requests = existing_transfer_requests + new_requests
            else:
                user_data.transfer_credits_requests = transferCreditsRequest

            user_data.save()
            user_profile = UserProfile.objects.get(email=email)

            # Here Generating pdf and sending an email
            status_email = send_generated_pdf_on_email(data,user_profile)
            
            if status_email is True:
                response = {
                    'message': 'PDF has been sent to your Email address, successfully requested for credit transfer'
                }
                return JsonResponse(response, status =200)
            else:
                response = {
                    'message': 'Issue during sending email'
                }
                return JsonResponse(response, status =500)
        except UserData.DoesNotExist:
            response = {
                'message': f'User data not found for the specified email:- {email}. Check if you marked your completed modules in your profile section first'
            }
            return JsonResponse(response, status=404)
    except Exception as e:
        response = {
            "message": f"An unexpected error occurred: {e}"
        }
        return JsonResponse(response, status =500)


@csrf_exempt
@require_POST
def fetch_transfer_credits_requests_by_user(request):

    body = request.body.decode('utf-8')

    try:
        # Parse JSON data from the request body
        data = json.loads(body)
        email = data.get('email','')

        try:
            user_data = UserData.objects.get(email=email)

            # Use ast.literal_eval to safely evaluate the string as a Python literal
            transfer_credits_requests = user_data.transfer_credits_requests

            user_data = {  
                "transferCreditsRequests" : transfer_credits_requests
            }
            response= {
                'message': 'Successfully returned transfer credit requests of user',
                'user_data' : user_data
            }
            return JsonResponse(response, status =200)
        
        except UserData.DoesNotExist:
            # Handle the case where UserData does not exist for the given email
            response = {
                'message': f'UserData not found for the given email: {email}',
                'user_data': {}
            }
            return JsonResponse(response, status=404)
    except Exception as e:
        response = {
            "message": f"An unexpected error occurred: {e}"
        }
        return JsonResponse(response, status =500)

 
def generate_pdf_for_user_email(data, user):
    
    try:

        formatted_user_name = user.full_name.replace(' ','_')

        pdf_filename = f"Transfer_Requests_{formatted_user_name}.pdf"

        # Folder path to store the PDF file
        output_folder = "Transfer_Credit_Requests_Users_PDFs"

        # Create the output folder if it doesn't exist
        os.makedirs(output_folder, exist_ok=True)

        # PDF filename
        pdf_filename = os.path.join(output_folder, pdf_filename)
        # Create a PDF document
        pdf = SimpleDocTemplate(pdf_filename, pagesize=letter)

        # Add content to the PDF
        styles = getSampleStyleSheet()
        style_center = ParagraphStyle('Center', parent=styles['Heading1'], alignment=TA_CENTER)
        elements = []

        # Heading of the PDF
        heading = Paragraph("CampusFlow Credit Transfer Requests", getSampleStyleSheet()["Title"])
        elements.append(heading)

        # Text before the table
        text_data_before = f"""

        Dear {user.full_name},

        Your credit transfer request has been received and is currently being processed. We appreciate your patience during this time.

        Below is the list of transfer credit requests you made, please check it once.

        """

        # Split the text into paragraphs based on line breaks
        text_paragraphs_before = text_data_before.split("\n")

        # Create a list of Paragraph objects
        new_paragraphs_before = [Paragraph(line, getSampleStyleSheet()["BodyText"]) for line in text_paragraphs_before]

        elements.extend(new_paragraphs_before)

        # Add a table for the data
        table_data = [["Status", "From Module", "To Module"]]
        for item in data.get("transferCreditsRequest"):
            status = item.get("status", "")
            from_module = ", ".join([f"{module['moduleName']} ({module['credits']} credits)" for module in item.get("fromModule", [])])
            to_module = ", ".join([f"{module['moduleName']} ({module['credits']} credits)" for module in item.get("toModule", [])])
            table_data.append([status, from_module, to_module])

        # Define table style
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])

        # Create table
        table = Table(table_data)
        table.setStyle(table_style)
        elements.append(table)

        # Text after the table
        text_data_after = f"""
        <b>Total Possible Credits Transfer Requested: {data.get('possibleTransferrableCredits')} </b>

        If you have any further questions or concerns, please feel free to reach out to our support team.

        Thank you,
        CampusFlow Team
        """
        text_paragraphs_after = text_data_after.split("\n")

        # Create a list of Paragraph objects
        new_paragraphs_after = [Paragraph(line, getSampleStyleSheet()["BodyText"]) for line in text_paragraphs_after]

        # Create a separate Paragraph for the bold line
        bold_line = Paragraph(new_paragraphs_after[0].text, getSampleStyleSheet()["BodyText"])

        # Apply bold style
        bold_line.style = getSampleStyleSheet()["BodyText"]
        bold_line.style.fontName = "Helvetica-Bold"

        # Replace the original line with the bold line
        new_paragraphs_after[0] = bold_line

        elements.extend(new_paragraphs_after)

        # Build the PDF document
        pdf.build(elements, onFirstPage=lambda canvas, doc: custom_footer(canvas, doc, "*This pdf is generated by CampusFlow Team, No Signature Required & All Copyrights Reserved with Web Wizards"))

        print(f"PDF generated successfully: {pdf_filename}")
        return pdf_filename
    except Exception as e:
        response = {
        'message': f"An unexpected error occurred during pdf creation: {e}"
        }
        return JsonResponse(response, status=500)


def custom_footer(canvas, doc, text):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillGray(0.5)
    
    # Get the width of the text and the page width
    text_width = canvas.stringWidth(text, "Helvetica", 9)
    page_width, _ = letter
    
    # Draw the text at the bottom-right corner
    canvas.drawString(page_width - text_width - 10, 10, text)
    
    canvas.restoreState()


def send_generated_pdf_on_email(data, user):
    try:
        # Sender and recipient email addresses
        sender_email = "webwizardsservices@gmail.com"
        recipient_email = user.email

        formatted_user_name = user.full_name.replace(' ','_')

        # Create a message object
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = recipient_email
        message["Subject"] = "Successful Credit Transfer Request"

        # Add body text
        body = f"""Hi {user.full_name}, 

Please find attached your transfer credit requests PDF. You'll soon get contacted by our team on further updates.

Best regards,
CampusFlow Team"""
        message.attach(MIMEText(body, "plain"))

        # Add the generated PDF as an attachment
        # Folder path where the file is stored
        file_name = f"Transfer_Requests_{formatted_user_name}.pdf"

        # Construct the full file path
        with open(generate_pdf_for_user_email(data, user), "rb") as attachment:
            part = MIMEApplication(attachment.read(), Name=file_name)
            part["Content-Disposition"] = f'attachment; filename="{file_name}"'
            message.attach(part)

        # Connect to the SMTP server and send the email
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_username = "webwizardsservices@gmail.com"
        smtp_password = "podqlgpmunmenqiu"
        simple_email_context = ssl.create_default_context()

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=simple_email_context)
            server.login(smtp_username, smtp_password)
            server.sendmail(sender_email, recipient_email, message.as_string())

        return True
    except Exception as e:
        response = {
        'message': f"An unexpected error occurred during sending an email: {e}"
        }
        return JsonResponse(response, status=500)

