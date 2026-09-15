"""
Domain 1: Cloud Concepts (156 Questions)
"""

def generate_domain1():
    items = []
    
    def q(code_idx, text, q_type, req_sel, options, exp, topic, diff, tags, mod):
        code = f"CP-{code_idx:03d}"
        items.append({
            "id": f"d1-{code_idx}",
            "questionCode": code,
            "questionText": text,
            "type": q_type,
            "requiredSelections": req_sel,
            "options": [{"label": o[0], "text": o[1], "isCorrect": o[2]} for o in options],
            "explanation": exp,
            "domain": "Cloud Concepts",
            "domainId": 1,
            "topic": topic,
            "difficulty": diff,
            "tags": tags,
            "sourceModule": mod,
            "status": "APPROVED"
        })

    # We will populate 156 questions for Domain 1
    # Let's define the comprehensive list of 156 questions
    # Topics:
    # 1. Cloud Definition & Deployment Models (20 Qs)
    # 2. 6 Advantages of Cloud Computing (30 Qs)
    # 3. Elasticity, Scalability, HA & Disaster Recovery (26 Qs)
    # 4. AWS Well-Architected Framework (40 Qs)
    # 5. Cloud Adoption Framework (CAF) (20 Qs)
    # 6. Migration Strategies (6 Rs) & Snow Family (20 Qs)

    # Let's import the full data array or write out the questions
    return items
