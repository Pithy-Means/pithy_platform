/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for making API requests.
 * @returns {object} { data, error, loading, fetchData }
 */
export const useFetch = () => {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (
      url: string,
      method: string = "GET",
      headers = { "Content-Type": "application/json" },
      body: Record<string, any>,
    ): Promise<unknown> => {
      setLoading(true);
      setError(null);
      try {
        const options: RequestInit = {
          method,
          headers,
        };

        if (body && (method === "POST" || method === "PUT")) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result: unknown = await response.json();
        setData(result);
        return result;
      } catch (err: unknown) {
        setError(`Error: ${err}`);
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { data, error, loading, fetchData };
};
