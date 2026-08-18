import uvicorn
from utils.env_validator import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:server",
        host="0.0.0.0",
        port=settings.SERVER_PORT,
        reload=settings.APP_ENV == "development" or settings.APP_ENV == "testing",
        reload_dirs=["app"],
        reload_includes=[".env"],
        reload_excludes=[".venv"],
    )
