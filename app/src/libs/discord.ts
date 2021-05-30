import { discordAuth } from "../contexts/UserContext";

const baseUrl = "https://discord.com/api";

export const discordRefreshTokenExchange = async (refresh_token: string) => {
  const res: any = await discordAuth({
    code: "",
    grant_type: "refresh_token",
    refresh_token,
  })
    // .then((data: any) => {
    //   const { data: tokens } = data;
    //   return fetch(`${baseUrl}/users/@me`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${tokens.access_token}`,
    //     },
    //   })
    //     .then((r) => r.json())
    //     .then((dUser) => {
    //       return {
    //         ...dUser,
    //         refreshToken: tokens.refresh_token,
    //         accessToken: tokens.access_token,
    //       };
    //     });
    // })
    .catch(console.log);
  console.log(res);
  const data = res.data;
  const { dUser, userRecord, tokens, token } = data;
  return { dUser, userRecord, tokens, token };
};
