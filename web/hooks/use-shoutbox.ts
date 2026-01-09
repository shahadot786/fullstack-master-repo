import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { shoutboxApi, ShoutboxMessage } from "@/lib/api/shoutbox";

export const useShoutboxMessages = () => {
  return useInfiniteQuery({
    queryKey: ["shoutbox-messages"],
    queryFn: ({ pageParam }) =>
      shoutboxApi.getMessages({ limit: 50, before: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore || lastPage.data.length === 0) return undefined;
      return lastPage.data[0]._id; // Get the oldest message in the current page to fetch older messages
    },
    initialPageParam: undefined as string | undefined,
  });
};

export const useSendShoutboxMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => shoutboxApi.sendMessage(content),
    onSuccess: (newMessage) => {
      // Optmistically update the infinite query cache
      queryClient.setQueryData(["shoutbox-messages"], (oldData: any) => {
        if (!oldData) return undefined;

        const pages = [...oldData.pages];
        const lastPageIndex = pages.length - 1;
        
        // Avoid duplicates if the message was already added
        const exists = pages.some((page: any) => 
          page.data.some((m: any) => m._id === newMessage._id)
        );
        if (exists) return oldData;
        
        pages[lastPageIndex] = {
          ...pages[lastPageIndex],
          data: [...pages[lastPageIndex].data, newMessage],
        };

        return {
          ...oldData,
          pages,
        };
      });
      
      // Also invalidate to be sure
      queryClient.invalidateQueries({ queryKey: ["shoutbox-messages"] });
    },
  });
};
