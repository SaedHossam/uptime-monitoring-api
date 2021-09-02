const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');


async function sendMail(id, email) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        console.log('Token: ', accessToken);
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                redirectUri: process.env.REDIRECT_URI,
                accessToken: accessToken,
            },
        });
        console.log('\n\ntransport: ', transport, '\n\n');
        jwt.sign(
            {
                id,
            },
            process.env.EMAIL_SECRET,
            {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                if (err)
                    console.log(err);
                else {
                    const url = `http://localhost:3000/user/confirmation/${emailToken}`;
                    const mailOptions = {
                        from: `Saed Hossam <${process.env.GMAIL_USER}>`,
                        to: email,
                        subject: 'Confirm Email',
                        text: `Please click this link to confirm your email: ${url}`,
                        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
                    };
                    console.log('mailOptions', mailOptions, '\n\n');
                    const result = transport.sendMail(mailOptions, (err, info) => {
                        if (err) console.log(err);
                        else {
                            console.log(info.envelope);
                            console.log(info.messageId);
                            return result;
                        }
                    });
                }
            },
        );
    } catch (error) {
        return error;
    }
}

module.exports = { sendMail }
