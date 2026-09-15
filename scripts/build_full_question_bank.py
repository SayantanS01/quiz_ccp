#!/usr/bin/env python3
"""
Assemble all 650 questions from Domain 1, 2, 3, and 4 into prisma/questions_650.json.
"""

import json
import os
import sys

sys.path.append(os.path.dirname(__file__))

from generate_d1 import get_d1_questions
from generate_d2 import get_d2_questions
from generate_d3 import get_d3_questions
from generate_d4 import get_d4_questions

def main():
    print("Gathering questions from Domain 1...")
    d1 = get_d1_questions()
    print(f"Domain 1: {len(d1)} questions")

    print("Gathering questions from Domain 2...")
    d2 = get_d2_questions()
    print(f"Domain 2: {len(d2)} questions")

    print("Gathering questions from Domain 3...")
    d3 = get_d3_questions()
    print(f"Domain 3: {len(d3)} questions")

    print("Gathering questions from Domain 4...")
    d4 = get_d4_questions()
    print(f"Domain 4: {len(d4)} questions")

    all_questions = d1 + d2 + d3 + d4
    total = len(all_questions)
    print(f"Total aggregated questions: {total}")
    assert total == 650, f"Expected exactly 650 questions, got {total}!"

    # Ensure unique IDs and unique codes
    seen_codes = set()
    seen_ids = set()
    for idx, q in enumerate(all_questions, 1):
        expected_code = f"CP-{idx:03d}"
        if q["questionCode"] != expected_code:
            q["questionCode"] = expected_code
        q["id"] = f"cp-{idx:03d}"
        assert q["questionCode"] not in seen_codes, f"Duplicate code: {q['questionCode']}"
        seen_codes.add(q["questionCode"])
        seen_ids.add(q["id"])

    out_path = os.path.join(os.path.dirname(__file__), "..", "prisma", "questions_650.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)

    print(f"Successfully wrote {total} questions to {out_path}!")

if __name__ == "__main__":
    main()
