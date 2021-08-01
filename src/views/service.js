import Axios from '../utils/Axios';

const ChatService = {
  getUser: async () => await Axios.get(`/getuser?url=insent-recruitment.web.app/`),
  markAsDelivered: async (channelId, data) => await Axios.post(`/user/channels/${channelId}/delivered`, data),
  markAsRead: async (channelId, data) => await Axios.post(`/user/channels/${channelId}/read`, data)
}

export default ChatService;