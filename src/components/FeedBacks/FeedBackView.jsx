"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Send, MessageCircle, Mail, User, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

import { handleFeedBacks, handleReplay } from "@/functions/handleFeedBacks";
import { updateFeedbackReply } from "@/Global_States/feedbackSlice";

const FeedBackView = () => {
  const dispatch = useDispatch();

  /* =========================
     GLOBAL STATE
  ========================= */
  const feedbacks = useSelector((state) => state.feedbacks.feedbacks);

  /* =========================
     LOCAL UI STATE
  ========================= */
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /* =========================
     FETCH FEEDBACKS
  ========================= */
  useEffect(() => {
    async function loadFeedbacks() {
      try {
        if (feedbacks.length > 0) return;

        setIsFetching(true);
        await handleFeedBacks(dispatch);
      } catch (err) {
        console.error("Feedback fetch failed:", err);
      } finally {
        setIsFetching(false);
      }
    }

    loadFeedbacks();
  }, [dispatch, feedbacks.length]);

  /* =========================
     REPLY HANDLER
  ========================= */
  const handleReply = async (feedbackId, parentId) => {
    if(feedbacks.length === 3){
      return;
      
    }
    try {
      setIsSending(true);
      await handleReplay(replyText, feedbackId, parentId);
      setReplyText("");
      setActiveReply(null);
    } catch (error) {
      console.error("Reply failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-700 rounded-lg p-6 text-slate-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          User Feedback Management
        </h1>

        {isFetching && (
          <p className="text-center text-gray-400">Fetching...</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((group) =>
            group.feedBacks.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700/60 rounded-2xl p-4 border border-slate-600 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                    <User className="w-4 h-4" />
                    {item.userName}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Mail className="w-4 h-4" />
                    {item.email}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    {item.timestamp}
                  </div>

                  <div className="bg-slate-800/50 p-3 rounded-xl text-sm mb-4">
                    <MessageCircle className="inline w-4 h-4 mr-1 text-blue-400" />
                    {item.feedback}
                  </div>

                  {item.response?.map((res, i) => (
                    <div
                      key={i}
                      className="bg-green-800/40 border border-green-700 p-3 rounded-md text-sm mt-2"
                    >
                      <b>Admin Reply:</b> {res}
                    </div>
                  ))}
                </div>

                {activeReply === item.id ? (
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-sm resize-none"
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReply(item.id, group.id)}
                        disabled={!replyText.trim() || isSending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSending ? <Spinner show /> : <Send className="w-4 h-4 mr-1" />}
                        Send
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => setActiveReply(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveReply(item.id)}
                    className="bg-slate-600 hover:bg-blue-600 mt-3"
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
