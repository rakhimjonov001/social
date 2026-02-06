"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  username?: string;
  isFollowing: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FollowButton({ 
  userId,
  username, 
  isFollowing: initialIsFollowing, 
  size = "md",
  className 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    if (!username) return;

    // Store current state for potential revert
    const previousIsFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!isFollowing);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/users/${username}/follow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to toggle follow');
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to toggle follow');
        }

        // Update with server response
        setIsFollowing(result.isFollowing);
      } catch (error) {
        // Revert on error
        setIsFollowing(previousIsFollowing);
        console.error('Error toggling follow:', error);
      }
    });
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isPending || !username}
      variant={isFollowing ? "outline" : "primary"}
      size={size}
      className={className}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}