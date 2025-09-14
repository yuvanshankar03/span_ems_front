import { authService } from '../services/authService';

const TOKEN_REFRESH_THRESHOLD = 3 * 60 * 1000; // 3 minutes in milliseconds

export const scheduleTokenRefresh = (accessToken: string, onRefresh: (newToken: string) => void, onError: () => void) => {
  try {
    // Decode the token to get expiration time
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    // Schedule refresh 3 minutes before expiration
    const refreshTime = timeUntilExpiration - TOKEN_REFRESH_THRESHOLD;
    
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await authService.refresh(refreshToken);
          onRefresh(response.accessToken);
          
          // Schedule next refresh
          scheduleTokenRefresh(response.accessToken, onRefresh, onError);
          
        } catch (error) {
          console.error('Token refresh failed:', error);
          onError();
        }
      }, refreshTime);
    }
  } catch (error) {
    console.error('Error scheduling token refresh:', error);
  }
};

// Utility to decode token and check expiration
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    return timeUntilExpiration <= TOKEN_REFRESH_THRESHOLD;
  } catch (error) {
    return true; // If we can't decode, assume it's expiring
  }
};