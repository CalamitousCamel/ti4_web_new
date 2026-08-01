const devConfig = {
  api: {
    mapsUrl: "https://asyncti4.com/maps.json",
    websiteBase: "http://localhost:5173/",
    discordRedirectUri: "http://localhost:5173/login",
    gameDataUrl: "/bot/api/public/game",
    botApiUrl: "/bot/api",
    websocketUrl: "wss://bot.asyncti4.com/ws",
    // websocketUrl: "ws://localhost:8081/ws",
  },
};

const prodConfig = {
  api: {
    mapsUrl: "/api/public/games",
    websiteBase: "https://ti4.thecastle.dev/",
    discordRedirectUri: "https://ti4.thecastle.dev/login",
    gameDataUrl: "/api/public/game",
    botApiUrl: "/api",
    websocketUrl: "wss://ti4.thecastle.dev/ws",
  },
};

export const config = import.meta.env.DEV ? devConfig : prodConfig;
