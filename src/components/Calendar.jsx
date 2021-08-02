import {useEffect, useState} from "react";
import ConversationService from "../views/Conversation/services";

export default function Calendar(props) {
  // state related to initialising the project
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    ConversationService.bookSlots(props.startTime, props.endTime, props.offset, props.duration).then(r => {
      setData(r.data)
      setIsLoading(false);
    }).catch(err => {
      setIsError(true);
    })
  }, []);
  if (isLoading) {
    return <div>...</div>;
  }
  if (isError) {
    return <div>Error!</div>;
  }

  return (
    <div className="rounded-3xl">

    </div>
  )
}