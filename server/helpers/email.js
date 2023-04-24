import * as config from "../config.js";

const style = `
    background: #FFFF;
    padding: 20px;
    border-radius: 20px;
    font-family: 'Viga', sans-serif;
`

export const emailTemplate = (email, content, replyTo, subject) => {
    return {
        Source: config.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                        <html>
                            <div style="${style}">
                                <h1>Welcome to <span class="text-[#EB455F]" style="color: #EB455F;">home</span><span class="text-[#2B3467]" style="color: #2B3467;">Along</span><span class="text-[#BAD7E9]" style="color: #BAD7E9;">.</span></h1>
                                ${content}
                                <p>&copy; homeAlong. ${new Date().getFullYear()}</p>
                            </div>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: `${subject}`
            }
        }
    };
};
