import { supabase } from '../supabase';

export async function login(username: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return { success: false, message: 'User not found' };
  }

  if (password === user.password) {
    return { success: true, user: { id: user.id, username: user.username, role: user.role } };
  } else {
    return { success: false, message: 'Incorrect password' };
  }
}
