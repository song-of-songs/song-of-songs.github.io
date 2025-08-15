// 手动环境切换 (true=生产环境, false=测试环境)
// 部署时请将此值改为true
const isProduction = true;

// 初始化EmailJS - 仅在生产环境初始化
if (isProduction) {
    emailjs.init('VGHGInbSX3zkOgJSG');
}

// 获取访问者IP和设备指纹
async function getVisitorInfo() {
    try {
        // 获取IP和地理位置（使用备用API）
        let ip = '未知IP';
        let location = '未知位置';
        
        try {
            // 尝试获取IP和位置信息
            // 尝试多个IP API
            const apiEndpoints = [
                'https://api.ip.sb/geoip',
                'https://ipapi.co/json/',
                'https://ipwho.is/'
            ];

            for (const endpoint of apiEndpoints) {
                try {
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        const data = await response.json();
                        ip = data.ip || data.ip_address || ip;
                        location = `${data.city || '未知城市'}, ${data.region || data.region_name || '未知省份'}, ${data.country || data.country_name || '未知国家'}`;
                        if (ip !== '未知IP') break;
                    }
                } catch (error) {
                    console.log(`API ${endpoint} 请求失败:`, error);
                }
            }

            // 如果所有API都失败，使用本地IP
            if (ip === '未知IP') {
                try {
                    const response = await fetch('https://api.ipify.org?format=json');
                    if (response.ok) {
                        const data = await response.json();
                        ip = data.ip || ip;
                    }
                } catch (error) {
                    console.log('获取本地IP失败:', error);
                }
            }
        } catch (geoError) {
            console.log('获取地理位置失败:', geoError);
        }
        
        // 生成设备指纹 (基于浏览器特性)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Fingerprint', 4, 17);
        
        const fingerprint = canvas.toDataURL().replace('data:image/png;base64,', '');
        
        return {
            ip: ip,
            location: location,
            fingerprint: fingerprint,
            time: new Date().toISOString()
        };
    } catch {
        return {
            ip: '未知IP',
            fingerprint: '未知指纹',
            time: new Date().toISOString()
        };
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

    const visitorInfo = await getVisitorInfo();
    const beijingTime = getBeijingTime();
    
    // 获取用户环境信息
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const browserInfo = (() => {
        const ua = userAgent;
        if (ua.includes('miniProgram')) return '微信小程序';
        if (ua.includes('MicroMessenger')) return '微信浏览器';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari'; 
        if (ua.includes('Firefox')) return 'Firefox';
        return '其他浏览器';
    })();
    
    const emailData = {
        message: JSON.stringify({
            counter: 1,
            ip: visitorInfo.ip,
            fingerprint: visitorInfo.fingerprint,
            time: beijingTime,
            os: platform.includes('Mac') ? 'OS X' : platform,
            device: platform.includes('Mac') ? '苹果电脑' : 
                  (userAgent.includes('miniProgram') ? '微信小程序' :
                  (userAgent.includes('iPhone') ? 'iPhone' :
                  (userAgent.includes('Android') ? 'Android设备' : '其他设备'))),
            browser: browserInfo,
            version: userAgent.match(/(Chrome|Safari|Firefox)\/([\d.]+)/)?.[2] || '未知版本',
            location: visitorInfo.location,
            country: '中国' // 默认值，实际可通过IP API获取
        }, null, 2)
    };

    try {
        await emailjs.send('service_qmjzwru', 'template_6vzn2uu', {
            message: `访问信息数据:\n${JSON.stringify({
                counter: 1,
                ip: visitorInfo.ip,
                fingerprint: visitorInfo.fingerprint,
                time: beijingTime,
                os: platform.includes('Mac') ? 'OS X' : platform,
                device: platform.includes('Mac') ? '苹果电脑' : 
                      (userAgent.includes('miniProgram') ? '微信小程序' :
                      (userAgent.includes('iPhone') ? 'iPhone' :
                      (userAgent.includes('Android') ? 'Android设备' : '其他设备'))),
                browser: browserInfo,
                version: userAgent.match(/(Chrome|Safari|Firefox)\/([\d.]+)/)?.[2] || '未知版本',
                location: visitorInfo.location,
                country: '中国'
            }, null, 2)}`
        });
        console.log('邮件发送成功');
    } catch (error) {
        console.error('邮件发送失败:', error);
    }
}

// 页面加载时发送邮件
document.addEventListener('DOMContentLoaded', sendVisitEmail);
