import smtplib, random, requests, uuid, asyncio
from typing import Optional
import os
from vonage import Vonage, Auth, HttpClientOptions
from vonage_voice import CreateCallRequest, Talk
from datetime import datetime, timedelta
from lxml import html


class IdentifyService:
    def __init__(self):
        self.vonage = self._setup_vonage()
        self.sessions = {}

    def _send_email(self, email: str):
        number = random.randint(100000, 999999)
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "@gmail.com"  # 이메일
        sender_password = "your-app-password"  # 비번

        subject = "인증 메일입니다."
        message = f"인증 번호는: {number} 입니다. 이 번호를 입력해주세요."

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
            return number

        except Exception as e:
            print(f"이메일 발송 실패: {e}")

    def _setup_vonage(self):
        auth = Auth(
            api_key=os.getenv("VONAGE_API_KEY", "f1f9a3da"),
            api_secret=os.getenv("VONAGE_API_SECRET", "t9v2Rc4ZU7dELxU7"),
            application_id=os.getenv("VONAGE_APPLICATION_ID", "8bba1b70-bfc3-4f6b-8a22-487f6eaf3391"),
            private_key=os.getenv("VONAGE_PRIVATE_KEY_PATH", "./private.key")
        )
        options = HttpClientOptions(api_host='api.nexmo.com', timeout=30)
        return Vonage(auth=auth, http_client_options=options)

    def _ars(self, tel: str):
        number = random.randint(100000, 999999)

        work_id = str(uuid.uuid4())
        self.sessions[work_id] = {
            'phone': tel,
            'code': str(number),
            'expires': datetime.now() + timedelta(minutes=5),
            'attempts': 0
        }

        try:
            code_with_spaces = ' '.join(str(number))
            ncco = [Talk(
                text=f"인증 번호는 {code_with_spaces} 입니다. 다시 한번, {code_with_spaces} 입니다.",
                language="ko-KR"
            )]

            call_request = CreateCallRequest(
                to=[{"type": "phone", "number": tel}],
                from_={"type": "phone", "number": os.getenv("VONAGE_FROM_NUMBER", "12044804472")},
                ncco=ncco
            )

            self.vonage.voice.create_call(call_request)

            return number

        except Exception as e:
            return {
                'success': False,
                'work_id': work_id,
                'number': number,
                'message': f'발송 실패: {str(e)}'
            }

    def verify(self, business_id: str, verify_type: int):
        business_id = business_id.replace("-", "")
        url = f"https://bizno.net/article/{business_id}"

        try:
            response = requests.get(url)
            response.raise_for_status()
            tree = html.fromstring(response.content)

            elements = tree.xpath("/html/body/section[2]/div/div/div[1]/div[1]/div/table/tbody/tr[5]/td/a")
            if elements:
                tel = elements[0].text_content().strip()
            else: tel = None

            elements = tree.xpath("/html/body/section[2]/div/div/div[1]/div[1]/div/table/tbody/tr[18]/td")
            if elements:
                email = elements[0].text_content().strip()
            else: email = None

            if response.status_code == 200:
                if verify_type:
                    return self._send_email(email)
                else:
                    return self._ars(tel)
            else:
                return {
                    "error": f"HTTP {response.status_code}",
                    "message": response.text,
                }

        except requests.exceptions.RequestException as e:
            return {"error": "Request failed", "message": str(e)}
