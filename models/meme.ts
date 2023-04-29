import client from "../db/mysql.ts";
import cache from "../db/redis.ts";
import MemeImage from "../interfaces/meme.ts";

export default {
  getById: async (id: number): Promise<MemeImage | null> => {
    const cached: MemeImage = JSON.parse(
      await cache.get(`bbswiki-meme-${id}`) as string,
    );
    let result: MemeImage | null = null;
    if (!cached) {
      const dbImg =
        (await client.query("SELECT * FROM imgs WHERE id = ?", [id]))[0];
      if (!dbImg) {
        return null;
      }
      result=dbImg
      await cache.set(`bbswiki-meme-${id}`, JSON.stringify(result), {
        ex: 86400,
      });
    } else {
      result = cached;
    }
    return result;
  },
  imgCount:
    (await client.query("SELECT COUNT(*) AS count FROM imgs;"))[0].count,
};
