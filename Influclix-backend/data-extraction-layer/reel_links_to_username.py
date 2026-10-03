import csv
from urllib.parse import urlparse


INPUT_FILE = "1lak_data.csv"
OUTPUT_FILE = "username.csv"


def extract_username(url):
    try:
        path = urlparse(url.strip()).path
        parts = [part for part in path.split("/") if part]

        # Instagram URL:
        # /username/reel/xxxxx/
        if parts:
            return parts[0]

    except Exception:
        pass

    return None


with open(INPUT_FILE, "r", newline="", encoding="utf-8") as infile:
    reader = csv.DictReader(infile)

    usernames = []

    for row in reader:
        username = extract_username(row["tagged_links"])

        if username:
            usernames.append(username)


# Drop duplicates while preserving original order
unique_usernames = list(dict.fromkeys(usernames))


with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as outfile:
    writer = csv.writer(outfile)

    writer.writerow(["username"])

    for username in unique_usernames:
        writer.writerow([username])


print(f"Extracted {len(usernames)} usernames")
print(f"Removed {len(usernames) - len(unique_usernames)} duplicates")
print(f"Unique usernames: {len(unique_usernames)}")
print(f"Saved to {OUTPUT_FILE}")
