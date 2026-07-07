#!/usr/bin/env python3
"""
Prepare SplashLens outreach prospects from verified source URLs.

This is intentionally a queue-prep tool, not a sender. It fetches public pages,
extracts email-like contacts, filters obvious junk, and writes review rows that
still require human/source verification before any outreach.

Usage:
  python tools/prepare_outreach_queue_from_urls.py \
    --input docs/outreach/source-urls.txt \
    --output docs/outreach/prospect-review.csv
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import time
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)
BAD_EMAIL_PARTS = (
    "example.",
    "sentry.",
    "wixpress.",
    "schema.",
    "domain.com",
    "email.com",
    "yourname",
    "noreply",
    "no-reply",
)
CONTACT_HINTS = ("contact", "about", "team", "media", "press", "editor", "advertis", "support")
USER_AGENT = "SplashLensProspectPrep/1.0 (+https://splashlens.com)"


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.title_chunks: list[str] = []
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "title":
            self._in_title = True
        if tag.lower() != "a":
            return
        attrs_map = dict(attrs)
        href = attrs_map.get("href")
        if href:
            self.links.append(href)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_chunks.append(data.strip())

    @property
    def title(self) -> str:
        return " ".join(x for x in self.title_chunks if x).strip()


@dataclass(frozen=True)
class Prospect:
    source_url: str
    discovered_url: str
    email: str
    page_title: str
    lane: str
    status: str
    note: str


def fetch(url: str, timeout: int) -> tuple[str, str]:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as response:
        content_type = response.headers.get("content-type", "")
        raw = response.read(1_500_000)
    charset = "utf-8"
    match = re.search(r"charset=([^;\s]+)", content_type, re.I)
    if match:
        charset = match.group(1)
    return raw.decode(charset, errors="replace"), content_type


def clean_emails(text: str) -> set[str]:
    text = unescape(text).replace("&#64;", "@").replace("[at]", "@").replace("(at)", "@")
    emails = {email.strip(".,;:()[]<>").lower() for email in EMAIL_RE.findall(text)}
    return {email for email in emails if not any(part in email for part in BAD_EMAIL_PARTS)}


def candidate_contact_urls(base_url: str, html: str) -> list[str]:
    parser = LinkParser()
    parser.feed(html)
    base_domain = urlparse(base_url).netloc.lower()
    candidates: list[str] = []
    for href in parser.links:
        full = urljoin(base_url, href)
        parsed = urlparse(full)
        if parsed.scheme not in {"http", "https"}:
            continue
        if parsed.netloc.lower() != base_domain:
            continue
        lower = full.lower()
        if any(hint in lower for hint in CONTACT_HINTS):
            candidates.append(full.split("#")[0])
    return list(dict.fromkeys(candidates))[:5]


def infer_lane(url: str, title: str) -> str:
    combined = f"{url} {title}".lower()
    if any(word in combined for word in ("podcast", "youtube", "creator", "media")):
        return "creator-media"
    if any(word in combined for word in ("magazine", "news", "editor", "publication")):
        return "publication"
    if any(word in combined for word in ("training", "school", "cpo", "course", "instructor")):
        return "training"
    if any(word in combined for word in ("pool service", "service company", "repair")):
        return "pool-service-company"
    if any(word in combined for word in ("manufacturer", "product", "equipment")):
        return "manufacturer"
    return "needs-classification"


def scrape_source(source_url: str, timeout: int, delay: float) -> list[Prospect]:
    try:
        html, content_type = fetch(source_url, timeout)
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        return [
            Prospect(
                source_url=source_url,
                discovered_url=source_url,
                email="",
                page_title="",
                lane="needs-review",
                status="fetch-failed",
                note=str(exc)[:180],
            )
        ]

    if "text/html" not in content_type.lower() and "text/plain" not in content_type.lower():
        return []

    parser = LinkParser()
    parser.feed(html)
    rows: list[Prospect] = []
    seen: set[tuple[str, str]] = set()

    pages_to_check = [source_url, *candidate_contact_urls(source_url, html)]
    for idx, page_url in enumerate(pages_to_check):
        page_html = html
        page_title = parser.title
        if idx > 0:
            time.sleep(delay)
            try:
                page_html, _ = fetch(page_url, timeout)
                page_parser = LinkParser()
                page_parser.feed(page_html)
                page_title = page_parser.title
            except (HTTPError, URLError, TimeoutError, OSError):
                continue
        for email in sorted(clean_emails(page_html)):
            key = (page_url, email)
            if key in seen:
                continue
            seen.add(key)
            rows.append(
                Prospect(
                    source_url=source_url,
                    discovered_url=page_url,
                    email=email,
                    page_title=page_title,
                    lane=infer_lane(page_url, page_title),
                    status="needs-verification",
                    note="Public page extraction; verify source, suppression, and fit before sending.",
                )
            )
    return rows


def read_sources(path: Path) -> list[str]:
    sources: list[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if not line.startswith(("http://", "https://")):
            print(f"Skipping non-URL line: {line}", file=sys.stderr)
            continue
        sources.append(line)
    return list(dict.fromkeys(sources))


def write_rows(path: Path, rows: Iterable[Prospect]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "source_url",
                "discovered_url",
                "email",
                "page_title",
                "lane",
                "status",
                "note",
            ],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row.__dict__)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--timeout", default=20, type=int)
    parser.add_argument("--delay", default=1.0, type=float)
    args = parser.parse_args()

    sources = read_sources(args.input)
    all_rows: list[Prospect] = []
    for source in sources:
        all_rows.extend(scrape_source(source, timeout=args.timeout, delay=args.delay))
        time.sleep(args.delay)

    write_rows(args.output, all_rows)
    print(f"Wrote {len(all_rows)} review rows from {len(sources)} source URLs to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
