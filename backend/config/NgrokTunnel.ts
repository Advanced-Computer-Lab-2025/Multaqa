import axios from "axios";

interface NgrokTunnel {
  public_url: string;
  proto: string;
  config: { addr: string };
}

interface NgrokApiResponse {
  tunnels: NgrokTunnel[];
}

export async function getNgrokUrl(): Promise<string | null> {
  try {
    const res = await axios.get<NgrokApiResponse>("http://127.0.0.1:4040/api/tunnels");

    if (!res.data.tunnels || res.data.tunnels.length === 0) {
      console.error("❌ No active Ngrok tunnels found.");
      return null;
    }

    const url = res.data.tunnels[0].public_url;
    console.log("✅ Current Ngrok URL:", url);

    return url;
  } catch (error: any) {
    console.error("❌ Could not fetch Ngrok URL:", error.message);
    return null;
  }
}
