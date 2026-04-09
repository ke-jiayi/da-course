import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

// 仅在URL和密钥不是默认值时创建客户端
export const supabase = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
        getUser: () => Promise.resolve({ data: { user: null } }),
        signOut: () => Promise.resolve({}),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: null }),
        resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
      },
    } as any
