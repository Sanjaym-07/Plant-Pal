import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CropData, FertilizerData, PestData, YieldData, SustainabilityData } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string."));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const getCropRecommendations = async (farmingType: string, params: Record<string, any>, suggestion?: string): Promise<{ recommendations: CropData[], combinedPrompt: string }> => {
  try {
    const paramString = Object.entries(params).map(([key, value]) => `- ${key}: ${value}`).join('\n');
    const suggestionText = suggestion 
        ? `The user has also provided a specific suggestion to consider: "${suggestion}". Please factor this preference into your recommendations, but still prioritize crops that are genuinely suitable for the given parameters.` 
        : '';
        
    const prompt = `Based on the following parameters for "${farmingType}", recommend the top 3 most suitable crops. Your recommendations MUST be strictly based on these parameters to ensure they are viable for the user's environment.
    ${paramString}
    
    ${suggestionText}
    
    Return a JSON object with two keys: "recommendations" and "combinedPrompt".

    The "recommendations" key should be an array of 3 objects, where each object provides:
    1. The crop name.
    2. Detailed reasoning for its suitability based on the provided parameters.
    3. A detailed, photorealistic visual description of the plant itself, suitable for an AI image generation model.

    The "combinedPrompt" key should be a direct and clear instruction for a generative AI model. The goal is to perform a photorealistic edit, adding the three recommended plants into a user-provided image of their environment, making it look as if the entire space is filled with them.

    **Prompt to be generated for "combinedPrompt":**
    "Your task is to perform a highly realistic photo edit. You will be given a user's image of an environment (like a balcony, garden, or field) and a list of three plants. Your mission is to realistically integrate these three plants into the user's image, making it look as though they are growing abundantly and filling the entire available space.

    **Core Instructions:**
    1.  **Fill the Space:** The main goal is to create a lush, full, and thriving garden scene. Intelligently place and arrange the three recommended plants to cover as much of the plausible growing area in the photo as possible. This should look like a mature, well-established garden, not just a few new plants.
    2.  **Absolute Realism:** The integration must be seamless. The final image should look like a real photograph, not a digital composite.
        -   **Match Lighting & Shadows:** The plants must cast realistic shadows that align perfectly with the light sources in the original photo. Highlights and reflections on the leaves must also match.
        -   **Correct Scale & Perspective:** The plants must be sized appropriately for the environment. Objects further away should be smaller.
        -   **Plausible Integration:** While filling the space, the placement must still make sense. Place plants in soil, in pots, or in garden beds shown in the image. They should look rooted in the environment.
    3.  **Do Not Alter the Original Scene:** Do not change the background, buildings, or any non-plant objects in the user's photo. You are only adding the plants to it.
    4.  **Harmonious Composition:** Arrange the three different plant types together in a way that looks natural and aesthetically pleasing, as if they were planted together intentionally.

    The final output must be a single, convincing photograph that shows the user the full potential of their space, transformed into a vibrant, plant-filled environment."`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the crop." },
                    reasoning: { type: Type.STRING, description: "Detailed reasoning why this crop is suitable." },
                    visualDescription: { type: Type.STRING, description: "A detailed visual prompt for an image generator for the plant itself." },
                  },
                  required: ["name", "reasoning", "visualDescription"],
              }
            },
            combinedPrompt: {
              type: Type.STRING,
              description: "A single, comprehensive prompt to visualize all three recommended crops together in a user's environment."
            }
          },
          required: ["recommendations", "combinedPrompt"],
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting crop recommendations:", error);
    throw new Error("Failed to fetch crop recommendations from AI.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image with AI.");
    }
};

export const visualizeInEnvironment = async (environmentImage: File, prompt: string): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(environmentImage);
        const textPart = { text: prompt };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error visualizing in environment:", error);
        throw new Error("Failed to create visualization with AI.");
    }
}


export const getFertilizerAdvice = async (crop: string): Promise<FertilizerData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a detailed fertilizer and water management plan for cultivating ${crop}. Include the type of fertilizer (e.g., NPK ratio), the quantity per hectare, a recommended irrigation schedule (e.g., frequency and amount), and reasoning for these choices.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, description: "Recommended fertilizer type (e.g., NPK 20-20-20)." },
                        quantity: { type: Type.STRING, description: "Recommended quantity (e.g., kg/hectare)." },
                        schedule: { type: Type.STRING, description: "Recommended irrigation schedule." },
                        reasoning: { type: Type.STRING, description: "Reasoning for the recommendations." },
                    },
                    required: ["type", "quantity", "schedule", "reasoning"],
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting fertilizer advice:", error);
        throw new Error("Failed to fetch fertilizer advice from AI.");
    }
};

export const detectPestOrDisease = async (imageFile: File, description: string): Promise<PestData> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [
                imagePart,
                { text: `Analyze this image of a crop plant. The user also provided this description: "${description}". Identify the most likely pest or disease. Provide a description of the issue, a confidence score (0-1), and a detailed remedy or treatment plan.` }
            ]},
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pestOrDisease: { type: Type.STRING, description: "Name of the identified pest or disease." },
                        description: { type: Type.STRING, description: "Description of the symptoms and the pest/disease." },
                        confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." },
                        remedy: { type: Type.STRING, description: "Suggested treatment or remedy plan." },
                    },
                    required: ["pestOrDisease", "description", "confidence", "remedy"],
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error detecting pest/disease:", error);
        throw new Error("Failed to analyze the image with AI.");
    }
};


export const getYieldPrediction = async (crop: string, area: number, conditions: string): Promise<YieldData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Predict the potential yield for ${crop} planted on ${area} hectares.
            Current conditions are: ${conditions}.
            Provide the estimated yield (in tonnes/hectare), a confidence level for the prediction, and three key pieces of advice to maximize this yield.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        estimatedYield: { type: Type.STRING, description: "The predicted yield, e.g., '5-7 tonnes/hectare'." },
                        confidence: { type: Type.STRING, description: "Confidence level, e.g., 'High', 'Medium', 'Low'." },
                        advice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of three tips to maximize yield." },
                    },
                    required: ["estimatedYield", "confidence", "advice"],
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting yield prediction:", error);
        throw new Error("Failed to fetch yield prediction from AI.");
    }
};


export const getSustainabilityAnalysis = async (data: { water: number; carbon: number; soil: string }): Promise<SustainabilityData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following agricultural sustainability metrics:
            - Water used (liters/hectare): ${data.water}
            - Estimated carbon footprint (kg CO2e/hectare): ${data.carbon}
            - Soil health description: "${data.soil}"

            Provide a score from 1-100 for each of the three areas (water usage, carbon footprint, soil health). A higher score is better.
            Also, provide 3 actionable recommendations for improving overall sustainability.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        waterUsageScore: { type: Type.NUMBER, description: "Score for water usage (1-100)." },
                        carbonFootprintScore: { type: Type.NUMBER, description: "Score for carbon footprint (1-100)." },
                        soilHealthScore: { type: Type.NUMBER, description: "Score for soil health (1-100)." },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of three sustainability recommendations." },
                    },
                    required: ["waterUsageScore", "carbonFootprintScore", "soilHealthScore", "recommendations"],
                },
            },
        });
        return JSON.parse(response.text);
    // FIX: Added missing curly braces for the catch block.
    } catch (error) {
        console.error("Error getting sustainability analysis:", error);
        throw new Error("Failed to fetch sustainability analysis from AI.");
    }
};