"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Prevent duplicate processing
      if (processedRef.current) {
        console.log('Already processed OAuth callback, skipping');
        return;
      }
      processedRef.current = true;

      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('oauth_state');

        console.log('OAuth callback parameters:', {
          code: code ? '***' : 'not present',
          state,
          storedState,
          url: window.location.href
        });

        // Verify state to prevent CSRF attacks
        if (!state || state !== storedState) {
          console.error('State mismatch:', {
            received: state,
            stored: storedState,
            match: state === storedState
          });
          throw new Error('Invalid state parameter');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange the code for tokens
        const requestBody = {
          grant_type: 'authorization_code',
          code,
          client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'http://localhost:3001/oauth'
        };

        console.log('Token exchange request:', {
          ...requestBody,
          client_secret: requestBody.client_secret ? '***' : 'not set',
          client_id: requestBody.client_id || 'not set',
          redirect_uri: requestBody.redirect_uri || 'not set'
        });

        const response = await fetch('http://localhost:3000/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Token exchange response status:', response.status);
        const responseText = await response.text();
        console.log('Token exchange response:', responseText);

        if (!response.ok) {
          throw new Error(`Failed to exchange code for tokens: ${responseText}`);
        }

        const data = JSON.parse(responseText);

        // Store tokens and auth method
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        localStorage.setItem('authMethod', 'oauth');
        
        // Store user info
        if (data.user) {
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userId', data.user.id);
          if (data.user.avatar) {
            localStorage.setItem('userAvatar', data.user.avatar);
          }
          console.log('Stored user info:', {
            name: data.user.name,
            email: data.user.email,
            id: data.user.id
          });
        } else {
          console.warn('No user info received in OAuth response');
        }

        // Clean up
        localStorage.removeItem('oauth_state');

        // Update auth state and redirect
        login();
        router.push('/');
      } catch (error) {
        console.error('OAuth error:', error);
        setError(error.message);
        // Reset the processed flag on error so we can retry
        processedRef.current = false;
      }
    };

    handleOAuthCallback();
  }, [router, login]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Authentication...</h1>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  );
} 