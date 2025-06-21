import axios from "axios";

const TOGETHER_API_ENDPOINT = "https://api.together.xyz/v1/chat/completions";

export const queryLLama = async (prompt: string, apiKey: string) => {
  try {
    const response = await axios.post(
      TOGETHER_API_ENDPOINT,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
