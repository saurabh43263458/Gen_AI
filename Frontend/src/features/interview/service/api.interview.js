import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/interview";

export const interviewApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("prepai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Generate interview preparation report
 * Supports either multipart FormData (with PDF resume file) or JSON (raw resume text)
 */
export async function generateInterviewReport({ resumeFile, resumeText, selfDescription, jobDescription }) {
  if (resumeFile) {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    if (selfDescription) formData.append("selfDescription", selfDescription);
    if (jobDescription) formData.append("jobDescription", jobDescription);

    const response = await interviewApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } else {
    const response = await interviewApi.post("/", {
      resume: resumeText || "",
      selfDescription: selfDescription || "",
      jobDescription: jobDescription || "",
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
}

/**
 * Get all interview reports for authenticated user
 */
export async function getInterviewHistory() {
  const response = await interviewApi.get("/");
  return response.data;
}

/**
 * Get single interview report by ID
 */
export async function getInterviewById(id) {
  const response = await interviewApi.get(`/${id}`);
  return response.data;
}

/**
 * Delete interview report by ID
 */
export async function deleteInterviewReport(id) {
  const response = await interviewApi.delete(`/${id}`);
  return response.data;
}

