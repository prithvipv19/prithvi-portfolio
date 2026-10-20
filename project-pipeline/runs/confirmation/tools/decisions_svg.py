# Generates public/images/confirmation/key-decisions.svg: decisions hung under the flow stage where they apply.
# Run from the repo root: python3 project-pipeline/runs/confirmation/tools/decisions_svg.py
import textwrap, html

STAGES = [
  ('Policy', [
    ('Starting the review', 'HR chases dates in a spreadsheet', 'Auto-start 15 days before the due date', 'Probation days must be right in every profile'),
    ('Extensions', 'Extend as often as anyone likes', 'Reason required, at most 2 extensions', 'Rare cases need an admin override'),
  ]),
  ('Track', [
    ('Visibility', 'Reports built in a query tool', 'A board with due, overdue and extension counts', 'Fixed metrics, not ad hoc analysis'),
  ]),
  ('Review', [
    ('Evaluation', 'Free-text feedback only', 'One rating form per policy', 'Less room for role-specific questions'),
    ('Feedback', 'One comment box everyone sees', 'Feedback for the employee, remarks kept private', 'Managers write two notes, not one'),
  ]),
  ('Decide', [
    ('Outcomes', 'Confirm, extend, or an unclear reject', 'Confirm, extend or do not confirm', 'Do not confirm needs an exit flow'),
    ('Stuck reviews', "Wait on the manager's inbox", 'Auto-forward to HR head after 3 days', "May decide without the manager's input"),
  ]),
  ('Automate', [
    ('After the decision', 'Five separate tasks for HR', 'Status, notice, letter, leave and tasks update on their own', 'Every downstream rule mapped up front'),
  ]),
]

W, COLW, GAP, X0 = 1200, 214, 18, 31
CARD_H, CARD_GAP, TOP = 296, 16, 168
H = TOP + 2 * CARD_H + CARD_GAP + 54
esc = html.escape
out = []
add = out.append
add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="system-ui, -apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif">')
add('<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2b2160"/></marker></defs>')
add(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
add('<text x="40" y="46" font-size="26" font-weight="800" fill="#2b2160">Key decisions, where they sit in the flow</text>')
add('<text x="40" y="74" font-size="15" fill="#4a4470">Each card: what teams did before, what I chose instead, and what that choice cost.</text>')

def lines(x, y, txt, width, size, lh, **attrs):
    a = ' '.join(f'{k.replace("_","-")}="{v}"' for k, v in attrs.items())
    rows = textwrap.wrap(txt, width)
    add(f'<text x="{x}" y="{y}" font-size="{size}" {a}>' + ''.join(
        f'<tspan x="{x}" dy="{0 if i == 0 else lh}">{esc(r)}</tspan>' for i, r in enumerate(rows)) + '</text>')
    return len(rows)

# Spine
cx = [X0 + i * (COLW + GAP) + COLW / 2 for i in range(len(STAGES))]
add(f'<path d="M{cx[0]} 118H{cx[-1]}" stroke="#cfc6f5" stroke-width="3"/>')
for i, (name, decs) in enumerate(STAGES):
    c = cx[i]
    add(f'<rect x="{c-70}" y="98" width="140" height="40" rx="20" fill="#2b2160"/>')
    add(f'<circle cx="{c-48}" cy="118" r="12" fill="#e5b53a"/><text x="{c-48}" y="123" font-size="13" font-weight="800" fill="#3d2a02" text-anchor="middle">{i+1}</text>')
    add(f'<text x="{c+10}" y="124" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">{name}</text>')
    add(f'<path d="M{c} 138V{TOP}" stroke="#cfc6f5" stroke-width="2" stroke-dasharray="4 4"/>')
    x = c - COLW / 2
    for k, (title, before, chose, cost) in enumerate(decs):
        y = TOP + k * (CARD_H + CARD_GAP)
        if k == 1:
            add(f'<path d="M{c} {y - CARD_GAP}V{y}" stroke="#cfc6f5" stroke-width="2" stroke-dasharray="4 4"/>')
        add(f'<rect x="{x}" y="{y}" width="{COLW}" height="{CARD_H}" rx="16" fill="#f7f5fe" stroke="#e4defa" stroke-width="1.5"/>')
        add(f'<text x="{x+16}" y="{y+30}" font-size="15.5" font-weight="800" fill="#2b2160">{esc(title)}</text>')
        # Before
        add(f'<text x="{x+16}" y="{y+56}" font-size="11.5" font-weight="700" fill="#4a4470" letter-spacing="0.06em">INSTEAD OF</text>')
        n = lines(x + 16, y + 76, before, 26, 13.5, 18, fill='#4a4470', text_decoration='line-through')
        by = y + 76 + (n - 1) * 18
        # Arrow
        add(f'<path d="M{x+26} {by+10}V{by+30}" stroke="#2b2160" stroke-width="2" marker-end="url(#ah)"/>')
        # Chose box
        rows = textwrap.wrap(chose, 20)
        bh = 24 + 19 * len(rows)
        ty = by + 38
        add(f'<rect x="{x+12}" y="{ty}" width="{COLW-24}" height="{bh}" rx="12" fill="#ffffff" stroke="#2b2160" stroke-width="2"/>')
        lines(x + 26, ty + 26, chose, 20, 14.5, 19, fill='#1e1a33', font_weight='700')
        # Cost
        ch = 30 + 16 * len(textwrap.wrap(cost, 25))
        cy = y + CARD_H - 12 - ch
        add(f'<rect x="{x+12}" y="{cy}" width="{COLW-24}" height="{ch}" rx="12" fill="#fbf1d3"/>')
        add(f'<text x="{x+24}" y="{cy+19}" font-size="11.5" font-weight="700" fill="#5e4204" letter-spacing="0.06em">COST</text>')
        lines(x + 24, cy + 37, cost, 25, 12.5, 16, fill='#3d2a02')

add(f'<text x="40" y="{H-20}" font-size="12.5" fill="#4a4470">Fictional example data. The flow diagram above shows who acts at each stage.</text>')
add('</svg>')
open('public/images/confirmation/key-decisions.svg', 'w').write('\n'.join(out))
