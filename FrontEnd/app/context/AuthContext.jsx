'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUser: () => {},
});

const API_BASE_URLS = ['http://localhost:5000', 'http://127.0.0.1:5000'];

// Helper thực hiện POST với fallback cổng
const apiPost = async (path, body, headers = {}) => {
  let lastError;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await axios.post(`${baseUrl}${path}`, body, { headers });
      return res.data;
    } catch (err) {
      lastError = err;
      // Nếu server đã phản hồi (status 400, 401, 403, 500...), nghĩa là kết nối được, trả về lỗi từ server
      if (err.response) {
        throw err;
      }
      // Nếu lỗi mạng (ERR_CONNECTION_REFUSED), thử tiếp URL tiếp theo
    }
  }
  throw lastError;
};

// Helper thực hiện GET với fallback cổng
const apiGet = async (path, headers = {}) => {
  let lastError;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await axios.get(`${baseUrl}${path}`, { headers });
      return res.data;
    } catch (err) {
      lastError = err;
      if (err.response) {
        throw err;
      }
    }
  }
  throw lastError;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đăng xuất: xóa storage và reset state
  const logout = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hk_user');
        localStorage.removeItem('hk_token');
        localStorage.removeItem('sand_user');
        localStorage.removeItem('sand_token');
      }
    } catch (e) {
      console.error('Lỗi khi xóa session:', e);
    }
    setUser(null);
    setToken(null);
  }, []);

  // Khởi tạo: kiểm tra token trong localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('hk_user') || localStorage.getItem('sand_user');
        const storedToken = localStorage.getItem('hk_token') || localStorage.getItem('sand_token');

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);

            // Kiểm tra tính hợp lệ của token với Backend
            const res = await apiGet('/client/auth/user-info', {
              Authorization: `Bearer ${storedToken}`,
            });

            if (res && res.success && res.data) {
              const freshUser = {
                id: res.data._id || res.data.id,
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone,
                address: res.data.address || '',
                tokenUser: storedToken,
              };
              setUser(freshUser);
              localStorage.setItem('hk_user', JSON.stringify(freshUser));
            }
          } catch (validateErr) {
            // Nếu token hết hạn hoặc tài khoản bị khóa (401/403)
            if (validateErr.response?.status === 401 || validateErr.response?.status === 403) {
              console.warn('Phiên đăng nhập không hợp lệ, đăng xuất:', validateErr.message);
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khởi tạo Auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Đồng bộ giữa các tab trình duyệt
    const handleStorageChange = (e) => {
      if (e.key === 'hk_user' || e.key === 'hk_token' || e.key === 'sand_user' || e.key === 'sand_token') {
        const storedUser = localStorage.getItem('hk_user') || localStorage.getItem('sand_user');
        const storedToken = localStorage.getItem('hk_token') || localStorage.getItem('sand_token');
        if (storedUser && storedToken) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } catch {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await apiPost('/client/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res && res.success && res.data) {
        const userData = {
          id: res.data.id || res.data._id,
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address || '',
          tokenUser: res.data.tokenUser,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('hk_user', JSON.stringify(userData));
          localStorage.setItem('hk_token', res.data.tokenUser);
        }

        setUser(userData);
        setToken(res.data.tokenUser);

        return {
          success: true,
          message: res.message || 'Đăng nhập thành công!',
          user: userData,
        };
      }

      return {
        success: false,
        message: res.message || 'Đăng nhập không thành công',
      };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
      return {
        success: false,
        message: msg,
      };
    }
  };

  // Đăng ký
  const register = async (formData) => {
    try {
      const res = await apiPost('/client/auth/register', formData);

      if (res && res.success && res.data) {
        return {
          success: true,
          message: res.message || 'Đăng ký tài khoản thành công!',
          data: res.data,
        };
      }

      return {
        success: false,
        message: res.message || 'Đăng ký không thành công',
      };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Có lỗi xảy ra khi đăng ký tài khoản.';
      return {
        success: false,
        message: msg,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
