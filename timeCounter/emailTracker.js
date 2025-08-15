// 手动环境切换 (true=生产环境, false=测试环境)
// 部署时请将此值改为true
const isProduction = true;

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
    
    // 获取用户环境信息
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const browserInfo = (() => {
        const ua = userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        return '其他浏览器';
    })();
    
    const emailData = {
        message: JSON.stringify({
            counter: 1,
            ip: ip,
            time: beijingTime,
            os: platform.includes('Mac') ? 'OS X' : platform,
            device: platform.includes('Mac') ? '苹果电脑' : '其他设备',
            browser: browserInfo,
            version: userAgent.match(/(Chrome|Safari|Firefox)\/([\d.]+)/)?.[2] || '未知版本',
            country: '中国香港特别行政区' // 默认值，实际可通过IP API获取
        }, null, 2)
    };

    try {
        await emailjs.send('service_qmjzwru', 'template_6vzn2uu', {
            message: `访问信息数据:\n${JSON.stringify({
                counter: 1,
                ip: ip,
                time: beijingTime,
                os: platform.includes('Mac') ? 'OS X' : platform,
                device: platform.includes('Mac') ? '苹果电脑' : '其他设备',
                browser: browserInfo,
                version: userAgent.match(/(Chrome|Safari|Firefox)\/([\d.]+)/)?.[2] || '未知版本',
                country: '中国香港特别行政区'
            }, null, 2)}`
        });
        console.log('邮件发送成功');
    } catch (error) {
        console.error('邮件发送失败:', error);
    }
}

// 页面加载时发送邮件
document.addEventListener('DOMContentLoaded', sendVisitEmail);
