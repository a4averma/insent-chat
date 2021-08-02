import Avatar from "../components/Avatar";
import { useEffect, useState } from "react";
import ConversationService from "./Conversation/services";

export default function AllConversation({
  color,
  detail,
  setShowAllConversation,
}) {
  // state related to initialising the project
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    setIsError(false);
    ConversationService.getAllConversation()
      .then((r) => {
        setIsLoading(false);
        setData(r.data);
      })
      .catch((err) => {
        setIsError(true);
      });
  }, []);
  return (
    <div
      className="rounded-3xl relative shadow-lg bg-white w-full chat-height border-b-8 border-box overflow-hidden"
      style={{ borderColor: color.headerBackgroundColor }}
    >
      <div
        className="h-64 w-full scale-125 absolute z-10"
        style={{ backgroundColor: color.headerBackgroundColor }}
      />
      <div
        className="absolute h-48 w-full z-10 rounded-3xl transform -rotate-12 scale-150"
        style={{ backgroundColor: color.headerBackgroundColor }}
      />
      <div className="p-4 z-50 relative">
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
        <p className="text-white text-sm font-bold mt-4">Your conversations</p>

        {isLoading
          ? "Loading..."
          : data.map((item, index) => (
              <div
                key={index}
                className="bg-white flex shadow-lg rounded-3xl space-x-2 p-4 cursor-pointer"
                onClick={() => setShowAllConversation(false)}
              >
                <Avatar
                  backgroundColor={color.headerBackgroundColor}
                  src={detail.widgetIcon}
                  rounded
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg">{item.members[0].name}</h3>
                  <p className="text-gray-500 text-sm">{item.msg.text.replace("<br />", "")}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
