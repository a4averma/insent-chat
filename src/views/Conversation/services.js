import Axios from "../../utils/Axios";

const ConversationService = {
  getChannel: async (channelId) =>
    await Axios.get(`/user/channels/${channelId}`),
  getAllConversation: async () => await Axios.get(`/user/channels/`),
  bookSlots: async (startTime, endTime, offset, duration) => await Axios.get(`/user/meeting/slots?startTime=${startTime}&endTime=${endTime}&offset=${offset}&duration=${duration}&participants=[]&members=[]&teams=[]`)
};

export default ConversationService;
