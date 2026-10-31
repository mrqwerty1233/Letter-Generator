import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

const DATA_DIR = path.resolve(process.cwd(), '.data');
const LETTERS_FILE = path.join(DATA_DIR, 'letters.json');

function loadStoredLetters(): Record<string, unknown> {
  try {
    if (!fs.existsSync(LETTERS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(LETTERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStoredLetters(store: Record<string, unknown>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LETTERS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Ignore write errors in read-only environments
  }
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Save a customized letter website and return a short shareable ID
app.post('/api/letters', (req, res) => {
  const { letter } = req.body || {};
  if (!letter || typeof letter !== 'object') {
    res.status(400).json({ error: 'Invalid letter payload' });
    return;
  }
  const store = loadStoredLetters();
  const slugBase = String(letter.recipientName || 'beloved')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 16);
  const shortId = `${slugBase || 'love'}-${Date.now().toString(36).slice(-5)}`;
  const savedRecord = { ...letter, id: shortId };
  store[shortId] = savedRecord;
  saveStoredLetters(store);
  res.json({ id: shortId, letter: savedRecord });
});

// 2. Retrieve a saved letter website by short ID
app.get('/api/letters/:id', (req, res) => {
  const store = loadStoredLetters();
  const item = store[req.params.id];
  if (!item) {
    res.status(404).json({ error: 'Letter not found' });
    return;
  }
  res.json({ letter: item });
});

// 3. Deep Thinking Poetic Letter Composer (gemini-4-argon + ThinkingLevel.HIGH)
app.post('/api/gemini/compose-deep', async (req, res) => {
  const {
    recipientName = 'My Love',
    senderName = 'Yours',
    occasionTitle = 'Happy Birthday, My Love',
    occasionDate = '2026-11-01',
    memoriesPrompt = '',
    poeticTone = 'victorian_romance',
  } = req.body || {};

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: `Compose an intimate, deeply moving vintage love letter for ${recipientName} from ${senderName} celebrating "${occasionTitle}" on ${occasionDate}.
Personal memories and details to weave naturally into the prose: ${memoriesPrompt}
Requested literary tone: ${poeticTone}.
Return a JSON object containing salutation, paragraphs (array of 3 rich paragraphs), pullQuote (1 poetic sentence), and postscript (starting with P.S.).`,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              salutation: { type: Type.STRING },
              paragraphs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              pullQuote: { type: Type.STRING },
              postscript: { type: Type.STRING },
            },
            required: ['salutation', 'paragraphs', 'pullQuote', 'postscript'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({
        source: 'gemini-4-argon-high',
        letter: parsed,
      });
      return;
    } catch {
      // Fall through to tailored poetic fallback if free-tier key hits quota on gemini-4-argon
    }
  }

  // Bespoke deterministic fallback incorporating the user's actual prompt details
  const cleanMemories = String(memoriesPrompt).trim();
  res.json({
    source: 'atelier-bespoke',
    letter: {
      salutation: `My Dearest ${recipientName},`,
      paragraphs: [
        `As ${occasionDate} arrives, I find myself thinking of all the quiet, golden moments that have made loving you the greatest privilege of my life. ${
          cleanMemories
            ? `Every detail of our shared world—${cleanMemories.replace(/\.$/, '')}—is etched into my heart like gold leaf on vintage parchment.`
            : 'Every season with you feels warmer and more luminous than the last.'
        }`,
        `When you open this letter, I hope you feel how deeply you are cherished not only on "${occasionTitle}", but in every ordinary hour between our celebrations. You turn fleeting days into timeless memories simply by being who you are.`,
        `May this new chapter bring you boundless joy, gentle peace, and every dream you hold close. Wherever life leads us next, my heart remains steadfastly yours.`,
      ],
      pullQuote: `To love you, ${recipientName}, is to discover poetry in every single day.`,
      postscript: `P.S. Save the last dance and a birthday wish for me on ${occasionDate}, with all my love, ${senderName}.`,
    },
  });
});

// 4. General Prose Rewrite (gemini-3.8-flash)
app.post('/api/gemini/rewrite', async (req, res) => {
  const {
    paragraphs = [],
    recipientName = 'My Love',
    styleLabel = 'Poetic Gold & Velvet',
  } = req.body || {};

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Rewrite the following romantic letter paragraphs for ${recipientName} in an elevated "${styleLabel}" vintage literary style. Keep 3 cohesive paragraphs and provide a matching 1-sentence pullQuote.\n\nOriginal:\n${(
          paragraphs as string[]
        ).join('\n\n')}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              paragraphs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              pullQuote: { type: Type.STRING },
            },
            required: ['paragraphs', 'pullQuote'],
          },
        },
      });
      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
      return;
    } catch {
      // Fall through to polished rewrite
    }
  }

  res.json({
    paragraphs: [
      `Under the soft glow of candlelight and vintage gold, I write these lines to remind you, ${recipientName}, that you are the most extraordinary chapter of my life.`,
      `Every photograph we have captured and every quiet evening we have shared has woven a tapestry of devotion that time only makes richer—like fine wine aged for our most treasured celebration.`,
      `Here is to your radiant spirit, your kindness, and the countless golden tomorrows waiting for us side by side.`,
    ],
    pullQuote:
      'Like vintage wine and antique gold, every year with you grows only more precious.',
  });
});

// 5. Fast Slide Captions Generator (gemini-3.1-flash-lite)
app.post('/api/gemini/quick-captions', async (req, res) => {
  const {
    recipientName = 'My Love',
    occasionDate = '2026-11-01',
    memoriesPrompt = '',
    slideCount = 4,
  } = req.body || {};

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Write ${slideCount} concise, romantic 1-sentence vintage photo captions for ${recipientName}'s celebration on ${occasionDate}. Context: ${memoriesPrompt}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              captions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['captions'],
          },
        },
      });
      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
      return;
    } catch {
      // Fall through
    }
  }

  res.json({
    captions: [
      `Golden hour with ${recipientName}—where every step together feels like a timeless waltz.`,
      `A candlelight toast to your birthday on ${occasionDate} and all our favorite memories.`,
      `Beneath the November constellations, every wish I make begins and ends with you.`,
      `Sealed in wine and gold: a keepsake of the laughter and grace you bring into my life.`,
    ],
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Maison d'Amour server listening on http://localhost:${port}`);
  });
}

startServer();
