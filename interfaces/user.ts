export interface BBSActivities {
  post: number;
  thread: number;
  digiest: number;
  currentGroupID: number;
  currentGroupText: string;
}

export interface BBSCredit {
  nugget: number;
  gem: number;
  heart: number;
  ingot: number;
  contribute: number;
  popularity: number;
  diamond: number;
  star: number;
  credit: number;
}
export interface BBSUser {
  uid: number;
  nickname: string;
  credits: BBSCredit;
  activites: BBSActivities;
}
export const BBSUserGroup: Record<number, string> = {
  10: "LV0",
  11: "LV1",
  12: "LV2",
  13: "LV3",
  14: "LV4",
  15: "LV5",
  20: "LV6",
  21: "LV7",
  22: "LV8",
  23: "LV9",
  27: "LV10",
  28: "LV11",
  29: "LV12",
  4: "BANPOST",
  5: "BANID",
  6: "BANIP",
  9: "HEROBRINE",
  57: "BI",
  54: "AFDIAN",
  59: "ADVENTURER",
  47: "VERIFY",
  43: "ARTIST",
  8: "WAIT_VERIFY",
  1: "ADMIN",
  48: "ADMIN_ASSISTANT",
};
