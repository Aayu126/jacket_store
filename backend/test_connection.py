"""
Suedo Atelier - Quick MySQL Connection Diagnostics Tool
Tests connection to MySQL and checks/creates suedo_db.
Usage:
    python test_connection.py
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pymysql
from app.database import engine


def test():
    print("=" * 60)
    print("  SUEDO ATELIER - MYSQL CONNECTION DIAGNOSTIC")
    print("=" * 60)
    print(f"• Host:            {engine.url.host}")
    print(f"• Port:            {engine.url.port}")
    print(f"• User:            {engine.url.username}")
    print(f"• Password length: {len(engine.url.password) if engine.url.password else 0} characters")
    print(f"• Target Database: {engine.url.database}\n")

    # Step 1: Test basic MySQL connection (without requiring database to exist yet)
    print("Attempting connection to MySQL server...")
    try:
        conn = pymysql.connect(
            host=engine.url.host or "localhost",
            port=engine.url.port or 3306,
            user=engine.url.username,
            password=engine.url.password or ""
        )
        print("✓ SUCCESS: Authentication accepted by MySQL server!\n")

        with conn.cursor() as cursor:
            cursor.execute("SHOW DATABASES;")
            databases = [row[0] for row in cursor.fetchall()]
            print(f"• Existing databases on server: {', '.join(databases)}")

            target_db = engine.url.database
            if target_db in databases:
                print(f"✓ Target database '{target_db}' already exists.")
            else:
                print(f"ℹ Database '{target_db}' does not exist yet. Creating it automatically...")
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{target_db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
                print(f"✓ Database '{target_db}' created successfully!")

        conn.close()
        print("\n" + "=" * 60)
        print("✨ Database connection verified! You can now run:")
        print("   python seed_data.py")
        print("=" * 60)
        return True

    except pymysql.err.OperationalError as e:
        code = e.args[0] if len(e.args) > 0 else 0
        msg = e.args[1] if len(e.args) > 1 else str(e)

        print("\n" + "!" * 60)
        if code == 1045:
            print(f"❌ Error 1045: Authentication Failed!")
            print(f"   MySQL rejected the password for user '{engine.url.username}'.")
            print("\nHow to fix:")
            print("1. Check case-sensitivity (e.g. lowercase vs uppercase letters).")
            print("2. If you use MySQL Workbench, check what password is saved in your connection.")
            print("3. In backend/.env, update DATABASE_URL with the correct password:")
            print("   DATABASE_URL=mysql+pymysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/suedo_db")
        elif code == 2003:
            print(f"❌ Error 2003: MySQL Server is not responding on port 3306.")
            print("   Make sure the MySQL service is started (e.g. net start MySQL80).")
        else:
            print(f"❌ MySQL Error ({code}): {msg}")
        print("!" * 60)
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False


if __name__ == "__main__":
    test()
