import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { validateUser } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await validateUser(data.username, data.password);
      
      if (user) {
        login(user);
        navigate('/admin');
      } else {
        setError('root', {
          message: 'Invalid username or password',
        });
      }
    } catch (error) {
      setError('root', {
        message: 'An error occurred during login',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            {...register('username')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#C17C74] focus:ring-[#C17C74]"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 text-center">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C17C74] hover:bg-[#A86B64] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C17C74]"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}