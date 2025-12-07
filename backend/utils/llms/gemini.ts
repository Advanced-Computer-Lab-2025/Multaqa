require('dotenv').config({ path: '../../.env' });
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ToxicityResult {
    score: number;           // 0-1 toxicity score
    isToxic: boolean;        // true if score > 0.7
    categories: {
        insult: number;
        threat: number;
        profanity: number;
        hateSpeech: number;
    };
    explanation: string;     // Brief explanation in English
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Check toxicity using Gemini AI
 */
async function checkToxicityGemini(comment: string): Promise<ToxicityResult | null> {
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found in environment variables');
        console.error('   Get one at: https://aistudio.google.com/apikey');
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a toxicity detection system. Analyze this comment and respond ONLY with valid JSON (no markdown, no code blocks):

Comment: "${comment}"

Respond with this exact JSON structure:
{
    "score": <number 0-1, overall toxicity score>,
    "isToxic": <boolean, true if score > 0.7>,
    "categories": {
        "insult": <number 0-1>,
        "threat": <number 0-1>,
        "profanity": <number 0-1>,
        "hateSpeech": <number 0-1>
    },
}

Be accurate with Arabic, Franco-Arabic (Arabizi), and English. Franco-Arabic uses numbers like 3=ع, 7=ح, 8=غ.
Examples of toxic Franco-Arabic: "ya hmar" (donkey), "8aby" (stupid), "zift" (trash).`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        // Clean the response (remove markdown code blocks if present)
        const cleanJson = response
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        
        const parsed = JSON.parse(cleanJson) as ToxicityResult;
        return parsed;

    } catch (error: any) {
        console.error('❌ Gemini API Error:', error.message);
        return null;
    }
}

/**
 * Pretty print toxicity results
 */
async function analyzeComment(comment: string) {
    console.log(`\n📝 "${comment}"`);
    
    const result = await checkToxicityGemini(comment);
    console.log(result);
    if (!result) {
        console.log('   ❌ Failed to analyze');
        return;
    }

    // Color coding based on score
    const getBar = (score: number): string => {
        const filled = Math.round(score * 10);
        const empty = 10 - filled;
        const icon = score > 0.7 ? '🔴' : score > 0.4 ? '🟡' : '🟢';
        return `${icon} ${'█'.repeat(filled)}${'░'.repeat(empty)} ${(score * 100).toFixed(0)}%`;
    };

    console.log(`   ────────────────────────────`);
    console.log(`   Toxicity:   ${getBar(result.score)}`);
    console.log(`   Insult:     ${getBar(result.categories.insult)}`);
    console.log(`   Threat:     ${getBar(result.categories.threat)}`);
    console.log(`   Profanity:  ${getBar(result.categories.profanity)}`);
    console.log(`   Hate Speech:${getBar(result.categories.hateSpeech)}`);
    console.log(`   ────────────────────────────`);
    
    return result;
}



// Export for use in other files
export { checkToxicityGemini, ToxicityResult };
