import {create} from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import axios from 'axios'
import { API_URL } from '@/config'
import { LoginInputState, SignupInputState } from '@/schema/userSchema'
import { toast } from 'sonner'

const API_END_POINT = `${API_URL}/api/v1/user`
axios.defaults.withCredentials = true

type User = {
  fullname: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
}

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  loadingForUpdate: boolean,
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkingAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: any) => Promise<void>;
}

export const useUserStore = create<UserState>()(persist((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,
  loadingForUpdate: false,

  // signup api implementation
  signup: async (input: SignupInputState) => {
    try {
      set({ loading: true })
      const response = await axios.post(`${API_END_POINT}/signup`, input, {
        headers: {
          'Content-Type': "application/json"
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({loading:false, user: response.data.user, isAuthenticated: true });
      } else {
        set({loading: false})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({ loading: false });
    }
  },

  // login api implementation
  login: async (input: LoginInputState) => {
    try {
      set({ loading: true })
      const response = await axios.post(`${API_END_POINT}/login`, input, {
        headers: {
          'Content-Type': "application/json"
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        console.log(`user: ${response.data.user}`);
        
        set({loading:false, user: response.data.user, isAuthenticated: true });
      } else {
        set({loading: false})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({ loading: false });
    }
  },

  // email verification api implementation
  verifyEmail: async (verificationCode: string) => {
    try {
      set({ loading: true })
      const response = await axios.post(`${API_END_POINT}/verify-email`, {verificationCode}, {
        headers: {
          'Content-Type': "application/json"
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        set({loading:false, user: response.data.user, isAuthenticated: true });
      } else {
        set({loading: false})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({ loading: false });
    }
  },

  // checking if user is authenticated or not
  checkingAuthentication: async () => {
    try {
      set({isCheckingAuth: true})
      const response = await axios.get(`${API_END_POINT}/check-auth`)
      if (response.data.success) {
        // console.log("User Authenticated", response.data.user);
        
        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false })
      } else {
        set({ isAuthenticated: false, isCheckingAuth: false })
      }
    } catch (error) {
      set({isAuthenticated: false, isCheckingAuth: false})
    }
  },

  // logout
  logout: async() => {
    try {
      set({loading: true})
      const response = await axios.post(`${API_END_POINT}/logout`)
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.clear()
        set({loading: false, user:null, isAuthenticated: false})
      }
    } catch (error) {
      set({loading: false})
    }
  },

  // forgot password
  forgotPassword: async (email: string) => {
    try {
      set({loading: true})
      const response = await axios.post(`${API_END_POINT}/forgot-password`, { email }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        set({loading: false})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({loading: false})
    }
  },

  // reset password
  resetPassword: async (token: string, newPassword: string) => {
    try {
      set({loading: true})
      const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        set({loading: false})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({loading: false})
    }
  },

  // update profile
  updateProfile: async (input: any) => {
    try {
      console.log(input);
      
      set({loadingForUpdate: true})
      const response = await axios.post(`${API_END_POINT}/profile/update`, input , {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        set({loadingForUpdate: false, user: response.data.user, isAuthenticated: true})
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      set({loading: false})
    }
  },
}),
  {
    name: "user-name",
    storage: createJSONStorage(() => localStorage),
  }
));
