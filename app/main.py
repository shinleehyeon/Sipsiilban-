from contextlib import asynccontextmanager

from fastapi import FastAPI
from tortoise import generate_config, Tortoise
from tortoise.contrib.fastapi import RegisterTortoise
from utils.env_validator import settings

from utils.logger import logger

from app.auth.endpoint import router as auth_router
from app.payment.endpoint import router as payment_router
from app.user.endpoint import router as user_router
from app.identify.endpoint import router as identify_router
from app.merchant.endpoint import router as merchant_router

logger = logger("bootstrap")


def bootstrap() -> FastAPI:
    @asynccontextmanager
    async def lifespan(application: FastAPI) -> None:
        logger.info("Starting application")
        config = generate_config(
            settings.DATABASE_URI,
            app_modules={
                "models": [
                    "app.user.entities",
                    "app.payment.entites",
                    "app.organization.entities",
                    "app.merchant.entities",
                ]
            },
            testing=settings.APP_ENV == "development",
            connection_label="models",
        )
        async with RegisterTortoise(
            app=application,
            config=config,
            generate_schemas=True,
            add_exception_handlers=True,
        ):
            logger.info("Tortoise ORM registered")
            yield
        logger.info("Shutting down application")
        await Tortoise.close_connections()
        logger.info("Tortoise ORM connections closed")
        logger.info("Application shutdown complete")

    app = FastAPI(
        title="Sunrinthon API",
        lifespan=lifespan,
        debug=settings.APP_ENV == "development",
    )
    return app


server = bootstrap()

server.include_router(auth_router)
server.include_router(payment_router)

server.include_router(user_router)

server.include_router(identify_router)

server.include_router(merchant_router)
