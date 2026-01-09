"use client";

import { useState } from "react";
import {
  useUrls,
  useShortenUrl,
  useDeleteUrl
} from "@/hooks/use-urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link2,
  Copy,
  Trash2,
  ExternalLink,
  BarChart3,
  Search,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function URLShortPage() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);

  const { data: urlsData, isLoading } = useUrls({ page, limit: 10 });
  const shortenMutation = useShortenUrl();
  const deleteMutation = useDeleteUrl();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      // Basic client-side normalization for UX
      let inputUrl = url.trim();
      if (!/^https?:\/\//i.test(inputUrl)) {
        inputUrl = `https://${inputUrl}`;
      }

      await shortenMutation.mutateAsync({ originalUrl: inputUrl, title });
      setUrl("");
      setTitle("");
      toast.success("URL shortened successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to shorten URL");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("URL deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete URL");
    }
  };

  const copyToClipboard = (shortId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const shortUrl = `${baseUrl}/url/${shortId}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const getFullShortUrl = (shortId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return `${baseUrl}/url/${shortId}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            URL Shortener
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create short, easy-to-share links and track their performance.
          </p>
        </div>

        {/* Shorten Form */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-500" />
              Shorten a new link
            </CardTitle>
            <CardDescription>
              Enter a long URL to get a shortened version.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="https://example.com/very-long-url-path..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 bg-white dark:bg-gray-800"
                  required
                />
              </div>
              <div className="w-full md:w-64 space-y-2">
                <Input
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 bg-white dark:bg-gray-800"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                disabled={shortenMutation.isPending}
              >
                {shortenMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Shorten
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Links</CardTitle>
              <CardDescription>
                Manage and track your shortened URLs.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              </div>
            ) : !urlsData?.data || urlsData.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">No links found</p>
                <p className="text-sm">Start by shortening your first URL above!</p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-100 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                      <TableHead>Link Details</TableHead>
                      <TableHead>Short Link</TableHead>
                      <TableHead className="text-center">Clicks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urlsData.data.map((item) => (
                      <TableRow key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex flex-col gap-1 max-w-[300px]">
                            <span className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.title || "Untitled Link"}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {item.originalUrl}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm">
                              {item.shortId}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-blue-500"
                              onClick={() => copyToClipboard(item.shortId)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <a
                              href={getFullShortUrl(item.shortId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{item.clicks}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(item.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
