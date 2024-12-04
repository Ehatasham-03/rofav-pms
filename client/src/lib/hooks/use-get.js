import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const cache = new Map();

function useGet({ showToast = true, headers = {} } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async (url, tag = "default", messages = {}) => {
    setLoading(true);
    let loading_toast;
    let tagCache = cache.get(tag);
    if (tagCache && tagCache.has(url)) {
      setData(tagCache.get(url));
      setLoading(false);
    } else {
      if (showToast) {
        loading_toast = toast.loading(messages?.loading || "Loading...");
      }
      try {
        const response = await axios.get(url, { headers });
        setData(response.data);
        if (!tagCache) {
          tagCache = new Map();
          cache.set(tag, tagCache);
        }
        tagCache.set(url, response.data);
        if (showToast) {
          toast.success(messages?.success || "Data loaded successfully");
        }
      } catch (error) {
        setError(new Error(error?.response?.data?.message));
        if (showToast) {
          toast.error(
            messages.failure ||
              error?.response?.data?.message ||
              "An error occurred"
          );
        }
      } finally {
        setLoading(false);
        if (showToast && loading_toast) {
          toast.dismiss(loading_toast);
        }
      }
    }
  };

  const refresh = async (tag, messages = {}, samePage = true) => {
    setLoading(true);
    let loading_toast;
    if (showToast) {
      loading_toast = toast.loading(messages?.loading || "Refreshing...");
    }
    try {
      // Ensure a tag is provided
      if (!tag) {
        throw new Error("Tag is required for refreshing data");
      }

      // Attempt to retrieve the tag cache
      const tagCache = cache.get(tag);
      if (!tagCache) {
        throw new Error(`No cache found for tag: ${tag}`);
      }

      // Attempt to fetch data for the first URL associated with the tag
      const urlToFetch = Array.from(tagCache.keys())[0];
      if (!urlToFetch) {
        throw new Error(`No URL found for the provided tag: ${tag}`);
      }

      const response = await axios.get(urlToFetch, { headers });
      if (samePage) {
        setData(response.data);
      }

      // Update the tag cache with the new data
      // tagCache.set(tag, response.data);
      const newTagCache = new Map();
      newTagCache.set(urlToFetch, response.data);
      cache.set(tag, newTagCache);
      if (showToast) {
        toast.success(messages?.success || "Data refreshed successfully");
      }
    } catch (error) {
      setError(new Error(error?.message || "An error occurred during refresh"));
      if (showToast) {
        toast.error(
          messages.failure ||
            error?.message ||
            "An error occurred during refresh"
        );
      }
    } finally {
      setLoading(false);
      if (showToast && loading_toast) {
        toast.dismiss(loading_toast);
      }
    }
  };

  const invalidateCache = (tag, showToast = true) => {
    cache.delete(tag);
    if (showToast) {
      toast.success("Cache invalidated successfully");
    }
  };

  return { data, error, loading, getData, invalidateCache, refresh };
}

export default useGet;
