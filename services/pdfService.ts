const API_URL = "http://localhost:8000";

// TYPES

export interface PDFUploadResponse {
  success: boolean;
  id: number;
  filename: string;
  conversation_id: number;
  pages: number;
  chunks: number;
  message: string;
}

export interface PDFSummaryResponse {
  success: boolean;
  pdf_id: number;
  filename: string;
  summary: string;
}

export interface PDFQuestionResponse {
  success: boolean;
  pdf_id: number;
  filename: string;
  question: string;
  answer: string;
}
// UPLOAD PDF

export async function uploadPDF(
  file: File,
  conversationId: number
): Promise<PDFUploadResponse> {

  const formData = new FormData();

  // PDF file
  formData.append(
    "file",
    file
  );

  // Required by FastAPI:
  // conversation_id: int = Form(...)
  formData.append(
    "conversation_id",
    String(conversationId)
  );

  const response = await fetch(
    `${API_URL}/pdf/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {

    let errorMessage = "PDF upload failed";

    try {

      const errorData = await response.json();

      if (typeof errorData?.detail === "string") {

        errorMessage = errorData.detail;

      } else if (errorData?.detail) {

        errorMessage = JSON.stringify(
          errorData.detail
        );

      }

    } catch {

      try {

        const text = await response.text();

        if (text) {
          errorMessage = text;
        }

      } catch {
        // Keep default error message
      }
    }

    throw new Error(errorMessage);
  }

  const data =
    (await response.json()) as PDFUploadResponse;

  return data;
}

// GET PDF SUMMARY

export async function getPDFSummary(
  pdfId: number
): Promise<PDFSummaryResponse> {

  const response = await fetch(
    `${API_URL}/pdf/${pdfId}/summary`
  );

  if (!response.ok) {

    let errorMessage =
      "Failed to generate PDF summary";

    try {

      const errorData = await response.json();

      if (typeof errorData?.detail === "string") {

        errorMessage = errorData.detail;

      } else if (errorData?.detail) {

        errorMessage = JSON.stringify(
          errorData.detail
        );
      }

    } catch {
      // Keep default error
    }

    throw new Error(errorMessage);
  }

  return (
    (await response.json()) as PDFSummaryResponse
  );
}

// ASK QUESTION ABOUT PDF

export async function askPDFQuestion(
  pdfId: number,
  question: string
): Promise<PDFQuestionResponse> {

  const response = await fetch(
    `${API_URL}/pdf/ask`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        pdf_id: pdfId,
        question,
      }),
    }
  );

  if (!response.ok) {

    let errorMessage =
      "Failed to ask PDF question";

    try {

      const errorData = await response.json();

      if (typeof errorData?.detail === "string") {

        errorMessage = errorData.detail;

      } else if (errorData?.detail) {

        errorMessage = JSON.stringify(
          errorData.detail
        );
      }

    } catch {
      // Keep default error
    }

    throw new Error(errorMessage);
  }

  return (
    (await response.json()) as PDFQuestionResponse
  );
}