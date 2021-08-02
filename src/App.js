import {useEffect, useRef, useState} from "react";
import { useQuery } from "react-query";
import ChatService from "./views/service";
import { setupNetworkConfigurator } from "./utils/Axios";
import Avatar from "./components/Avatar";
import { FaTimes } from "react-icons/fa";
import Conversation from "./views/Conversation";
import Pusher from "pusher-js";


function App() {
  const [showConversation, setShowConversation] = useState(false);
  const [initiateSocketConnect, setInitiateSocketConnection] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);
  const [conversations, setConversations] = useState([]);
  const channelRef = useRef({});
  const [loadingConversation, setLoadingConversation] = useState(false);

  const { isLoading, isError, data } = useQuery(`fetch-user`, () => {
    let userId = localStorage.getItem("user-id");
    if (userId) {
      setupNetworkConfigurator(userId);
    }
    return ChatService.getUser().then((r) => {
      if (!userId) {
        localStorage.setItem("user-id", r.data.user.id);
      }
      setInitiateSocketConnection(r.data.initiateSocketConnection);
      return r.data;
    });
  });

  useEffect(() => {
    if (initiateSocketConnect) {
      let pusher = new Pusher("67bb469433cb732caa7a", {
        authEndpoint: `${process.env.REACT_APP_API}pusher/presence/auth/visitor?userid=${data.user.id}`,
      });
      setLoadingConversation(true)
      pusher.connection.bind("connected", () => {
        // ChatService.markAsDelivered(data.channelId, { userid: data.user.id });
        // if (showConversation) {
        //   ChatService.markAsRead(data.channelId, { userid: data.user.id });
        // }
      });
      const channel = pusher.subscribe(data.subscriptionChannel);
      channelRef.current = channel;
      channel.bind("pusher:subscription_succeeded", () => {
        channel.trigger("client-widget-message", {
          channelName: data.channelId,
          message: { lastMessageTimeStamp: lastMessageTimestamp },
          senderId: data.user.id,
        })
      })

      channel.bind("server-message", (data) => {
        // setLastMessageTimestamp(data.lastMessageTimeStamp);
        setConversations(prevState => [...prevState, ...data.messages])
        setLoadingConversation(false);
      });

    }
  }, [initiateSocketConnect]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error!</div>;
  }

  if (showConversation) {
    return (
      <Conversation
        setLastMessageTimestamp={setLastMessageTimestamp}
        lastMessageTimestamp={lastMessageTimestamp}
        setInitiateSocketConnection={setInitiateSocketConnection}
        channelId={data.channelId}
        detail={data.settings.bot}
        color={data.settings.color}
        user={data.user.id}
        conversations={conversations}
        setConversations={setConversations}
        channelRef={channelRef}
        loadingConversation={loadingConversation}
        setLoadingConversation={setLoadingConversation}
      />
    );
  }

  return !data.user.id ? (
    <div
      className="relative shadow-md flex items-center p-4 space-x-4 border-b-8 w-2/12 rounded-3xl"
      style={{ borderColor: data.settings.color.headerBackgroundColor }}
    >
      <div
        className="rounded-full bg-gray-300 p-1 absolute right-0 top-0 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowConversation(false);
        }}
      >
        <FaTimes className="w-3 h-3" />
      </div>
      <p className="text-gray-500 font-semibold text-sm">
        {data.popupMessage.message.replace("<br />", "")}
      </p>
      <Avatar
        backgroundColor={data.settings.color.headerBackgroundColor}
        src={data.settings.bot.widgetIcon}
      />
    </div>
  ) : (
    <div className="h-16 w-16 cursor-pointer" onClick={() => setShowConversation(true)}>
      <Avatar
        backgroundColor={data.settings.color.headerBackgroundColor}
        src={data.settings.bot.widgetIcon}
      />
    </div>
  );
}

export default App;
