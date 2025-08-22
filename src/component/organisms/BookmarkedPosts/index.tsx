'use client';

import { usePostBookmarkQuery } from "@hooks/queries/usePostQuery";
import { GalleryListItem } from "@model/post";
import Gallery from "@organisms/BoardTypes/Gallery";

export default function BookmarkedPosts() {

  const { data: queryPosts, refetch } = usePostBookmarkQuery();
  console.log(`queryPosts`, queryPosts);

  const posts: GalleryListItem[] = (queryPosts as GalleryListItem[]) || [];
  return (
    <Gallery
      posts={posts} 
      isBookmark={true}
      onDeleteBookmark={refetch}
    />
  )
}