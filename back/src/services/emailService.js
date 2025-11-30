const ACUMBAMAIL_API_URL = 'https://acumbamail.com/api/1/email/send/';

exports.sendAccessEmail = async (to, password) => {
    const apiKey = process.env.ACUMBAMAIL_API_KEY;
    const senderEmail = process.env.ACUMBAMAIL_SENDER_EMAIL;

    if (!apiKey || apiKey === 'placeholder_api_key') {
        console.warn('Acumbamail API Key not configured. Email simulation:');
        console.log(`To: ${to}`);
        console.log(`Password: ${password}`);
        return { success: true, simulated: true };
    }

    try {
        const params = new URLSearchParams({
            auth_token: apiKey,
            from_email: senderEmail,
            from_name: 'Eclipsefy Admin',
            to_email: to,
            subject: 'Seu Acesso ao Eclipsefy Dashboard',
            body: `
                <h1>Bem-vindo ao Eclipsefy!</h1>
                <p>Sua conta foi criada com sucesso.</p>
                <p><strong>Login:</strong> ${to}</p>
                <p><strong>Senha:</strong> ${password}</p>
                <p>Acesse em: <a href="https://dashboard.eclipsefy.com">dashboard.eclipsefy.com</a></p>
            `
        });

        const response = await fetch(ACUMBAMAIL_API_URL, {
            method: 'POST',
            body: params
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Acumbamail API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send email via Acumbamail:', error.message);
        throw new Error('Failed to send access email');
    }
};
