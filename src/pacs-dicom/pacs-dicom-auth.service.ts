import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PacsAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshing = false;

  private readonly username = process.env.DICOM_USERNAME ?? '';
  private readonly password = process.env.DICOM_PASSWORD ?? '';
  private readonly clientId = process.env.DICOM_CLIENT_ID ?? '';
  private readonly clientSecret = process.env.DICOM_CLIENT_SECRET ?? '';
  private readonly tokenUrl =
    'https://auth.medicai.io/auth/realms/production/protocol/openid-connect/token';

  async getAccessToken(): Promise<string> {
    if (
      this.accessToken &&
      this.tokenExpiry &&
      Date.now() < this.tokenExpiry - 5000
    ) {
      return this.accessToken;
    }

    if (this.refreshToken) {
      try {
        await this.fetchTokenWithRefresh();
        return this.accessToken!;
      } catch {}
    }

    await this.fetchTokenWithPassword();
    return this.accessToken!;
  }

  private async fetchTokenWithPassword() {
    await this.requestToken({
      grant_type: 'password',
      username: this.username,
      password: this.password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'orthanc:studies:dicom-web offline_access',
    });
  }

  private async fetchTokenWithRefresh() {
    await this.requestToken({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken ?? '',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
  }

  private async requestToken(paramsObj: Record<string, string>) {
    try {
      const params = new URLSearchParams(paramsObj);
      const response = await axios.post(this.tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 3000,
      });

      const result = response.data;

      if (!result.access_token) {
        throw new HttpException(
          `Failed to fetch token: ${JSON.stringify(result)}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      this.accessToken = result.access_token;
      this.refreshToken = result.refresh_token ?? null;
      this.tokenExpiry = Date.now() + result.expires_in * 1000;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
