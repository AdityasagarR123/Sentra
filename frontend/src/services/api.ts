export interface PredictionRecord {
  row_index: number;
  prediction: string;
  confidence: number;
  risk_level: string;
  recommendation: string;
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  risk_level: string;
  recommendation: string;
  is_batch: boolean;
  total_samples: number;
  results: PredictionRecord[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cyber-threat-detection-backend-205p.onrender.com";

/**
 * Helper function to handle fetch with retry logic, specifically targeting
 * potential Render cold start states (which return 502/503/504 or trigger connection drops).
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  onWakeUp?: (message: string) => void,
  retriesRemaining = 1,
  delayMs = 8000
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // 502 Bad Gateway, 503 Service Unavailable, or 504 Gateway Timeout are common when Render wakes up
      if ([502, 503, 504].includes(response.status) && retriesRemaining > 0) {
        if (onWakeUp) {
          onWakeUp("Backend is starting. This may take up to a minute.");
        }
        console.warn(`Render backend returned status ${response.status} (waking up). Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return fetchWithRetry(url, options, onWakeUp, retriesRemaining - 1, delayMs);
      }
      
      // Attempt to extract error detail from JSON
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to text status
      }
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error: any) {
    // If it's a network error (failed to fetch) and we have retries remaining:
    if (retriesRemaining > 0) {
      if (onWakeUp) {
        onWakeUp("Backend is starting. This may take up to a minute.");
      }
      console.warn("Network connection failed, backend might be starting up. Retrying in 8s...", error);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(url, options, onWakeUp, retriesRemaining - 1, delayMs);
    }
    
    // Provide a cleaner message for offline/timeout errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Unable to connect to the threat detection backend. Please check your network or try again later.");
    }
    throw error;
  }
}

/**
 * Uploads a network CSV file to /predict/network.
 * Supports progress updates and cold start automatic retries.
 */
export async function uploadNetworkCSV(
  file: File,
  onWakeUp?: (message: string) => void
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/predict/network`;
  const response = await fetchWithRetry(
    url,
    {
      method: "POST",
      body: formData,
    },
    onWakeUp
  );

  return response.json();
}

/**
 * Uploads a malware CSV file to /predict/malware.
 * Supports progress updates and cold start automatic retries.
 */
export async function uploadMalwareCSV(
  file: File,
  onWakeUp?: (message: string) => void
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/predict/malware`;
  const response = await fetchWithRetry(
    url,
    {
      method: "POST",
      body: formData,
    },
    onWakeUp
  );

  return response.json();
}
