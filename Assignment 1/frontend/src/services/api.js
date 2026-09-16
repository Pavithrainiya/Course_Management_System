import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cms_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cms_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/token/refresh/`, { refresh: refreshToken });
          if (res.data?.access) {
            localStorage.setItem('cms_access_token', res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return client(originalRequest);
          }
        } catch (refreshErr) {
          console.warn('Session refresh notice:', refreshErr);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth APIs
  login: async (username, password) => {
    const response = await client.post('auth/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('cms_access_token', response.data.access);
      localStorage.setItem('cms_refresh_token', response.data.refresh);
      localStorage.setItem('cms_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await client.post('auth/register/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await client.get('auth/me/');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await client.put('auth/me/', profileData);
    if (response.data?.user) {
      localStorage.setItem('cms_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await client.post('auth/change-password/', passwordData);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await client.post('auth/forgot-password/', data);
    return response.data;
  },

  resetPasswordWithCode: async (data) => {
    const response = await client.post('auth/reset-password/', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('cms_access_token');
    localStorage.removeItem('cms_refresh_token');
    localStorage.removeItem('cms_user');
  },

  // Courses APIs
  getCourses: async () => {
    const response = await client.get('courses/');
    return Array.isArray(response.data) ? response.data : (response.data?.results || []);
  },

  getCourse: async (id) => {
    const response = await client.get(`courses/${id}/`);
    return response.data;
  },

  createCourse: async (data) => {
    const response = await client.post('courses/', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await client.put(`courses/${id}/`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await client.delete(`courses/${id}/`);
    return response.data;
  },

  // Students APIs
  getStudents: async () => {
    const response = await client.get('students/');
    return Array.isArray(response.data) ? response.data : (response.data?.results || []);
  },

  deleteStudent: async (id) => {
    const response = await client.delete(`students/${id}/`);
    return response.data;
  },

  // Enrollments APIs
  getEnrollments: async () => {
    const response = await client.get('enrollments/');
    return Array.isArray(response.data) ? response.data : (response.data?.results || []);
  },

  enrollCourse: async (courseId, studentId = null) => {
    const response = await client.post('enrollments/', { course: courseId, student: studentId });
    return response.data;
  },

  unenrollCourse: async (id) => {
    const response = await client.delete(`enrollments/${id}/`);
    return response.data;
  },

  deleteEnrollment: async (id) => {
    const response = await client.delete(`enrollments/${id}/`);
    return response.data;
  },

  // Course Content APIs
  getCourseContents: async () => {
    const response = await client.get('course-content/');
    return Array.isArray(response.data) ? response.data : (response.data?.results || []);
  },

  addCourseContent: async (contentData) => {
    const response = await client.post('course-content/', contentData);
    return response.data;
  },

  // Interactive AI & Learning APIs
  askAI: async (query, courseName = 'General', intent = 'explain') => {
    const response = await client.post('ai/assistant/', { query, course_name: courseName, intent });
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await client.post(`quizzes/${quizId}/submit/`, { answers });
    return response.data;
  },

  toggleLessonProgress: async (lessonId) => {
    const response = await client.post(`lessons/${lessonId}/toggle-complete/`);
    return response.data;
  },

  getCertificate: async (courseId) => {
    const response = await client.get(`certificates/${courseId}/`);
    return response.data;
  },

  getAllCertificates: async () => {
    const response = await client.get('certificates/');
    return response.data;
  },

  generateCertificate: async (data) => {
    const response = await client.post('certificates/generate/', data);
    return response.data;
  },

  approveCertificate: async (certId) => {
    const response = await client.post(`certificates/${certId}/approve/`);
    return response.data;
  },

  // Stats API
  getDashboardStats: async () => {
    const response = await client.get('dashboard/stats/');
    return response.data;
  },

  // Admin Email Notification API
  sendEmailNotification: async (emailData) => {
    const response = await client.post('notifications/send-email/', emailData);
    return response.data;
  }
};
