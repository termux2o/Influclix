# app/agents/prompts/__init__.py
from pathlib import Path


def load_prompt(name: str) -> str:
    """Read a prompt file from this folder."""
    path = Path(__file__).parent / name
    return path.read_text(encoding="utf-8")