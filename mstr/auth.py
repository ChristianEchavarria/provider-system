"""
Autenticacion MicroStrategy -- login, logout y context-manager de sesion.
"""

from __future__ import annotations

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .config import MstrConfig


def _build_session() -> requests.Session:
    session = requests.Session()
    retry = Retry(total=10, backoff_factor=5, status_forcelist=[429, 500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def login(session: requests.Session, config: MstrConfig) -> str:
    url = f"{config.base_url}/api/auth/login"
    mode = config.login_mode
    payload = {"username": config.username, "password": config.password, "loginMode": mode}

    resp = session.post(url, json=payload, timeout=(5, 30))

    if resp.status_code == 401:
        try:
            err = resp.json()
        except Exception:
            err = {}
        error_code = err.get("additionalProperties", {}).get("loginErrorCode") or err.get("code") or ""
        if error_code == "INVALID_AUTH_MODE" and mode != 1:
            print(f"[LOGIN INFO] loginMode={mode} no valido; reintentando con loginMode=1")
            payload["loginMode"] = 1
            resp = session.post(url, json=payload, timeout=(5, 30))

    resp.raise_for_status()
    token = resp.headers.get("X-MSTR-AuthToken")
    if not token:
        raise RuntimeError("No se recibio X-MSTR-AuthToken")
    return token


def logout(session: requests.Session, config: MstrConfig, token: str) -> None:
    try:
        session.post(f"{config.base_url}/api/auth/logout", headers={"X-MSTR-AuthToken": token}, timeout=(5, 30))
    except Exception:
        pass


class MstrSession:
    def __init__(self, config: MstrConfig) -> None:
        self.config = config
        self.session: requests.Session | None = None
        self.token: str | None = None

    def __enter__(self) -> "MstrSession":
        self.session = _build_session()
        self.token = login(self.session, self.config)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self.session and self.token:
            logout(self.session, self.config, self.token)
        if self.session:
            self.session.close()
        return False
