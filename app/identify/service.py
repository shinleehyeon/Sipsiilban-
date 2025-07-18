import smtplib, random, requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class IdentifyService:
    def _send_email(self, email: str):
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "@gmail.com"  # 이메일
        sender_password = "your-app-password"  # 비번

        subject = "인증 메일입니다."
        message = f"인증 번호는: {random.randint(100000, 999999)} 입니다. 이 번호를 입력해주세요."

        msg = MIMEText(message, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = email

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
            server.quit()
            print("이메일 발송 성공!")

        except Exception as e:
            print(f"이메일 발송 실패: {e}")

    def _ars(self, tel: str): ...

    def verify(self, business_id: str, verify_type: int):
        business_id = business_id.replace("-", "")
        url = "https://api.odcloud.kr/api/nts-businessman/v1/validate"
        params = {
            "serviceKey": "AiMWtt0FcO34QaK8yixKZxjKPROE261sT0AOd3VnrmV0TuLtzoWnaZyYmrqaJHeTTLiH2wGA9zhxiuqGFnghTg=="
        }
        data = {"b_no": [business_id]}
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(url, params=params, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                if verify_type:
                    self._send_email(result["email"])
                else:
                    self._ars(result["tel"])
            else:
                return {
                    "error": f"HTTP {response.status_code}",
                    "message": response.text,
                }

        except requests.exceptions.RequestException as e:
            return {"error": "Request failed", "message": str(e)}
