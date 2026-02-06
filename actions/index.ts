/**
 * Server Actions Index
 * 
 * Re-exports all server actions for convenient imports
 */

// Auth actions
export {
  register,
  login,
  logout,
  signInWithGitHub,
  signInWithGoogle,
  redirectToFeed,
  redirectToLogin,
} from "./auth";

// Post actions
export {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  toggleLike,
  getFeedPosts,
  getFollowingFeed,
  getUserPosts,
} from "./posts";

// Comment actions
export {
  createComment,
  deleteComment,
  getPostComments,
} from "./comments";

// Follow actions
export {
  followUser,
  unfollowUser,
  toggleFollow,
  getFollowers,
  getFollowing,
  isFollowing,
} from "./follows";

// User actions
export {
  getUserProfile,
  getCurrentUser,
  updateProfile,
  searchUsers,
  getSuggestedUsers,
} from "./users";

// Notification actions
export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "./notifications";

// Type exports
export type { ActionResult, PostWithAuthor } from "./posts";
export type { CommentWithAuthor } from "./comments";
export type { UserPreview } from "./follows";
export type { UserProfile } from "./users";
export type { NotificationWithDetails } from "./notifications";
