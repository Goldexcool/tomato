"""
Simple HTTP server to serve the static website
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class MyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=r"C:\Users\golde\tomatoenv\public", **kwargs)

if __name__ == "__main__":
    PORT = 3001
    os.chdir(r"C:\Users\golde\tomatoenv\public")
    
    with HTTPServer(("", PORT), MyHandler) as httpd:
        print(f"")
        print(f"🍅 ===============================================")
        print(f"   Tomato Disease Classifier Website")
        print(f"   Server running at: http://localhost:{PORT}")
        print(f"🍅 ===============================================")
        print(f"")
        print(f"   Open your browser and visit:")
        print(f"   👉 http://localhost:{PORT}")
        print(f"")
        print(f"   Press Ctrl+C to stop the server")
        print(f"")
        httpd.serve_forever()
