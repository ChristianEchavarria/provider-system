"""
Configuracion centralizada -- carga .env, normaliza URLs y valida credenciales.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass
class MstrConfig:
    """Contenedor inmutable de toda la configuracion MicroStrategy."""

    base_url: str
    username: str
    password: str
    default_project: str = "Virtualsoft"
    login_mode: int = 1
    instance_retries: int = 5
    instance_connect_timeout: int = 60
    instance_read_timeout: int = 1800

    @staticmethod
    def _normalize_url(raw_url: str) -> str:
        url = raw_url.strip().rstrip("/")
        if "/MicroStrategy/servlet/mstrWeb" in url:
            url = url.replace("/MicroStrategy/servlet/mstrWeb", "/MicroStrategyLibrary")
        elif url.endswith("/mstrWeb"):
            url = url[: -len("/mstrWeb")] + "/MicroStrategyLibrary"
        return url

    @classmethod
    def from_env(cls, dotenv_path: str | None = None) -> "MstrConfig":
        load_dotenv(dotenv_path, override=True)
        raw_url = (os.getenv("MICROSTRATEGY_URL") or os.getenv("MSTR_BASE_URL") or "")
        username = (os.getenv("MICROSTRATEGY_USER") or os.getenv("MSTR_USERNAME") or "").strip()
        password = (os.getenv("MICROSTRATEGY_PASSWORD") or os.getenv("MSTR_PASSWORD") or "").strip()

        if not raw_url or not username or not password:
            raise RuntimeError("Faltan credenciales MICROSTRATEGY_URL/USER/PASSWORD en .env")

        return cls(
            base_url=cls._normalize_url(raw_url),
            username=username,
            password=password,
            default_project=(os.getenv("DEFAULT_PROJECT") or "Virtualsoft").strip(),
            login_mode=int((os.getenv("MSTR_LOGIN_MODE") or "1").strip()),
            instance_retries=int((os.getenv("MSTR_INSTANCE_RETRIES") or "5").strip()),
            instance_connect_timeout=int((os.getenv("MSTR_INSTANCE_CONNECT_TIMEOUT") or "60").strip()),
            instance_read_timeout=int((os.getenv("MSTR_INSTANCE_READ_TIMEOUT") or "1800").strip()),
        )
