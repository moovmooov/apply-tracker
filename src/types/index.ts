export interface UserData {
  access_token: string;
  bot_id: string;
  duplicated_template_id: string;
  owner: {
    type: string;
    user: {
      name: string;
      avatar_url: string;
    };
  };
  workspace_name: string;
  workspace_icon: string;
}
