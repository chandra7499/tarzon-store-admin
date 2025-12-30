"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Form from "../../components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  handlePolicies,
  PostHandlePolicies,
  PutHandlePolicies,
} from "@/functions/handlePolicies";
import { Spinner } from "../ui/spinner";

export default function PolicyForm() {
  const today = new Date().toISOString().slice(0, 10);

  const emptyForm = {
    name: "",
    content: "",
    lastedUpdated: today,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [policies, setPolicies] = useState([]);
  const [currentTab, setCurrentTab] = useState("newPolicy");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeatching, setIsFeatching] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // Load policies
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setIsFeatching(true);
        const fetched = await handlePolicies();
        setPolicies(fetched);
        if (fetched.length > 0) {
          setCurrentTab(fetched[0].id);
          loadPolicyIntoForm(fetched[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFeatching(false);
      }
    };

    loadPolicies();
  }, []);

  //post request
  async function PostRequest() {
    try {
      setIsLoading(true);
      const dataFormate = {
        id: formData.name,
        name: formData.name,
        content: formData.content,
        lastedUpdated: formData.lastedUpdated,
      };
      console.log(dataFormate);
      const data = await PostHandlePolicies(dataFormate);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  }

  //update request

  async function UpdateRequest() {
    try {
      setIsLoading(true);
      const formateData = {
        id: currentTab,
        name: formData.name,
        content: formData.content,
        lastedUpdated: formData.lastedUpdated,
      };
      console.log(formateData);
      const data = await PutHandlePolicies(formateData);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  }

  // Load a policy into the form
  const loadPolicyIntoForm = (policy) => {
    setFormData({
      name: policy.name || "",
      content: policy.content || "",
      lastedUpdated: policy.lastedUpdated
        ? new Date(policy.lastedUpdated).toISOString().slice(0, 10)
        : today,
    });
    setIsChanged(false);
  };

  // Tab switching
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);

    if (tabId === "newPolicy") {
      setFormData(emptyForm);
      setIsChanged(true);
    } else {
      const selected = policies.find((p) => p.id === tabId);
      if (selected) loadPolicyIntoForm(selected);
    }
  };

  // Form field changes
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      lastUpdated: today,
    }));
  };

  // Submit action
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTab === "newPolicy") {
      PostRequest();
    } else {
      UpdateRequest();
    }
  };

  //isChanged data
  useEffect(() => {
    if (currentTab === "newPolicy") {
      const hasContent = formData.name.trim() || formData.content.trim();
      setIsChanged(hasContent);
    } else {
      const isChanges = policies?.find((p) => p.id === currentTab);
      if (isChanges) {
        setIsChanged(
          () =>
            isChanges.content.trim() !== formData.content.trim() ||
            isChanges.name.trim() !== formData.name.trim()
        );
      }
    }
  }, [currentTab, formData, policies]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg"
    >
      <Form onSubmit={handleSubmit}>
        <Card className="border border-white/10 shadow-lg rounded-2xl bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">
              🧾 Policy Manager
              {isFeatching && (
                <span className="ml-4 text-gray-500">Fetching...</span>
              )}
            </h2>

            {/* Tabs */}
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="bg-white p-1 rounded-lg shadow-md w-max">
                {policies.map((p) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className="px-4 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md"
                  >
                    {p.id}
                  </TabsTrigger>
                ))}

                <TabsTrigger
                  value="newPolicy"
                  className="px-4 py-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md"
                >
                  + Create Policy
                </TabsTrigger>
              </TabsList>

              {/* Optional contents per policy */}
              
            </Tabs>

            {/* Policy Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Policy Name
              </label>
              <Input
                placeholder="Enter policy name..."
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Policy Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Policy Content (Markdown Supported)
              </label>
              <Textarea
                rows={15}
                className="font-mono text-sm"
                value={formData.content}
                placeholder="Write your policy..."
                onChange={(e) => handleChange("content", e.target.value)}
                required
              />
            </div>

            {/* Markdown Preview */}
            <article className="flex border rounded-lg max-h-[200px] p-2 overflow-y-scroll">
              <div className="pt-4">
                <h3 className="font-medium mb-2 text-muted-foreground">
                  Live Preview
                </h3>
                <div className="prose prose-sm dark:prose-invert bg-black/5 p-4 rounded-lg">
                  <ReactMarkdown>
                    {formData.content || "*Start typing...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </article>

            {/* Last Updated */}
            <div className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> {formData.lastedUpdated}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="outline"
              disabled={
                !formData.name || !formData.content || isLoading || !isChanged
              }
              className="w-full mt-4 font-semibold"
            >
              <Spinner show={isLoading} className="mr-2" />
              💾 {currentTab === "newPolicy" ? "Save Policy" : "Update Policy"}
            </Button>
          </CardContent>
        </Card>
      </Form>
    </motion.div>
  );
}
