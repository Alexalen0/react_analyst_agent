import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

export const processFile = async (file: File): Promise<any> => {
  const fileType = file.name.split(".").pop()?.toLowerCase() || "";

  switch (fileType) {
    case "txt":
      return await processTextFile(file);
    case "docx":
      return await processDocxFile(file);
    case "pdf":
      return await processPdfFile(file);
    case "csv":
    case "xlsx":
      return await processSpreadsheet(file);
    case "png":
    case "jpg":
    case "jpeg":
      return await processImage(file);
    default:
      throw new Error("Unsupported file type");
  }
};

const processTextFile = async (file: File): Promise<string> => {
  return await file.text();
};

const processDocxFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const processPdfFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return text;
};

const processSpreadsheet = async (file: File): Promise<any[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
};

const processImage = async (file: File): Promise<string> => {
  const worker = await createWorker();
  const imageUrl = URL.createObjectURL(file);
  const {
    data: { text },
  } = await worker.recognize(imageUrl);
  await worker.terminate();
  return text;
};
