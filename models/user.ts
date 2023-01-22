import cache from "../db/redis.ts";
import { Document, DOMParser } from "deno_dom/deno-dom-wasm.ts";
import { BBSActivities, BBSCredit, BBSUser } from "../interfaces/user.ts";
const creditRegex =
  /<li><em>积分<\/em>(-?[0-9]+)<\/li><li><em>人气<\/em>(-?[0-9]+) 点<\/li>\n<li><em>金粒<\/em>(-?[0-9]+) 粒<\/li>\n<li><em>金锭\[已弃用\]<\/em>(-?[0-9]+) 块<\/li>\n<li><em>宝石<\/em>(-?[0-9]+) 颗<\/li>\n<li><em>下界之星<\/em>(-?[0-9]+) 枚<\/li>\n<li><em>贡献<\/em>(-?[0-9]+) 份<\/li>\n<li><em>爱心<\/em>(-?[0-9]+) 心<\/li>\n<li><em>钻石<\/em>(-?[0-9]+) 颗<\/li>/;
//const creditList = ['积分', '人气', '金粒', '金锭', '宝石', '下界之心', '贡献', '爱心', '钻石'];
//const usernameRegex = /<h2 class="mt">\n([\s\S]+?)<\/h2>/;
//const adminGroupRegex = /<em class="xg1">管理组&nbsp;&nbsp;<\/em><span[\s\S]+?><a href="home\.php\?mod=spacecp&amp;ac=usergroup&amp;gid=([0-9]+)" target="_blank">([\s\S]+?)<\/a>/;
const userGroupRegex =
  /<em class="xg1">用户组&nbsp;&nbsp;<\/em><span[\s\S]+?><a href="home\.php\?mod=spacecp&amp;ac=usergroup&amp;gid=([0-9]+)" target="_blank">([\s\S]+?)<\/a>/;
//const userGroupExRegex = /<li><em class="xg1">扩展用户组&nbsp;&nbsp;<\/em>([\s\S]+?)<\/li>/;
const postsRegex = / target="_blank">回帖数 (-?[0-9]+?)<\/a>/;
const threadsRegex = / target="_blank">主题数 (-?[0-9]+?)<\/a>/;
const fontRegex = /<font .*?>(.*?)<\/font>/;
export async function getUser(uid: number): Promise<BBSUser | null> {
  const cached: BBSUser = JSON.parse(
    await cache.get(`bbswiki-user-${uid}`) as string,
  );
  let result: BBSUser | null = null;
  if (!cached) {
    const bbsuser = await getUserInfo(uid);
    if (!bbsuser) {
      return null;
    }
    result = bbsuser;
    await cache.set(`bbswiki-user-${uid}`, JSON.stringify(result), {
      ex: 10800000,
    });
  } else {
    result = cached;
  }
  return result;
}

async function getUserInfo(uid: number): Promise<BBSUser | null> {
  const doc = await fetchDocument(uid);
  const profileHTML = doc.querySelector("#ct .u_profile")!.innerHTML;
  if (profileHTML) {
    if (doc?.querySelector(".messagetext")) {
      return null;
    }
    const nickname: string = doc.querySelector(".mt")!.innerText.trim();
    const credits = getUserCredits(profileHTML);
    const activites = getUserActivites(profileHTML, credits);
    return {
      uid,
      nickname,
      activites,
      credits,
    };
  } else {
    return null;
  }
}
function calcDigiest(
  credits: BBSCredit,
  posts: number,
  threads: number,
): number {
  const totalPost = Math.floor((posts + threads) / 3);
  const temp1 = totalPost + threads * 2 + credits.heart * 4 +
    credits.diamond * 2 + credits.contribute * 10 + credits.popularity * 3;
  const digiest = Math.floor((credits.credit - temp1) / 45);
  return digiest > 0 ? digiest : 0;
}
function getUserActivites(doc: string, credits: BBSCredit): BBSActivities {
  const post = parseInt(postsRegex.exec(doc)![1]);
  const thread = parseInt(threadsRegex.exec(doc)![1]);
  const currentGroupParsed = userGroupRegex.exec(doc)!;
  const currentGroupTextParsed=fontRegex.exec(currentGroupParsed[2])!
  return {
    post,
    thread,
    digiest: calcDigiest(credits, post, thread),
    currentGroupID: parseInt(currentGroupParsed[1]),
    currentGroupText: currentGroupTextParsed ? currentGroupTextParsed[1] : currentGroupParsed[2],
  };
}
function getUserCredits(doc: string): BBSCredit {
  const creditParse = creditRegex.exec(doc)!;
  return {
    popularity: parseInt(creditParse[2]),
    heart: parseInt(creditParse[8]),
    contribute: parseInt(creditParse[7]),
    gem: parseInt(creditParse[5]),
    star: parseInt(creditParse[6]),
    nugget: parseInt(creditParse[3]),
    diamond: parseInt(creditParse[9]),
    ingot: parseInt(creditParse[4]),
    credit: parseInt(creditParse[1]),
  };
}
async function fetchDocument(uid: number): Promise<Document> {
  const req = await fetch(`https://www.mcbbs.net/?${uid}`);
  return new DOMParser().parseFromString(
    await req.text(),
    "text/html",
  ) as Document;
}
