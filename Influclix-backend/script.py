from pymongo import MongoClient
from urllib.parse import quote_plus

user = "aakash0001itm"
pwd  = quote_plus("cqpspFMkjs5XSmtT")   # your real password here
cl=MongoClient(f"mongodb+srv://aakash0001itm:cqpspFMkjs5XSmtT@cluster0.jwsntoa.mongodb.net/?appName=Cluster0")


# List all databases (excluding system ones)
for db_name in cl.list_database_names():
    if db_name in ("admin", "local", "config"):
        continue

    db = cl[db_name]
    print(f"\n📁 Database: {db_name}")

    db_total = 0
    for coll_name in db.list_collection_names():
        stats = db.command("collstats", coll_name)
        size_mb = stats["size"] / (1024 * 1024)          # uncompressed data
        storage_mb = stats["storageSize"] / (1024 * 1024) # compressed on disk
        index_mb = stats.get("totalIndexSize", 0) / (1024 * 1024)

        db_total += size_mb

        print(f"   └─ 📄 {coll_name}")
        print(f"        Data size     : {size_mb:.2f} MB")
        print(f"        Storage size  : {storage_mb:.2f} MB")
        print(f"        Index size    : {index_mb:.2f} MB")

    print(f"   ➡️  Total data size for {db_name}: {db_total:.2f} MB")
