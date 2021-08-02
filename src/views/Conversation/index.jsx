import { useEffect, useState, forwardRef, useRef } from "react";
import ConversationService from "./services";
import Avatar from "../../components/Avatar";
import { FiCheck, IoChevronBack, MdSend, RiRestartFill } from "react-icons/all";
import CloseButton from "../../components/CloseButton";
import "./styles.css";
import AllConversation from "../AllConversation";

function Conversations({
  setInitiateSocketConnection,
  setLastMessageTimestamp,
  lastMessageTimestamp,
  channelId,
  detail,
  color,
  setConversations,
  conversations,
  channelRef,
  user,
  loadingConversation,
  setLoadingConversation,
  setShowConversation,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showAllConversations, setShowAllConversation] = useState(false);
  const ref = useRef();

  const fetchConversation = () => {
    setIsLoading(true);
    setIsError(false);
    ConversationService.getChannel(channelId)
      .then((r) => {
        setIsLoading(false);
        setConversations([...r.data.prevMessages, ...r.data.messages]);
        if (r.data.prevMessages.length) {
          setLastMessageTimestamp(
            r.data.prevMessages[r.data.prevMessages.length - 1].time
          );
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

  // Handle submission for input type
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLoadingConversation(true);
    setConversations((prevState) => {
      prevState[prevState.length - 1].disabled = true;
      return [...prevState];
    });
    channelRef.current.trigger("client-widget-message", {
      channelName: channelId,
      message: {
        lastMessageTimeStamp:
          conversations[conversations.length - 1].messageTimestamp,
        [ref.current.name]: ref.current.value,
      },
      senderId: user,
    });
    setLastMessageTimestamp(
      conversations[conversations.length - 1].messageTimestamp
    );
  };

  // handle submission for button click
  const handleButtonClick = (key, value) => {
    setLoadingConversation(true);
    channelRef.current.trigger("client-widget-message", {
      channelName: channelId,
      message: {
        lastMessageTimeStamp: lastMessageTimestamp,
        [key]: [value],
      },
      senderId: user,
    });
  };

  // handle reset conversation
  const resetConversation = () => {
    setLoadingConversation(true);
    channelRef.current.trigger("client-widget-message", {
      channelName: channelId,
      message: {
        text: "@InsentBot",
      },
      senderId: user,
    });
    channelRef.current.trigger("client-widget-message", {
      channelName: channelId,
      message: {
        lastMessageTimeStamp:
          conversations[conversations.length - 1].messageTimestamp,
      },
      senderId: user,
    });
  };

  // show all conversations
  if (showAllConversations) {
    return (
      <AllConversation
        color={color}
        setShowAllConversation={setShowAllConversation}
        detail={detail}
      />
    );
  }

  return (
    <>
      <div
        style={{
          backgroundColor: color.headerBackgroundColor,
        }}
        className="rounded-3xl shadow-lg chat-height w-full"
      >
        <div className="flex bg-white shadow-lg justify-between px-4 py-2">
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
          <CloseButton onClick={() => setShowConversation(false)} />
        </div>
        <div className="conversation-height bg-white rounded-b-3xl overflow-y-auto">
          <div className="px-4 font-bold">{isLoading ? "..." : ""}</div>
          {conversations.map((message, index) =>
            message.text ? (
              message.userId === user ? (
                // message  from client
                <div className="flex justify-end">
                  <div
                    style={{
                      backgroundColor: color.headerBackgroundColor,
                    }}
                    className="rounded-3xl text-white m-4 w-6/12 px-4 py-4"
                    key={message._id || message.id}
                  >
                    {message.text.replace("<br />", "")}
                  </div>
                </div>
              ) : (
                // message from server
                <div
                  className="rounded-t-3xl rounded-br-3xl rounded-bl-lg bg-gray-200 text-gray-600 m-4 w-6/12 px-4 py-4"
                  key={message._id || message.id}
                >
                  {message.text.replace("<br />", "")}
                </div>
              )
            ) : message.type === "input" ? (
              // message type input
              <div
                className="rounded-3xl bg-gray-200 text-gray-600 m-4 w-8/12 px-4 py-4"
                key={message._id || message.id}
              >
                <div className="bg-white rounded-xl flex items-center space-x-4">
                  <form onSubmit={handleOnSubmit}>
                    <input
                      ref={ref}
                      name={message.input[0].key}
                      disabled={message.disabled}
                      className="px-2 py-4 rounded-xl focus:border-none"
                      type={
                        message.input[0].type === "plain"
                          ? "text"
                          : message.input[0].type
                      }
                      placeholder={`Enter your ${message.input[0].name.toLowerCase()}`}
                    />
                    <button type="submit" disabled={message.disabled}>
                      {message.disabled ? (
                        <FiCheck color={color.headerBackgroundColor} />
                      ) : (
                        <MdSend color={color.headerBackgroundColor} />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : message.type === "buttons" ? (
              // message type button
              <div className="flex justify-end space-x-2 mx-2">
                {message.buttons.fields.map((button) => (
                  <button
                    style={{
                      borderColor: color.headerBackgroundColor,
                    }}
                    className="border bg-gray-200 px-2 py-2 rounded-full"
                    onClick={() =>
                      handleButtonClick(message.buttons.key, button)
                    }
                  >
                    {button}
                  </button>
                ))}
              </div>
            ) : message.type === "calendar" ? (
              // message type calendar
              <div
                style={{
                  backgroundColor: color.headerBackgroundColor,
                }}
                className="rounded-3xl text-white m-4 w-6/12 px-4 py-4"
                key={message._id || message.id}
              >
                Calendar
              </div>
            ) : (
              ""
            )
          )}
          <div className="px-4 font-bold">
            {loadingConversation ? "..." : ""}
          </div>
          <div className="mb-2" />
        </div>
        {/*restart conversation*/}
        <div
          onClick={resetConversation}
          className="flex items-center justify-center hover:text-white mt-4 space-x-2 text-gray-300 font-semibold cursor-pointer"
        >
          <RiRestartFill />
          Restart Conversation
        </div>
      </div>
    </>
  );
}

export default forwardRef((props, ref) => (
  <Conversations {...props} {...ref} />
));
