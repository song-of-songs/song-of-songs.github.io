// 手动环境切换 (true=生产环境, false=测试环境)
// 部署时请将此值改为true
const isProduction = false;

// 初始化EmailJS - 仅在生产环境初始化
if (isProduction) {
    emailjs.init('VGHGInbSX3zkOgJSG');
}

// 获取访问者IP
async function getVisitorIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip || '未知IP';
    } catch {
        return '未知IP';
    }
}

// 获取北京时间
function getBeijingTime() {
    const now = new Date();
    now.setHours(now.getHours() + 8); // UTC+8
    return now.toISOString().replace('T', ' ').substring(0, 19);
}

// 发送访问信息邮件
async function sendVisitEmail() {
    if (!isProduction) {
        console.log('测试环境 - 跳过邮件发送');
        return;
    }

    const ip = await getVisitorIP();
    const beijingTime = getBeijingTime();
    
    const emailData = {
        counter: 1,
        ip: ip,
        time: beijingTime
    };

    try {
        await emailjs.send('service_qmjzwru', 'template_6vzn2uu', emailData);
        console.log('邮件发送成功');
    } catch (error) {
        console.error('邮件发送失败:', error);
    }
}

// 页面加载时发送邮件
document.addEventListener('DOMContentLoaded', sendVisitEmail);
