# instagram_bulk_fetcher.py
import instaloader
import time
import json
import csv
import os
from typing import List, Dict, Optional
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class InstagramBulkFetcher:
    """
    Bulk Instagram data fetcher using Instaloader
    WARNING: This violates Instagram's Terms of Service
    """
    
    def __init__(self, username: str = None, password: str = None, session_file: str = None):
        """
        Initialize the fetcher with login credentials
        
        Args:
            username: Instagram username
            password: Instagram password
            session_file: Path to saved session file (recommended)
        """
        self.loader = instaloader.Instaloader(
            max_connection_attempts=3,
            request_timeout=30,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        
        # Try to load session first
        if session_file and os.path.exists(session_file):
            try:
                self.loader.load_session_from_file(username, session_file)
                logger.info(f"✅ Session loaded from {session_file}")
                return
            except Exception as e:
                logger.warning(f"Could not load session: {e}")
        
        # If no session, login
        if username and password:
            try:
                self.loader.login(username, password)
                logger.info(f"✅ Logged in as {username}")
                
                # Save session for future use
                if session_file:
                    self.loader.save_session_to_file(session_file)
                    logger.info(f"💾 Session saved to {session_file}")
            except Exception as e:
                logger.error(f"❌ Login failed: {e}")
                raise
    
    def get_user_info(self, username: str) -> Optional[Dict]:
        """
        Fetch user info for a single username
        
        Args:
            username: Instagram username
            
        Returns:
            Dictionary with user data or None if failed
        """
        try:
            profile = instaloader.Profile.from_username(self.loader.context, username)
            
            # Basic info
            user_data = {
                'username': profile.username,
                'user_id': profile.userid,
                'full_name': profile.full_name,
                'biography': profile.biography,
                'followers': profile.followers,
                'following': profile.followees,
                'posts': profile.mediacount,
                'profile_pic_url': profile.profile_pic_url,
                'is_private': profile.is_private,
                'is_verified': profile.is_verified,
                'is_business': profile.is_business_account,
                'business_category': profile.business_category_name if hasattr(profile, 'business_category_name') else None,
                'external_url': profile.external_url,
                'has_public_story': profile.has_public_story if hasattr(profile, 'has_public_story') else None,
                'has_viewable_story': profile.has_viewable_story if hasattr(profile, 'has_viewable_story') else None,
                'story_hashtags': profile.story_hashtags if hasattr(profile, 'story_hashtags') else [],
                'fbid': profile.fbid if hasattr(profile, 'fbid') else None,
            }
            
            # Get recent posts (optional)
            try:
                posts = []
                for post in profile.get_posts():
                    if len(posts) >= 3:  # Get only 3 latest posts
                        break
                    posts.append({
                        'shortcode': post.shortcode,
                        'likes': post.likes,
                        'comments': post.comments,
                        'caption': post.caption[:100] if post.caption else None,
                        'date': post.date_utc.isoformat() if post.date_utc else None,
                    })
                user_data['recent_posts'] = posts
            except Exception as e:
                logger.warning(f"Could not fetch recent posts for {username}: {e}")
                user_data['recent_posts'] = []
            
            # Get followers count (if needed)
            try:
                followers_list = []
                # Uncomment below to fetch followers list (WARNING: Very slow for large accounts)
                # for follower in profile.get_followers():
                #     if len(followers_list) >= 10:  # Limit to 10
                #         break
                #     followers_list.append(follower.username)
                # user_data['sample_followers'] = followers_list
                user_data['sample_followers'] = []
            except Exception as e:
                logger.warning(f"Could not fetch followers for {username}: {e}")
                user_data['sample_followers'] = []
            
            return user_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            logger.error(f"❌ Profile does not exist: {username}")
            return None
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            logger.error(f"❌ Profile is private: {username}")
            return {'username': username, 'error': 'Private profile'}
        except Exception as e:
            logger.error(f"❌ Error fetching {username}: {e}")
            return {'username': username, 'error': str(e)}
    
    def bulk_get_users(self, usernames: List[str], max_workers: int = 3, delay: float = 2.0) -> List[Dict]:
        """
        Bulk fetch user info for multiple usernames
        
        Args:
            usernames: List of Instagram usernames
            max_workers: Number of concurrent threads
            delay: Delay between requests in seconds
            
        Returns:
            List of user data dictionaries
        """
        results = []
        failed = []
        
        logger.info(f"🚀 Starting bulk fetch for {len(usernames)} users...")
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_username = {
                executor.submit(self.get_user_info, username): username 
                for username in usernames
            }
            
            for future in as_completed(future_to_username):
                username = future_to_username[future]
                try:
                    result = future.result()
                    if result and 'error' not in result:
                        results.append(result)
                        logger.info(f"✅ Fetched: {username}")
                    else:
                        failed.append(username)
                        logger.warning(f"⚠️ Failed: {username}")
                except Exception as e:
                    failed.append(username)
                    logger.error(f"❌ Error for {username}: {e}")
                
                # Rate limiting - crucial for avoiding blocks
                time.sleep(delay)
        
        logger.info(f"📊 Summary: {len(results)} succeeded, {len(failed)} failed")
        return results
    
    def get_user_id_from_username(self, username: str) -> Optional[str]:
        """Get Instagram user ID from username"""
        try:
            profile = instaloader.Profile.from_username(self.loader.context, username)
            return profile.userid
        except Exception:
            return None
    
    def bulk_get_followers(self, username: str, limit: int = 100) -> List[str]:
        """
        Get followers of a user
        
        WARNING: Very slow for large accounts
        """
        try:
            profile = instaloader.Profile.from_username(self.loader.context, username)
            followers = []
            for follower in profile.get_followers():
                if len(followers) >= limit:
                    break
                followers.append(follower.username)
            return followers
        except Exception as e:
            logger.error(f"Error fetching followers for {username}: {e}")
            return []
    
    def bulk_get_following(self, username: str, limit: int = 100) -> List[str]:
        """
        Get following of a user
        
        WARNING: Very slow for large accounts
        """
        try:
            profile = instaloader.Profile.from_username(self.loader.context, username)
            following = []
            for followee in profile.get_followees():
                if len(following) >= limit:
                    break
                following.append(followee.username)
            return following
        except Exception as e:
            logger.error(f"Error fetching following for {username}: {e}")
            return []


# ===================== HELPER FUNCTIONS =====================

def save_to_json(data: List[Dict], filename: str = "instagram_data.json"):
    """Save data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info(f"💾 Data saved to {filename}")

def save_to_csv(data: List[Dict], filename: str = "instagram_data.csv"):
    """Save data to CSV file"""
    if not data:
        logger.warning("No data to save to CSV")
        return
    
    # Get all unique keys
    all_keys = set()
    for item in data:
        all_keys.update(item.keys())
    
    # Remove nested structures for CSV
    keys_to_remove = ['recent_posts', 'sample_followers']
    csv_keys = [key for key in all_keys if key not in keys_to_remove]
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=csv_keys)
        writer.writeheader()
        for item in data:
            # Filter out nested structures
            flat_item = {k: v for k, v in item.items() if k in csv_keys}
            writer.writerow(flat_item)
    
    logger.info(f"💾 Data saved to {filename}")

def load_usernames_from_file(filename: str) -> List[str]:
    """Load usernames from a text file (one per line)"""
    if not os.path.exists(filename):
        logger.error(f"File not found: {filename}")
        return []
    
    with open(filename, 'r') as f:
        usernames = [line.strip() for line in f if line.strip()]
    
    logger.info(f"📄 Loaded {len(usernames)} usernames from {filename}")
    return usernames


# ===================== MAIN EXECUTION =====================

def main():
    """
    Main execution function
    """
    # Configuration
    INSTAGRAM_USERNAME = "YOUR_INSTAGRAM_USERNAME"  # Your Instagram login
    INSTAGRAM_PASSWORD = "YOUR_INSTAGRAM_PASSWORD"  # Your Instagram password
    
    # List of usernames to fetch
    usernames = [
        "priyasharma",
        "rahulkumar", 
        "ananyasingh",
        "vikrampatel",
        "nehagupta"
    ]
    
    # Or load from file
    # usernames = load_usernames_from_file("usernames.txt")
    
    # Create fetcher
    fetcher = InstagramBulkFetcher(
        username=INSTAGRAM_USERNAME,
        password=INSTAGRAM_PASSWORD,
        session_file="instagram_session"
    )
    
    try:
        # Fetch user data
        users = fetcher.bulk_get_users(usernames, max_workers=2, delay=2.0)
        
        if users:
            # Save results
            save_to_json(users, f"instagram_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            save_to_csv(users, f"instagram_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
            
            # Display sample
            print("\n" + "="*60)
            print("📊 FETCHED DATA SUMMARY")
            print("="*60)
            for user in users[:3]:
                print(f"\n👤 {user.get('username')}")
                print(f"   Full Name: {user.get('full_name')}")
                print(f"   Followers: {user.get('followers', 'N/A'):,}")
                print(f"   Following: {user.get('following', 'N/A'):,}")
                print(f"   Posts: {user.get('posts', 'N/A')}")
                print(f"   Verified: {user.get('is_verified')}")
                print(f"   Bio: {user.get('biography', 'N/A')[:100]}...")
        else:
            logger.warning("No data fetched")
            
    except KeyboardInterrupt:
        logger.info("⏹️ Interrupted by user")
    except Exception as e:
        logger.error(f"❌ Error: {e}")


# ===================== ADVANCED USAGE =====================

class AdvancedInstagramFetcher(InstagramBulkFetcher):
    """
    Advanced fetcher with additional functionality
    """
    
    def get_user_with_posts(self, username: str, post_limit: int = 10) -> Optional[Dict]:
        """
        Fetch user info with their recent posts
        """
        try:
            profile = instaloader.Profile.from_username(self.loader.context, username)
            
            user_data = {
                'username': profile.username,
                'full_name': profile.full_name,
                'biography': profile.biography,
                'followers': profile.followers,
                'following': profile.followees,
                'posts': profile.mediacount,
                'is_private': profile.is_private,
                'is_verified': profile.is_verified,
            }
            
            # Get posts with details
            posts = []
            for post in profile.get_posts():
                if len(posts) >= post_limit:
                    break
                posts.append({
                    'shortcode': post.shortcode,
                    'likes': post.likes,
                    'comments': post.comments,
                    'caption': post.caption[:200] if post.caption else None,
                    'date': post.date_utc.isoformat(),
                    'video_views': post.video_view_count if hasattr(post, 'video_view_count') else None,
                    'is_video': post.is_video,
                    'url': f"https://www.instagram.com/p/{post.shortcode}/"
                })
            
            user_data['posts_data'] = posts
            return user_data
            
        except Exception as e:
            logger.error(f"Error fetching {username} with posts: {e}")
            return None
    
    def bulk_get_users_with_posts(self, usernames: List[str], post_limit: int = 5) -> List[Dict]:
        """
        Bulk fetch users with their recent posts
        """
        results = []
        
        for username in usernames:
            user_data = self.get_user_with_posts(username, post_limit)
            if user_data:
                results.append(user_data)
                logger.info(f"✅ Fetched {username} with {len(user_data.get('posts_data', []))} posts")
            time.sleep(3)
        
        return results


# ===================== RUN =====================

if __name__ == "__main__":
    main()