import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PacsAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  private readonly authUrl =
    'https://auth.medicai.io/auth/realms/production/protocol/openid-connect/token';

  private readonly clientId = process.env.DICOM_CLIENT_ID ?? '';
  private readonly clientSecret = process.env.DICOM_CLIENT_SECRET ?? '';
  private readonly username = process.env.DICOM_USERNAME ?? '';
  private readonly password = process.env.DICOM_PASSWORD ?? '';

  async getAccessToken(): Promise<string> {
    // If token exists and not expired → return
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Otherwise, fetch a new one
    return this.fetchToken();
  }

  private async fetchToken(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('username', this.username);
      params.append('password', this.password);
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('grant_type', 'password');
      params.append('scope', 'orthanc:studies:dicom-web offline_access');

      const response = await axios.post(this.authUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = response.data;

      if (!data.access_token) {
        throw new Error('No access token in response');
      }

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.accessToken!;
    } catch (error) {
      throw new HttpException(
        `Error fetching PACS token: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}
