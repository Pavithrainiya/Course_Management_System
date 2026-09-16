import os
from django.conf import settings
from django.core.mail import send_mail

def send_automated_email(subject, message, recipient_list, html_message=None):
    """
    Unified automatic email sender for CourseHub CMS.
    Sends notification emails to student AND admin (pavijeevi56@gmail.com).
    Supports SMTP delivery with fail-safe fallback logging.
    """
    if isinstance(recipient_list, str):
        recipient_list = [recipient_list]

    admin_email = 'pavijeevi56@gmail.com'
    combined_recipients = list(recipient_list) if recipient_list else []
    if admin_email not in combined_recipients:
        combined_recipients.append(admin_email)

    # Filter out empty/dummy emails
    clean_recipients = []
    for r in combined_recipients:
        if r and '@' in r and not r.endswith('@example.com'):
            if r not in clean_recipients:
                clean_recipients.append(r)

    if not clean_recipients:
        clean_recipients = [admin_email]

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'pavijeevi56@gmail.com')

    print(f"[Email Dispatcher] Preparing email '{subject}' to: {clean_recipients}")

    try:
        # 1. Attempt primary SMTP delivery
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=clean_recipients,
            html_message=html_message,
            fail_silently=False
        )
        print(f"[Email Dispatcher] Real SMTP Email successfully sent to: {clean_recipients}")
        return True
    except Exception as e:
        print(f"[Email Dispatcher] SMTP Notice ({e}). Executing fail-safe send to: {clean_recipients}")
        try:
            # 2. Fail-safe delivery attempt
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=clean_recipients,
                html_message=html_message,
                fail_silently=True
            )
        except Exception as e_inner:
            print(f"[Email Dispatcher] Silent send notice: {e_inner}")
        return False
