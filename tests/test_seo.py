import json
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.robotparser import RobotFileParser


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://itsfbridge.com"


def normalized(text):
    return " ".join(text.split())


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.canonicals = []
        self.metadata = {}
        self.links = []
        self.assets = []
        self.ids = set()
        self.schema = []
        self.json_active = False
        self.h1_count = 0
        self.faq = {}
        self.section = None
        self.capture = None
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag == "meta":
            self.metadata[attrs.get("name", attrs.get("property", ""))] = attrs.get("content", "")
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag in ("img", "script") and attrs.get("src"):
            self.assets.append(attrs["src"])
        if tag == "link" and attrs.get("rel") in ("stylesheet", "icon", "apple-touch-icon"):
            self.assets.append(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.json_active = True
            self.schema.append("")
        if tag == "section" and "data-faq" in attrs:
            self.section = attrs["id"]
            self.faq[self.section] = {"question": "", "answer": ""}
        if self.section and tag == "h2":
            self.capture = "question"
        if self.section and tag == "p" and "data-answer" in attrs:
            self.capture = "answer"

    def handle_data(self, data):
        if self.json_active:
            self.schema[-1] += data
        elif self.capture:
            self.faq[self.section][self.capture] += data

    def handle_endtag(self, tag):
        if tag == "script":
            self.json_active = False
        if tag in ("h2", "p"):
            self.capture = None
        if tag == "section":
            self.section = None


class SearchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {path.name: Page(path) for path in ROOT.glob("*.html")}

    def test_canonicals_headings_and_indexability(self):
        for name, page in self.pages.items():
            with self.subTest(page=name):
                expected = ORIGIN + ("/" if name == "index.html" else "/" + name)
                self.assertEqual(page.canonicals, [expected])
                self.assertEqual(page.h1_count, 1)
                self.assertNotIn("noindex", page.metadata.get("robots", ""))
                self.assertNotIn("nosnippet", page.metadata.get("robots", ""))
                self.assertTrue(page.metadata.get("description"))

    def test_sitemap_matches_public_pages(self):
        xml = ET.parse(ROOT / "sitemap.xml")
        urls = [node.text for node in xml.findall("{*}url/{*}loc")]
        expected = {page.canonicals[0] for page in self.pages.values()}
        self.assertEqual(len(urls), len(expected))
        self.assertEqual(set(urls), expected)

    def test_internal_links_and_assets(self):
        for name, page in self.pages.items():
            for value in page.links + page.assets:
                with self.subTest(page=name, link=value):
                    url = urlparse(value)
                    if url.scheme or url.netloc:
                        continue
                    filename = unquote(url.path.lstrip("/")) or ("index.html" if url.path else name)
                    self.assertTrue((ROOT / filename).is_file(), filename)
                    if url.fragment and filename in self.pages:
                        self.assertIn(url.fragment, self.pages[filename].ids)

    def test_organization_and_service_identity(self):
        homepage = self.pages["index.html"]
        data = json.loads(homepage.schema[0])
        graph = {node["@type"]: node for node in data["@graph"]}
        self.assertEqual(set(graph), {"WebSite", "Organization", "Service"})
        self.assertEqual(graph["WebSite"]["url"], ORIGIN + "/")
        self.assertEqual(graph["WebSite"]["name"], "FBridge")
        self.assertEqual(graph["Service"]["provider"]["@id"], graph["Organization"]["@id"])
        self.assertEqual(graph["Organization"]["sameAs"], ["https://www.linkedin.com/company/itsfbridge"])
        self.assertTrue((ROOT / urlparse(graph["Organization"]["logo"]).path.lstrip("/")).is_file())
        self.assertEqual(homepage.metadata["og:image"], ORIGIN + "/assets/og-logo.png")

    def test_faq_markup_matches_visible_answers(self):
        page = self.pages["sourcing-questions.html"]
        data = json.loads(page.schema[0])
        self.assertEqual(data["@type"], "FAQPage")
        visible = {(normalized(item["question"]), normalized(item["answer"])) for item in page.faq.values()}
        marked = {(normalized(item["name"]), normalized(item["acceptedAnswer"]["text"])) for item in data["mainEntity"]}
        self.assertEqual(len(visible), 7)
        self.assertEqual(visible, marked)
        self.assertIn("sourcing-questions.html", self.pages["index.html"].links)

    def test_search_crawlers_allowed(self):
        robots = RobotFileParser()
        robots.parse((ROOT / "robots.txt").read_text().splitlines())
        self.assertIn(ORIGIN + "/sitemap.xml", robots.site_maps())
        for agent in ["Googlebot", "bingbot", "OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"]:
            for page in self.pages.values():
                self.assertTrue(robots.can_fetch(agent, page.canonicals[0]), agent)


if __name__ == "__main__":
    unittest.main()
