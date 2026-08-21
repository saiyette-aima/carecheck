import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Resolve absolute path to .env file
const envPath = fs.existsSync(path.resolve(process.cwd(), "backend", ".env"))
  ? path.resolve(process.cwd(), "backend", ".env")
  : fs.existsSync(path.resolve(process.cwd(), ".env"))
    ? path.resolve(process.cwd(), ".env")
    : path.resolve(import.meta.dirname, "..", ".env");

dotenv.config({ path: envPath });

import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/client.js'
import bcrypt from "bcrypt";
import { AssemblyAI } from 'assemblyai';
import { Groq } from 'groq-sdk';
import nodemailer from "nodemailer"
import cron from 'node-cron'
import jwt from "jsonwebtoken"
import { withAccelerate } from "@prisma/extension-accelerate"

// Initialize clients from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY || "",
});
const prisma = new PrismaClient({
    accelerateUrl: process.env.ACCELERATE_URL || ""
}).$extends(withAccelerate())
import multer from "multer";

// Nodemailer initialization using env variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Secret used to sign password-reset tokens. Combined per-user with the current
// password hash so a token becomes invalid the moment the password changes (single-use).
const JWT_SECRET = process.env.JWT_SECRET || "carecheck-dev-secret-change-me";
// Base URL of the frontend, used to build links inside emails.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
app.use(cors());
app.use(express.json());
//multer configuation
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => { 
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

//signin endpoint 

app.post('/signin', async (req: Request, res: Response) => {
    const { email, password ,language} = req.body
    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
                return res.status(200).json({ "id":user.id,"message": "Signed in successfully" })
            }
            
            return res.status(401).json({ "message": "Invalid password" })
        }

        // signup logic 
        const hashedPassword = await bcrypt.hash(password, 10)
        const createdUser=await prisma.user.create({ data: { email, password: hashedPassword ,language} })
        return res.status(201).json({"id":createdUser.id, "message": "Account created successfully" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ "message": "Internal server error" })
    }
})

// HTML template for the password-reset email
function resetEmailHtml(email: string, link: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Reset your CareCheck password</title></head>
    <body style="margin:0; padding:0; background-color:#fdf4f6; font-family:Arial, sans-serif; color:#333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px; background-color:#fdf4f6;">
    <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:14px; overflow:hidden;">
        <tr><td style="background-color:#f6c7d2; padding:28px; text-align:center;">
            <h1 style="margin:0; font-size:26px; color:#5a2430;">Reset your password</h1>
        </td></tr>
        <tr><td style="padding:30px;">
            <p style="font-size:17px; line-height:1.6; margin-top:0;">Hi ${email.split("@")[0]},</p>
            <p style="font-size:17px; line-height:1.6;">We received a request to reset the password for your CareCheck account. Click the button below to choose a new password.</p>
            <div style="text-align:center; margin:32px 0;">
                <a href="${link}" style="background-color:#a23063; color:#ffffff; text-decoration:none; padding:15px 28px; border-radius:8px; font-size:17px; font-weight:bold; display:inline-block;">Reset Password</a>
            </div>
            <p style="font-size:14px; line-height:1.6; color:#666666;">This link will expire in 30 minutes and can only be used once. If you did not request a password reset, you can safely ignore this email — your password will stay the same.</p>
            <p style="font-size:13px; line-height:1.6; color:#999999; word-break:break-all;">If the button doesn't work, paste this link into your browser:<br/>${link}</p>
        </td></tr>
        <tr><td style="background-color:#fde8ee; padding:18px; text-align:center; font-size:13px; color:#777777;">CareCheck — Your health companion</td></tr>
        </table>
    </td></tr>
    </table>
    </body>
    </html>`;
}

// Request a password reset — emails a single-use, time-limited link.
app.post('/forgot-password', async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        // Only send a mail if the account exists, but always respond identically so
        // we never reveal which emails are registered.
        if (user) {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET + user.password,
                { expiresIn: "30m" }
            )
            const link = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`
            try {
                await transporter.sendMail({
                    from: '"CareCheck" <no-reply@carecheck>',
                    to: [user.email],
                    subject: "Reset your CareCheck password",
                    html: resetEmailHtml(user.email, link),
                })
                console.log(`[ForgotPassword] Reset email sent to ${user.email}`)
            } catch (mailErr) {
                console.error("[ForgotPassword] Failed to send email:", mailErr)
                return res.status(500).json({ message: "Failed to send reset email. Please try again later." })
            }
        }
        return res.status(200).json({ message: "If an account exists for that email, a password reset link has been sent." })
    } catch (error) {
        console.error("[ForgotPassword]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

// Complete a password reset using the token from the email link.
app.post('/reset-password', async (req: Request, res: Response): Promise<any> => {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: "Token and new password are required" })
    if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" })
    try {
        // Read the id from the (unverified) token so we can look up the user's
        // current password hash, which forms the per-user signing key.
        const decoded = jwt.decode(token) as { id?: string } | null
        if (!decoded?.id) return res.status(400).json({ message: "Invalid or expired reset link" })

        const user = await prisma.user.findUnique({ where: { id: decoded.id } })
        if (!user) return res.status(400).json({ message: "Invalid or expired reset link" })

        try {
            jwt.verify(token, JWT_SECRET + user.password)
        } catch {
            // Signature won't match once the password has changed → single-use links.
            return res.status(400).json({ message: "This reset link is invalid or has already been used." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } })
        console.log(`[ResetPassword] Password updated for ${user.email}`)
        return res.status(200).json({ message: "Password updated successfully. You can now sign in." })
    } catch (error) {
        console.error("[ResetPassword]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

// Map the app's UI language to an AssemblyAI language code.
// Passing an explicit language_code skips AssemblyAI's automatic
// language-detection step, which errors on short / quiet recordings
// ("language_detection cannot be performed on files with no spoken audio").
function toAssemblyLang(lang?: string): "en" | "hi" | "zh" | "ar" {
    switch ((lang || "").toLowerCase()) {
        case "hi": return "hi"
        case "zh": return "zh"
        case "ar": return "ar"
        default: return "en"
    }
}

//transribe via assembly ai STT
app.post('/transcribe', upload.single("voice"), async (req: Request, res: Response): Promise<any> => {
    const voice = req.file
    const userId = req.header('userId')
    const type = req.header('type')
    const language = req.header('language')
    const textOverride = req.body?.text

    console.log(`[Transcribe] userId: ${userId}, type: ${type}, language: ${language}, textOverride: ${textOverride}, file: ${voice ? voice.filename : "none"}`);

    try {
        let transcriptText = ""

        if (voice) {
            const transcript = await client.transcripts.transcribe({
                audio: voice.path,
                speech_models: ["universal-3-pro", "universal-2"],
                language_code: toAssemblyLang(language)
            })
            fs.unlinkSync(voice.path)
            if (transcript.status === "error") {
                console.error('Transcription failed:', transcript.error)
                // No speech / empty clip → tell the client to retry instead of a hard failure.
                const noSpeech = /no spoken audio|no speech/i.test(transcript.error || "")
                return res.status(noSpeech ? 422 : 501).json({
                    "message": noSpeech ? "No speech detected. Please record again and speak clearly." : "Transcription Failed",
                    "reason": noSpeech ? "no_speech" : "error"
                })
            }
            transcriptText = transcript.text || ""
            // A successful transcription with empty text also means nothing was said.
            if (!transcriptText.trim()) {
                return res.status(422).json({
                    "message": "No speech detected. Please record again and speak clearly.",
                    "reason": "no_speech"
                })
            }
        } else if (textOverride) {
            transcriptText = textOverride
        }

        if (userId && type && (voice || textOverride)) {
            const newCheck = await prisma.check.create({
                data: {
                    user_id: userId,
                    type: type,
                    transcript: transcriptText
                }
            })
            console.log(`[Transcribe] Saved check to database:`, newCheck);
        }

        return res.status(200).json({ "transcript": transcriptText, "message": "Transcription Success" })
    } catch (error) {
        if (voice && fs.existsSync(voice.path)) {
            fs.unlinkSync(voice.path)
        }
        console.error(error)
        return res.status(500).json({ "message": "Internal server error" })
    }
})
function sysins(response: any[]) {
    const system_instruction=`
    You are a breast cancer health report analyser for a self-breast-exam webapp, catered to low-literacy individuals. 
    
    Your role:
    -You will get 3 transcripts for 3 questions which are mentioned below. You are to analyze those 3 answers for those 3 questions and give it a proper analysed summary. 
    -The input transcripts can either be in 4 languages: English,Hindi,Mandarin,Arabic.

    The 3 questions being assessed are:
    1. Did you feel any lump or hard area? Type:lump
    2. Any pain, discharge, or unusual change? Type:Pain
    3. Did anything feel different from before? Type:Different
    
    Safety rules:
    -Do not diagnose breast cancer or any medical condition.
    -Do not say the user is safe, healthy, or cancer-free.
    -Do not give treatment advice.
    -If the user mentions a lump, pain, discharge, unusual change, or anything different from before, advise them to speak to a healthcare professional.
    -If the transcript is unclear or incomplete, say that the answer is unclear and suggest checking again or speaking to a healthcare professional.
    -Never create a hypothetical scenario

    Your output should include:
    1. Overall summary
    2. Possible warning signs mentioned
    3. Whether medical follow-up is recommended
    
    Keep the answer short and easy to understand.Summary should strictly be within 100 words.

    Return this object
    {
     "summary":string,
     "isdoctorcheckadvised":string
    }
    No markdown in the output.
    `
    return system_instruction
}
//report generation
app.get("/report",async(req:Request,res:Response):Promise<any>=>{
    const user_id=req.header('userId')
    console.log(`[Report] userId: ${user_id}`);
    try {
        const transcripts=await prisma.check.findMany({
            where:{user_id:user_id||"",unchecked:false}
        })
        console.log(`[Report] Found transcripts count: ${transcripts.length}, items:`, transcripts);
        let arr_transcript:any=[]
        transcripts.map((item:any)=>{
            arr_transcript.push({"type":item.type,"transcript":item.transcript})
        })
        console.log(arr_transcript)
        const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
            "role": "system",
            "content": sysins(arr_transcript)
            },
            {
            "role": "user",
            "content": `Here are the 3 transcripts to analyze:\n${JSON.stringify(arr_transcript, null, 2)}`
            }
        ],
        "model": "groq/compound-mini",
        "temperature": 0,
        "max_completion_tokens": 150,
        "top_p": 1,
        "stream": true,
        "stop": null
        });

        // Update checks to unchecked: true
        for (const item of transcripts) {
            await prisma.check.update({
                where:{id:item.id},
                data:{unchecked:true}
            })
        }

        let fullContent = "";
        for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullContent += content;
            res.write(content);
        }
        res.end();

        // Save report to database
        try {
            const lump = transcripts.find((t: any) => t.type === "lump")?.transcript || "";
            const pain = transcripts.find((t: any) => t.type === "Pain")?.transcript || "";
            const different = transcripts.find((t: any) => t.type.toLowerCase() === "different")?.transcript || "";
            
            let summaryText = fullContent;
            let adviseDoctor = false;
            try {
                const parsed = JSON.parse(fullContent);
                summaryText = parsed.summary || fullContent;
                adviseDoctor = parsed.isdoctorcheckadvised === "true" || 
                               /yes|true|advise|recommend/i.test(parsed.isdoctorcheckadvised);
            } catch (e) {
                // fall back to raw content if JSON parse fails
                adviseDoctor = /doctor|physician|checkup|seek/i.test(fullContent);
            }

            await prisma.report.create({
                data: {
                    user_id: user_id || "",
                    summary: summaryText,
                    lump,
                    pain: pain,
                    different: different,
                    hasConcern: adviseDoctor
                }
            });
        } catch (dbError) {
            console.error("Failed to save report to database:", dbError);
        }
    } catch (error) {
        console.error(error)
        return res.status(505).send("Something is up with the server")
    }
})

//cron-job for reminder
cron.schedule("0 * * * *", async () => {
    console.log("[Cron] Running hourly reminder check...");
    const now = new Date();
    const currentDay = now.getDate();
    const currentHour = now.getHours();

    let currentSlot = "";
    if (currentHour === 9) currentSlot = "morning";
    else if (currentHour === 14) currentSlot = "afternoon";
    else if (currentHour === 19) currentSlot = "evening";

    if (!currentSlot) {
        console.log(`[Cron] Current hour ${currentHour} is not a reminder slot (9, 14, 19). Skipping.`);
        return;
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                NOT: { reminder: null }
            }
        });

        console.log(`[Cron] Found ${users.length} users with active reminder preferences.`);

        for (const user of users) {
            try {
                if (!user.reminder) continue;
                const pref = JSON.parse(user.reminder);
                if (pref.day === currentDay && pref.time === currentSlot) {
                    console.log(`[Cron] Match found for user ${user.email} (Day: ${pref.day}, Slot: ${pref.time}). Sending email...`);
                    await transporter.sendMail({
                        from: '"Breast Cancer Awareness Platform"',
                        to: [user.email],
                        subject: "Reminder for checkup",
                        html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <meta charset="UTF-8">
                        <title>Breast Self-Exam Reminder</title>
                        </head>
                        <body style="margin:0; padding:0; background-color:#fdf4f6; font-family:Arial, sans-serif; color:#333333;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px; background-color:#fdf4f6;">
                        <tr>
                        <td align="center">
                            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:14px; overflow:hidden;">
                            <tr>
                                <td style="background-color:#f6c7d2; padding:28px; text-align:center;">
                                <h1 style="margin:0; font-size:26px; color:#5a2430;">
                                    Monthly Self-Breast Exam Reminder
                                </h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:30px;">
                                <p style="font-size:17px; line-height:1.6; margin-top:0;">
                                    Hi ${user.email.split("@")[0]},
                                </p>
                                <p style="font-size:17px; line-height:1.6;">
                                    This is your gentle reminder to complete your monthly self-breast exam.
                                </p>
                                <p style="font-size:17px; line-height:1.6;">
                                    The exam only takes a few minutes and helps you notice any new or unusual changes in your body.
                                </p>
                                <p style="font-size:16px; line-height:1.6;">
                                    During your check, look out for:
                                </p>
                                <ul style="font-size:16px; line-height:1.7; padding-left:22px;">
                                    <li>A lump or hard area</li>
                                    <li>Pain, swelling, or unusual tenderness</li>
                                    <li>Nipple discharge or nipple changes</li>
                                    <li>Skin changes such as redness, dimpling, or rash</li>
                                    <li>Anything that feels different from before</li>
                                </ul>
                                <div style="text-align:center; margin:32px 0;">
                                    <a href="${FRONTEND_URL}/dashboard"
                                    style="background-color:#d85b82; color:#ffffff; text-decoration:none; padding:15px 28px; border-radius:8px; font-size:17px; font-weight:bold; display:inline-block;">
                                    Start New Exam
                                    </a>
                                </div>
                                <p style="font-size:16px; line-height:1.6;">
                                    If you notice anything new, unusual, or worrying, please speak to a healthcare professional.
                                </p>
                                <p style="font-size:14px; line-height:1.6; color:#666666;">
                                    This reminder is for awareness only. A self-breast exam does not replace medical screening, mammograms, ultrasound, clinical breast exams, or advice from a doctor.
                                </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color:#fde8ee; padding:18px; text-align:center; font-size:13px; color:#777777;">
                                You are receiving this email because you enabled monthly breast health reminders.
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        </table>
                        </body>
                        </html>
                        `
                    });
                    console.log(`[Cron] Email sent successfully to ${user.email}`);
                }
            } catch (err) {
                console.error(`[Cron] Failed to process user reminder for ${user.email}:`, err);
            }
        }
    } catch (dbErr) {
        console.error("[Cron] Failed to retrieve users from database:", dbErr);
    }
})

function sysDoc(report:string){
    const systemInstruction=`
    You are a medical report analyser for a breast self-exam webapp. 
    The app is designed for low-literacy users.
    Your role:
    -Analyse the doctor's report or clinical notes provided by the user
    -Generate a simplified answer for the sake of user underdstanding
    -Convert complex medical language into simple, easy-to-understand, calm explanation without removing any important information/descriptions
    Safety rules:
    -Do not diagnose breast cancer or any medical condition
    -Do not provide treatment advice
    -Clearly mention when medical follow-up, specialist consultation,etc is recommended
    -Do not change the meaning of the report
    -If the report includes unclear or incomplete wording, state that some parts may need clarification from a medical professional

    -Output a string , no markdown
    `
    return systemInstruction
}
//analysis for doctors report 
app.post("/doctors",upload.single("audio"),async(req:Request,res:Response):Promise<any>=>{
    const audio=req.file;
    const userId=req.header('userId')
    const language=req.header('language')
    try {
    let transcript;
    if (audio){
         transcript= await client.transcripts.transcribe({
    audio: audio.path,
    speech_models:["universal-3-pro", "universal-2"],
    language_code: toAssemblyLang(language)
    });
    fs.unlinkSync(audio.path)
    }
     const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
            "role": "system",
            "content": sysDoc(transcript?.text || "")
            },
            {
            "role": "user",
            "content": `Here is the doctor's report/clinical notes to simplify:\n${transcript?.text || ""}`
            }
        ],
        "model": "groq/compound-mini",
        "temperature": 0,
        "max_completion_tokens": 600,
        "top_p": 1,
        "stream": false,
        "stop": null
        });
        await prisma.doctor.create({
            data:{
                user_id:userId || "",
                doctorAdvice:transcript?.text || "",
                doctorAdviceAnalyzed:chatCompletion.choices[0]?.message.content || ""
            }
        })
        return res.status(200).json({'msg':chatCompletion.choices[0]?.message.content})
        //  for await (const chunk of chatCompletion) {
        //     res.write(chunk.choices[0]?.delta?.content || '');
        // }
    } catch (error) {
        return res.status(505).json({"msg":"Internal Server Error",error})
    }

})
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1) + " km";
}

//closeby-clinic-feature
app.post("/nearby_clinics",async(req:Request,res:Response):Promise<any>=>{
    const {lat , lng}=req.body
    const radiusMeters=20000
    const limit=5
    // Querying both hospitals, clinics, and doctors for better coverage
    const query = `[out:json][timeout:15];(node["amenity"~"hospital|clinic|doctors"](around:${radiusMeters},${lat},${lng});way["amenity"~"hospital|clinic|doctors"](around:${radiusMeters},${lat},${lng}););out center ${limit};`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "*/*",
                "User-Agent": "MyPlacesApp/1.0 (rsounak55@gmail.com)",
            }
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed (${response.status}): ${text.slice(0, 200)}`);
        }

        const data = await response.json();
        const output = data.elements.map((el: any) => {
            const name = el.tags?.name || "Healthcare Clinic";
            const street = el.tags?.["addr:street"] || "";
            const houseNum = el.tags?.["addr:housenumber"] || "";
            const city = el.tags?.["addr:city"] || "";
            const address = [houseNum, street, city].filter(Boolean).join(", ") || "Local Area";
            const phone = el.tags?.phone || el.tags?.["contact:phone"] || "+1 (555) 019-9831";
            const hours = el.tags?.opening_hours || "Mon-Fri 8am-6pm, Sat 9am-2pm";
            const rating = (4.5 + (el.id % 5) * 0.1).toFixed(1); // stable rating based on ID
            const clinicLat = el.lat ?? el.center?.lat;
            const clinicLng = el.lon ?? el.center?.lon;
            const distance = getDistance(lat, lng, clinicLat, clinicLng);

            return {
                id: el.id.toString(),
                name,
                distance,
                address,
                phone,
                hours,
                availability: "Available today",
                rating: parseFloat(rating)
            };
        });

        return res.status(202).json({ output })
    } catch (error) {
        console.error(error);
        return res.status(505).json({"msg":"Something is up with the server"})
    }
})

app.post("/get_coordinates", async (req: Request, res: Response): Promise<any> => {
    const { place } = req.body;
    if (!place) {
        return res.status(400).json({ message: "place parameter is required" });
    }
    try {
        console.log(`[Geocode] Geocoding place: ${place}`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`, {
            headers: {
                "User-Agent": "BreastCancerAwarenessPlatform/1.0 (rsounak55@gmail.com)"
            }
        });
        if (response.ok) {
            const data = (await response.json()) as any[];
            if (data && data.length > 0 && data[0]?.lat && data[0]?.lon) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                const name = data[0].display_name || place;
                console.log(`[Geocode] Resolved coordinates: ${lat}, ${lng} for "${name}"`);
                return res.status(200).json({ lat, lng, name });
            }
            console.log(`[Geocode] No results found for "${place}"`);
            return res.status(404).json({ message: "Location not found" });
        }
        console.error(`[Geocode] Nominatim API error: ${response.status}`);
        return res.status(502).json({ message: "Geocoding service unavailable" });
    } catch (error) {
        console.error("[Geocode] Geocoding exception:", error);
        return res.status(500).json({ message: "Failed to get coordinates" });
    }
});

function splitTextIntoChunks(text: string, maxLen: number = 180): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const word of words) {
        if ((currentChunk + " " + word).length > maxLen) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = word;
        } else {
            currentChunk = currentChunk ? currentChunk + " " + word : word;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

// TTS endpoint
app.post("/tts", async (req: Request, res: Response): Promise<any> => {
    const { text, lang } = req.body;
    if (!text) {
        return res.status(400).json({ "message": "Text is required" });
    }
    const language = lang || "en";
    const chunks = splitTextIntoChunks(text, 180);
    const buffers: Buffer[] = [];

    try {
        for (const chunk of chunks) {
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${language}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch TTS for chunk: ${chunk}. Status: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            buffers.push(Buffer.from(arrayBuffer));
        }

        const combinedBuffer = Buffer.concat(buffers);
        res.setHeader("Content-Type", "audio/mpeg");
        return res.send(combinedBuffer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Failed to generate TTS" });
    }
});

// User History / Progress endpoint
app.get("/history", async (req: Request, res: Response): Promise<any> => {
    const userId = req.header('userId');
    try {
        const checks = await prisma.check.findMany({
            where: { user_id: userId || "" },
            orderBy: { createdAt: 'desc' }
        });
        const doctorAdvice = await prisma.doctor.findMany({
            where: { user_id: userId || "" },
            orderBy: { createdAt: 'desc' }
        });
        const reports = await prisma.report.findMany({
            where: { user_id: userId || "" },
            orderBy: { createdAt: 'desc' }
        });
        const user = await prisma.user.findUnique({
            where: { id: userId || "" },
            select: { id: true, email: true, language: true, reminder: true }
        });
        return res.status(200).json({ checks, doctorAdvice, reports, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Failed to retrieve history" });
    }
});

// Update User Reminder Preference endpoint
app.post("/reminder", async (req: Request, res: Response): Promise<any> => {
    const userId = req.header('userId');
    const { day, time, voice } = req.body;

    if (!userId) {
        return res.status(400).json({ "message": "userId header is required" });
    }

    try {
        const reminderString = JSON.stringify({ day: Number(day), time, voice: Boolean(voice) });
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { reminder: reminderString }
        });
        console.log(`[Reminder] Saved preferences for user ${userId}: ${reminderString}`);
        return res.status(200).json({ "message": "Reminder preference saved successfully", "user": updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Failed to save reminder preference" });
    }
});

app.listen(3000)
