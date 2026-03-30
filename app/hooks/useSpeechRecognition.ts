"use client";
import { useState, useRef, useCallback } from "react";

interface SpeechResult {
  transcript: string;
  description: string;
  amount: string;
  type: "income" | "expense";
}

const INCOME_KEYWORDS = [
  "รายรับ", "เงินเดือน", "ได้เงิน", "รับเงิน", "โบนัส", "ค่าจ้าง",
  "เงินได้", "รายได้", "ได้รับ", "เงินโอน", "ขายของ", "ให้"
];

function parseTranscript(text: string): SpeechResult {
  const transcript = text.trim();

  // Extract number (amount) - support Thai and Arabic numerals
  const thaiToArabic = (s: string) =>
    s.replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50));

  const normalized = thaiToArabic(transcript);
  const numberMatch = normalized.match(/[\d,]+\.?\d*/);
  const amount = numberMatch ? numberMatch[0].replace(/,/g, "") : "";

  // Determine type based on keywords
  const isIncome = INCOME_KEYWORDS.some((kw) => transcript.includes(kw));
  const type: "income" | "expense" = isIncome ? "income" : "expense";

  // Description = remove amount, "บาท", and income keywords, then clean up
  let description = normalized;
  if (numberMatch) {
    description = description.replace(numberMatch[0], "");
  }
  description = description
    .replace(/บาท/g, "")
    .replace(/จำนวน/g, "")
    .replace(/เงิน/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Remove leading/trailing income keywords from description
  for (const kw of INCOME_KEYWORDS) {
    description = description.replace(kw, "").trim();
  }

  return { transcript, description, amount, type };
}

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(
    (onResult: (result: SpeechResult) => void) => {
      if (!isSupported) {
        setError("เบราว์เซอร์ไม่รองรับ Speech Recognition");
        return;
      }

      setError(null);
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.lang = "th-TH";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const parsed = parseTranscript(transcript);
        onResult(parsed);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          setError("กรุณาอนุญาตการใช้ไมโครโฟน");
        } else if (event.error === "no-speech") {
          setError("ไม่ได้ยินเสียงพูด ลองใหม่อีกครั้ง");
        } else {
          setError(`เกิดข้อผิดพลาด: ${event.error}`);
        }
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return { isListening, isSupported, error, startListening, stopListening };
}
