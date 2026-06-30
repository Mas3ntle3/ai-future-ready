import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI service is not configured");
  return createLovableAiGatewayProvider(key);
}

// ---------- Public: Eligibility ----------
const EligibilityInput = z.object({
  age: z.number().int().min(5).max(100),
  education: z.string().min(1).max(200),
  province: z.string().min(1).max(100),
  documents: z.array(z.string()).max(20),
});

export const checkEligibility = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EligibilityInput.parse(d))
  .handler(async ({ data }) => {
    const g = gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are an admissions assistant for a free community computer literacy programme in Gauteng, South Africa. Programme rules: open to youth ages 16–35; must reside in any South African province (priority to Gauteng); required documents are SA ID/passport, proof of address, highest school qualification (Grade 9+ preferred). Reply in friendly, encouraging plain English with short paragraphs and bullet points. Always end with a clear 'Verdict:' line (Eligible / Eligible with conditions / Not yet eligible) and concrete next steps.",
      prompt: `Applicant details:\n- Age: ${data.age}\n- Highest education: ${data.education}\n- Province: ${data.province}\n- Documents available: ${data.documents.join(", ") || "none specified"}\n\nAssess eligibility and explain any missing requirements.`,
    });
    return { result: text };
  });

// ---------- Public: Course Advisor ----------
const AdvisorInput = z.object({
  interests: z.string().min(2).max(500),
  goals: z.string().min(2).max(500),
});

export const recommendCourses = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AdvisorInput.parse(d))
  .handler(async ({ data }) => {
    const g = gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are a friendly course advisor for a free beginner computer-literacy programme in Gauteng. Available beginner tracks: 1) Digital Foundations (typing, email, internet safety), 2) Microsoft Office Essentials (Word, Excel, PowerPoint), 3) Web Basics & Social Media for Work, 4) Intro to Coding (HTML/CSS + Scratch), 5) Data Entry & Admin Skills, 6) Smartphone & Mobile Productivity. Recommend 2–3 best-fit tracks. Use plain English, bullet points, and explain WHY each track suits the user.",
      prompt: `User interests: ${data.interests}\nUser goals: ${data.goals}\n\nRecommend the best beginner courses.`,
    });
    return { result: text };
  });

// ---------- Authenticated: Application Review ----------
const ApplicationInput = z.object({
  fullName: z.string().max(200),
  age: z.number().int().min(5).max(100),
  province: z.string().max(100),
  city: z.string().max(100),
  education: z.string().max(200),
  motivation: z.string().max(2000),
  preferredCourse: z.string().max(200),
  documents: z.array(z.string()).max(20),
  phone: z.string().max(40),
  email: z.string().email().max(200),
});

export const reviewApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ApplicationInput.parse(d))
  .handler(async ({ data, context }) => {
    const g = gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are an application reviewer for a free computer literacy programme. Check the application for completeness, clarity, missing documents, and improvements to the motivation statement. Be encouraging. Return: 1) Completeness checklist, 2) Specific issues (if any), 3) Suggested motivation rewrite (2-4 sentences), 4) Ready-to-submit verdict.",
      prompt: JSON.stringify(data, null, 2),
    });

    const { data: row, error } = await context.supabase
      .from("applications")
      .insert({
        user_id: context.userId,
        payload: data,
        ai_feedback: text,
        status: "reviewed",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, feedback: text };
  });

// ---------- Authenticated: CV Builder ----------
const CVInput = z.object({
  fullName: z.string().max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40),
  location: z.string().max(200),
  summary: z.string().max(1000),
  education: z.string().max(2000),
  skills: z.string().max(1000),
  experience: z.string().max(3000),
  targetRole: z.string().max(200),
});

export const generateCV = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CVInput.parse(d))
  .handler(async ({ data, context }) => {
    const g = gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are a professional CV writer for entry-level IT/admin roles in South Africa. Produce a clean, ATS-friendly CV in Markdown with these sections: Header (name, contact, location), Professional Summary (3 sentences), Key Skills (bulleted), Education, Work/Volunteer Experience (use STAR-style bullets), Achievements, References (state 'Available on request'). Use strong action verbs. Do not invent qualifications. If a section is sparse, write a tactful one-line placeholder.",
      prompt: `Target role: ${data.targetRole}\n\n${JSON.stringify(data, null, 2)}`,
    });

    const { data: row, error } = await context.supabase
      .from("cvs")
      .insert({
        user_id: context.userId,
        content: data,
        generated_text: text,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, cv: text };
  });

// ---------- Authenticated: Cover Letter ----------
const CoverInput = z.object({
  fullName: z.string().max(200),
  targetRole: z.string().min(2).max(200),
  targetCompany: z.string().max(200).optional().default(""),
  background: z.string().max(2000),
  whyThisRole: z.string().max(1000),
});

export const generateCoverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CoverInput.parse(d))
  .handler(async ({ data, context }) => {
    const g = gateway();
    const { text } = await generateText({
      model: g(MODEL),
      system:
        "You are a career coach writing concise, warm cover letters for entry-level IT/admin roles in South Africa. Output a complete letter (date, greeting, 3 short paragraphs, sign-off). No invented credentials. Match the candidate's voice to the role.",
      prompt: JSON.stringify(data, null, 2),
    });

    const { data: row, error } = await context.supabase
      .from("cover_letters")
      .insert({
        user_id: context.userId,
        target_role: data.targetRole,
        target_company: data.targetCompany || null,
        generated_text: text,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, letter: text };
  });
