import Axios from "../../utils/Axios";

const ConversationService = {
  getChannel: async (channelId) =>
    await Axios.get(`/user/channels/${channelId}`),
  getAllConversation: async () => await Axios.get(`/user/channels/`)
};

export default ConversationService;
