import os
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

def send_automated_email(subject, message, recipient_list, html_message=None):
    """
    Unified automatic email sender for CourseHub CMS.
    Sends notification emails to student AND admin (pavijeevi56@gmail.com).
    Supports SMTP delivery with fail-safe fallback logging & disk archive.
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

    # Save an exact copy to sent_emails directory for instant local verification
    try:
        sent_dir = os.path.join(settings.BASE_DIR, 'sent_emails')
        os.makedirs(sent_dir, exist_ok=True)
        timestamp_file = timezone.now().strftime('%Y%m%d_%H%M%S_%f')
        log_filepath = os.path.join(sent_dir, f"email_{timestamp_file}.txt")
        with open(log_filepath, 'w', encoding='utf-8') as f:
            f.write(f"DATE       : {timezone.now().strftime('%Y-%m-%d %H:%M:%S UTC')}\n")
            f.write(f"FROM       : {from_email}\n")
            f.write(f"TO         : {', '.join(clean_recipients)}\n")
            f.write(f"SUBJECT    : {subject}\n")
            f.write("=" * 60 + "\n\n")
            f.write(message)
        print(f"[Email Dispatcher] Archived local email copy to: {log_filepath}")
    except Exception as log_err:
        print(f"[Email Dispatcher] Disk archive notice: {log_err}")

    try:
        clean_subject = subject.encode('ascii', errors='ignore').decode('ascii') or subject
        print(f"[Email Dispatcher] Sending email '{clean_subject}' to: {clean_recipients}")
    except Exception:
        pass

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
        try:
            print(f"[Email Dispatcher] Real SMTP Email successfully sent to: {clean_recipients}")
        except Exception:
            pass
        return True
    except Exception as e:
        try:
            print(f"[Email Dispatcher] SMTP Notice ({e}). Requires EMAIL_HOST_PASSWORD in settings.py")
        except Exception:
            pass
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
