import imaplib
import email
import json
from email.header import decode_header
import re

# 邮箱配置
EMAIL = 'timegmail@sina.com'
PASSWORD = '8f010430e501a3d2'  # 客户端授权密码
IMAP_SERVER = 'imap.sina.com'
IMAP_PORT = 993  # 新浪邮箱SSL端口

def get_email_content():
    """获取并解析邮件内容"""
    try:
        # 连接IMAP服务器（使用标准登录方式）
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL, PASSWORD)
        mail.select('inbox')

        # 搜索所有邮件并过滤发件人
        status, messages = mail.search(None, 'ALL')
        if status != 'OK' or not messages[0]:
            print("没有找到邮件")
            return []
            
        # 获取邮件ID并逐个检查发件人
        email_data = []
        for mail_id in messages[0].split():
            status, msg_data = mail.fetch(mail_id, '(BODY.PEEK[HEADER.FIELDS (FROM)])')
            if status != 'OK' or not msg_data or not msg_data[0]:
                continue
                
            # 检查发件人
            if isinstance(msg_data[0][1], bytes):
                from_header = msg_data[0][1].decode('utf-8', errors='ignore')
                if 'enochzygrace@gmail.com' in from_header:
                    # 获取完整邮件内容
                    status, data = mail.fetch(mail_id, '(RFC822)')
                    if status != 'OK' or not data or not data[0]:
                        continue
                    
                    # 确保data[0][1]是bytes类型
                    if isinstance(data[0][1], bytes):
                        msg = email.message_from_bytes(data[0][1])
                    else:
                        continue
                else:
                    continue
                    
                # 提取邮件正文中的JSON数据
                body = ""
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))
                        if content_type == "text/plain" and "attachment" not in content_disposition:
                            try:
                                payload = part.get_payload(decode=True)
                                if payload:
                                    if isinstance(payload, bytes):
                                        body = payload.decode('utf-8')
                                    else:
                                        body = str(payload)
                            except Exception:
                                continue
                else:
                    try:
                        payload = msg.get_payload(decode=True)
                        if payload:
                            if isinstance(payload, bytes):
                                body = payload.decode('utf-8')
                            else:
                                body = str(payload)
                    except Exception:
                        continue

                json_data = extract_json_from_body(body)
                if json_data:
                    email_data.append(json_data)

        mail.close()
        mail.logout()
        return email_data

    except Exception as e:
        print(f"处理邮件时出错: {e}")
        return []

def extract_json_from_body(body):
    """从邮件正文提取JSON数据"""
    try:
        # 查找JSON格式的数据
        match = re.search(r'\{.*\}', body, re.DOTALL)
        if match:
            json_str = match.group()
            return json.loads(json_str)
        return None
    except json.JSONDecodeError:
        return None

def analyze_data(email_data):
    """分析并保存收集到的数据"""
    if not email_data:
        print("没有有效数据可供分析")
        return

    # 按日期分类数据
    daily_data = {}
    for data in email_data:
        date = data['time'][:10]  # 提取YYYY-MM-DD
        if date not in daily_data:
            daily_data[date] = []
        daily_data[date].append(data)

    # 保存每日数据
    for date, data_list in daily_data.items():
        # 确保目录存在
        import os
        os.makedirs("dataJson", exist_ok=True)
        filename = f"dataJson/{date}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data_list, f, ensure_ascii=False, indent=2)
        print(f"已保存 {len(data_list)} 条数据到 {filename}")

    print(f"\n共处理 {len(email_data)} 条访问记录，按 {len(daily_data)} 天分类保存")

if __name__ == "__main__":
    print("开始获取并分析邮件数据...")
    email_data = get_email_content()
    analyze_data(email_data)
