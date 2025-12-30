"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleFeedBacks } from "@/functions/handleFeedBacks";
import { handleReplay } from "@/functions/handleFeedBacks";
import { Spinner } from "../ui/spinner";

const FeedBackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [dataFeteching, setDataFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = async (id, docId) => {
    try {
      console.log(replyText, id, docId);
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, response: replyText } : item
        )
      );
      setIsLoading(true);
      const data = await handleReplay(replyText, id, docId);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        setDataFetching(true);
        const res = await handleFeedBacks();
        console.log(res);
        setFeedbacks(res);
      } catch (error) {
        console.log(error);
      } finally {
        setDataFetching(false);
      }
    }

    fetchFeedbacks();
    console.log(feedbacks);
  }, []);

  return (
    <section className="min-h-screen w-full bg-gradient-to-b  from-slate-950 to-slate-700 rounded-lg p-6 text-slate-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center text-white tracking-wide">
          User Feedback Management
        </h1>

        {dataFeteching && (
          <h1 className="flex w-full text-xl text-gray-500 justify-center">
            Fetching...
          </h1>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks?.map((items) =>
            items?.feedBacks?.map((item) => (
              <motion.div
                key={items.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-700/60 backdrop-blur-md overflow-x-hidden rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col justify-between border border-slate-600"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                    <User className="w-4 h-4" />
                    <span>{item.userName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>{item.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{item?.timestamp}</span>
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-xl text-sm text-slate-200 leading-relaxed mb-4">
                    <MessageCircle className="w-5 h-5 inline mr-2 text-blue-400" />
                    {item.feedback}
                  </div>

                  {item?.response.length > 0 &&
                    item.response.map((response,i) => (
                      <div key={i} className="bg-green-800/40 border border-green-700 p-3 rounded-md text-sm text-green-300 mt-2">
                        <b>Admin Reply:</b> {response}
                      </div>
                    ))}
                </div>

                {activeReply === item.id ? (
                  <div className="mt-4 flex flex-col  gap-2">
                    <textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-slate-200 text-sm resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between w-full p-2 gap-2">
                      <Button
                        onClick={() => handleReply(item.id, items.id)}
                        disabled={!replyText.trim() || isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white "
                      >
                        {!isLoading ? (
                          <Send className="w-4 h-4 mr-1" />
                        ) : (
                          <Spinner show={isLoading} />
                        )}{" "}
                        Send
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-slate-600 text-white hover:bg-slate-700"
                        onClick={() => setActiveReply(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveReply(item.id)}
                    className="bg-slate-600 hover:bg-blue-600 text-white mt-3"
                  >
                    Reply
                  </Button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedBackView;
