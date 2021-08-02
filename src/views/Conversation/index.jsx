import { useEffect, useState } from "react";
import ConversationService from "./services";
import Avatar from "../../components/Avatar";
import { IoChevronBack } from "react-icons/all";
import CloseButton from "../../components/CloseButton";
import "./styles.css";

export default function Conversations({
  setInitiateSocketConnection,
  setLastMessageTimestamp,
  channelId,
  detail,
  color,
  setConversations,
  conversations
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showAllConversations, setShowAllConversation] = useState(false);

  const fetchConversation = () => {
    setIsLoading(true);
    setIsError(false);
    ConversationService.getChannel(channelId)
      .then((r) => {
        setIsLoading(false);
        setConversations([...r.data.prevMessages, ...r.data.messages]);
        if (r.data.prevMessages.length) {
          setLastMessageTimestamp(r.data.prevMessages[r.data.prevMessages.length - 1].time);
        } else {
          setLastMessageTimestamp(r.data.messageTimestamp);
        }

        setInitiateSocketConnection(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setIsError(true);
      });
  };
  useEffect(() => {
    fetchConversation();
  }, []);
  if (isError) {
    return <div>Error</div>;
  }

  if (showAllConversations) {
    return (
      <div
        className="rounded-3xl relative shadow-lg w-3/12 chat-height border-b-8 border-box overflow-hidden"
        style={{ borderColor: color.headerBackgroundColor }}
      >
        <div
          className="h-12 w-full absolute -z-10"
          style={{ backgroundColor: color.headerBackgroundColor }}
        />
        <div
          className="absolute h-48 w-full -z-10 rounded-3xl transform -rotate-12 scale-125"
          style={{ backgroundColor: color.headerBackgroundColor }}
        />
        <div className="p-4">
          <Avatar
            backgroundColor={color.headerBackgroundColor}
            src={detail.widgetIcon}
            rounded
          />
          <h1 className="font-bold text-2xl text-white">Hi, we're Insent</h1>
          <p className="text-white text-sm mt-4">
            We're here to help you accelerate your prospect's <br /> buying
            experience.
          </p>
          <p className="text-white text-sm font-bold mt-4">
            Your conversations
          </p>
          <div
            className="bg-white flex shadow-lg rounded-3xl space-x-2 p-4 cursor-pointer"
            onClick={() => setShowAllConversation(false)}
          >
            <Avatar
              backgroundColor={color.headerBackgroundColor}
              src={detail.widgetIcon}
              rounded
            />

            <div>
              <h3 className="font-bold text-lg">InsentBot</h3>
              <p className="text-gray-500 text-sm">First Name?</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl shadow-lg w-3/12 chat-height">
        <div className="flex shadow-lg justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <IoChevronBack
              className="cursor-pointer"
              onClick={() => setShowAllConversation(true)}
            />
            <Avatar
              backgroundColor={color.headerBackgroundColor}
              src={detail.widgetIcon}
              rounded
            />
            <div>
              <h3 className="font-bold">{detail.company}</h3>
              <p className="text-gray-400 text-xs">
                You're chatting with {detail.name}
              </p>
            </div>
          </div>
          <CloseButton />
        </div>
        <div className="h-64">
          <div className="px-4 font-bold">{isLoading ? "..." : ""}</div>
          {conversations.map((message, index) => (
            <div
              className="rounded-t-3xl rounded-br-3xl rounded-bl-lg bg-gray-200 text-gray-600 m-4 w-6/12 px-4 py-4"
              key={message._id || message.id}
            >
              {message.text ? (
                message.text.replace("<br />", "")
              ) : message.type === "input" ? (
                <input type="text" placeholder={message.input[0].name} />
              ) : (
                message.type === "buttons" ? message.buttons.fields.map(button => <button>{button}</button>) : ''
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
