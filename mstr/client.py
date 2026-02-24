"""
Cliente MicroStrategy -- proyectos, instancias de reportes/dossiers y paginacion.
"""

from __future__ import annotations

import json
import time
from typing import Literal

import requests

from .config import MstrConfig

ObjectType = Literal["report", "dossier"]


def resolve_project_id(session, config, token, project_name=None):
    name = project_name or config.default_project
    url = f"{config.base_url}/api/projects"
    headers = {"X-MSTR-AuthToken": token}
    resp = session.get(url, headers=headers, timeout=(5, 30))
    resp.raise_for_status()
    for proj in resp.json():
        if proj.get("name") == name:
            return proj["id"]
    available = [p.get("name") for p in resp.json()]
    raise RuntimeError(f"Proyecto '{name}' no encontrado. Disponibles: {available}")


def detect_object_type(session, config, token, project_id, object_id):
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    try:
        resp = session.get(f"{config.base_url}/api/reports/{object_id}", headers=headers, timeout=(10, 30))
        if resp.status_code == 200:
            return "report"
    except requests.RequestException:
        pass
    try:
        resp = session.get(f"{config.base_url}/api/dossiers/{object_id}/definition", headers=headers, timeout=(10, 30))
        if resp.status_code == 200:
            return "dossier"
    except requests.RequestException:
        pass
    return "report"


def create_report_instance(session, config, token, project_id, report_id):
    url = f"{config.base_url}/api/reports/{report_id}/instances"
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    retryable = {429, 500, 502, 503, 504}
    max_retries = config.instance_retries
    resp = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = session.post(url, headers=headers, timeout=(config.instance_connect_timeout, config.instance_read_timeout))
            if resp.status_code < 400:
                break
            if resp.status_code in retryable and attempt < max_retries:
                wait = min(15 * (2 ** (attempt - 1)), 120)
                print(f"[INSTANCE RETRY] {attempt}/{max_retries} - status {resp.status_code}. Retry in {wait}s...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
        except requests.RequestException as exc:
            if attempt < max_retries:
                wait = min(15 * (2 ** (attempt - 1)), 120)
                print(f"[INSTANCE RETRY] {attempt}/{max_retries} - {type(exc).__name__}. Retry in {wait}s...")
                time.sleep(wait)
                continue
            raise
    if resp is None:
        raise RuntimeError("No se pudo crear la instancia del reporte")
    resp.raise_for_status()
    instance_id = resp.json().get("instanceId")
    if not instance_id:
        raise RuntimeError("No se recibio instanceId")
    return instance_id


def fetch_report_page(session, config, token, project_id, report_id, instance_id, offset=0, limit=50_000):
    url = f"{config.base_url}/api/reports/{report_id}/instances/{instance_id}"
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    params = {"offset": offset, "limit": limit}
    resp = session.get(url, headers=headers, params=params, timeout=(60, 1500))
    resp.raise_for_status()
    payload = resp.json()
    if not payload or "result" not in payload:
        return None
    return payload


def get_dossier_definition(session, config, token, project_id, dossier_id):
    url = f"{config.base_url}/api/dossiers/{dossier_id}/definition"
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    resp = session.get(url, headers=headers, timeout=(30, 120))
    resp.raise_for_status()
    return resp.json()


def create_dossier_instance(session, config, token, project_id, dossier_id):
    url = f"{config.base_url}/api/dossiers/{dossier_id}/instances"
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    retryable = {429, 500, 502, 503, 504}
    max_retries = config.instance_retries
    resp = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = session.post(url, headers=headers, timeout=(config.instance_connect_timeout, config.instance_read_timeout))
            if resp.status_code < 400:
                break
            if resp.status_code in retryable and attempt < max_retries:
                wait = min(15 * (2 ** (attempt - 1)), 120)
                print(f"[DOSSIER RETRY] {attempt}/{max_retries} - status {resp.status_code}. Retry in {wait}s...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
        except requests.RequestException as exc:
            if attempt < max_retries:
                wait = min(15 * (2 ** (attempt - 1)), 120)
                print(f"[DOSSIER RETRY] {attempt}/{max_retries} - {type(exc).__name__}. Retry in {wait}s...")
                time.sleep(wait)
                continue
            raise
    if resp is None:
        raise RuntimeError("No se pudo crear la instancia del dossier")
    resp.raise_for_status()
    data = resp.json()
    mid = data.get("mid", "")
    instance_id = data.get("id", mid)
    if not mid and not instance_id:
        raise RuntimeError(f"No se recibio identificador del dossier. Response: {json.dumps(data, default=str)[:500]}")
    if not instance_id:
        instance_id = mid
    return instance_id, mid


def fetch_dossier_visualization(session, config, token, project_id, dossier_id, instance_id, chapter_key, visualization_key, offset=0, limit=50_000):
    url = f"{config.base_url}/api/dossiers/{dossier_id}/instances/{instance_id}/chapters/{chapter_key}/visualizations/{visualization_key}"
    headers = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": project_id}
    params = {"offset": offset, "limit": limit}
    resp = session.get(url, headers=headers, params=params, timeout=(60, 1500))
    resp.raise_for_status()
    payload = resp.json()
    return payload if payload else None


def list_dossier_visualizations(definition):
    visualizations = []
    for chapter in definition.get("chapters", []):
        ch_key = chapter.get("key", "")
        ch_name = chapter.get("name", "")
        for page in chapter.get("pages", []):
            for viz in page.get("visualizations", []):
                visualizations.append({
                    "chapter_key": ch_key,
                    "chapter_name": ch_name,
                    "visualization_key": viz.get("key", ""),
                    "visualization_name": viz.get("name", ""),
                })
    return visualizations
