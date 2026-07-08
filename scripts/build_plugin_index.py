#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["rdflib"]
# ///
"""Walk an extracted LV2 plugin directory and emit src/_data/plugins.json
for the Eleventy-built plugin index table.

Usage: scripts/build_plugin_index.py [path-to-lv2-dir]
Defaults to ~/lv2.
"""

import glob
import json
import math
import os
import sys

import rdflib
from rdflib.namespace import RDF

LV2 = "http://lv2plug.in/ns/lv2core#"
DOAP = "http://usefulinc.com/ns/doap#"
FOAF = "http://xmlns.com/foaf/0.1/"
RDFS_COMMENT = "http://www.w3.org/2000/01/rdf-schema#comment"
LV2_PLUGIN = rdflib.URIRef(LV2 + "Plugin")

# Best-effort mapping from license URIs/strings found in the wild to a short label.
LICENSE_MAP = {
    "gpl-3.0": "GPL-3.0",
    "gpl3": "GPL-3.0",
    "gpl-2.0": "GPL-2.0",
    "gpl2": "GPL-2.0",
    "gpl": "GPL",
    "lgpl-3.0": "LGPL-3.0",
    "lgpl-2.1": "LGPL-2.1",
    "lgpl": "LGPL",
    "isc": "ISC",
    "mit": "MIT",
    "bsd": "BSD",
    "artistic-2.0": "Artistic-2.0",
    "mpl-2.0": "MPL-2.0",
    "apache-2.0": "Apache-2.0",
    "cc0": "CC0",
    "cc-by-sa": "CC-BY-SA",
}


# Rough estimate of how many visual rows a comment will wrap to in the
# table cell, so we only show the "read more" popover when the CSS
# line-clamp will actually kick in. Blank lines (paragraph breaks) count
# as a wrapped row too, since the browser renders them that way.
COMMENT_CLAMP_LINES = 3
CHARS_PER_LINE_ESTIMATE = 60


def estimate_wrapped_lines(text: str, chars_per_line: int = CHARS_PER_LINE_ESTIMATE) -> int:
    lines = 0
    for raw_line in text.split("\n"):
        stripped = raw_line.strip()
        lines += max(1, math.ceil(len(stripped) / chars_per_line)) if stripped else 1
    return lines


def friendly_license(raw: str) -> str:
    key = raw.rstrip("/").rsplit("/", 1)[-1].lower()
    key = key.replace(".html", "").replace(".txt", "")
    return LICENSE_MAP.get(key, raw)


def load_graph(bundle_dir: str) -> rdflib.Graph:
    g = rdflib.Graph()
    for ttl in glob.glob(os.path.join(bundle_dir, "*.ttl")):
        try:
            g.parse(ttl, format="turtle")
        except Exception:
            pass
    return g


def plugin_subjects(g: rdflib.Graph):
    subjects = set(g.subjects(RDF.type, LV2_PLUGIN))
    if not subjects:
        for s, _, o in g.triples((None, RDF.type, None)):
            if "Plugin" in str(o):
                subjects.add(s)
    return subjects


def first(g, s, pred):
    for o in g.objects(s, rdflib.URIRef(pred)):
        return o
    return None


def extract(bundle_dir: str, dirname: str):
    g = load_graph(bundle_dir)
    subjects = plugin_subjects(g)
    if not subjects:
        return None
    # A bundle occasionally declares more than one plugin variant; take the
    # first alphabetically by URI for a stable, deterministic pick.
    subject = sorted(subjects, key=str)[0]

    name = first(g, subject, DOAP + "name")
    comment = first(g, subject, RDFS_COMMENT)

    categories = sorted(
        {
            str(o).split("#")[-1].removesuffix("Plugin")
            for o in g.objects(subject, RDF.type)
            if "lv2core#" in str(o) and str(o) != LV2 + "Plugin"
        }
    )

    license_node = first(g, subject, DOAP + "license")
    license_label = friendly_license(str(license_node)) if license_node else None

    maintainer_label = None
    maintainer_node = first(g, subject, DOAP + "maintainer")
    if maintainer_node is not None:
        maintainer_label = first(g, maintainer_node, FOAF + "name")
        maintainer_label = str(maintainer_label) if maintainer_label else None

    minor = first(g, subject, LV2 + "minorVersion")
    micro = first(g, subject, LV2 + "microVersion")
    version = f"{minor}.{micro}" if minor is not None and micro is not None else None

    comment_text = str(comment).strip() if comment else None
    comment_truncated = (
        estimate_wrapped_lines(comment_text) > COMMENT_CLAMP_LINES
        if comment_text
        else False
    )

    return {
        "uri": str(subject),
        "name": str(name) if name else dirname,
        "bundle": dirname,
        "categories": categories,
        "comment": comment_text,
        "commentTruncated": comment_truncated,
        "license": license_label,
        "maintainer": maintainer_label,
        "version": version,
    }


def main():
    lv2_dir = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/lv2")
    if not os.path.isdir(lv2_dir):
        print(f"error: {lv2_dir} is not a directory", file=sys.stderr)
        sys.exit(1)

    plugins = []
    for dirname in sorted(os.listdir(lv2_dir)):
        bundle_dir = os.path.join(lv2_dir, dirname)
        if not os.path.isdir(bundle_dir):
            continue
        entry = extract(bundle_dir, dirname)
        if entry:
            plugins.append(entry)

    plugins.sort(key=lambda p: p["name"].lower())

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(repo_root, "src", "_data", "plugins.json")
    with open(out_path, "w") as f:
        json.dump(plugins, f, indent=2)
        f.write("\n")

    print(f"Wrote {len(plugins)} plugins to {out_path}")


if __name__ == "__main__":
    main()
