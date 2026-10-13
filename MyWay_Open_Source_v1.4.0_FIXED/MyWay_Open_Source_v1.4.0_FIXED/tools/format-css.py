from pathlib import Path
import tinycss2
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'web/app.css'  # immutable working source from v1.1.4
outp=ROOT/'src/styles/app.css'
text=src.read_text(encoding='utf-8')

def val(tokens):
    return tinycss2.serialize(tokens).strip()

def fmt_decls(content, level):
    ind='  '*level
    items=tinycss2.parse_declaration_list(content, skip_whitespace=True, skip_comments=False)
    lines=[]
    for it in items:
        if it.type=='comment':
            lines.append(ind+'/*'+it.value+'*/')
        elif it.type=='declaration':
            v=val(it.value)
            imp=' !important' if it.important else ''
            lines.append(f'{ind}{it.name}: {v}{imp};')
        elif it.type=='at-rule':
            pre=val(it.prelude)
            lines.append(f'{ind}@{it.lower_at_keyword} {pre};'.rstrip())
        elif it.type=='error':
            # Fall back to serializer around malformed legacy fragments.
            lines.append(ind+tinycss2.serialize([it]).strip())
    return lines

def fmt_rules(rules, level=0):
    lines=[]; ind='  '*level
    for r in rules:
        if r.type=='whitespace': continue
        if r.type=='comment':
            lines.append(ind+'/*'+r.value+'*/'); continue
        if r.type=='qualified-rule':
            sel=val(r.prelude)
            lines.append(ind+sel+' {')
            lines.extend(fmt_decls(r.content, level+1))
            lines.append(ind+'}')
            continue
        if r.type=='at-rule':
            pre=val(r.prelude)
            head='@'+r.lower_at_keyword+((' '+pre) if pre else '')
            if r.content is None:
                lines.append(ind+head+';'); continue
            # Nested rule at-rules: media/supports/keyframes/layer/container/scope/document.
            if r.lower_at_keyword in {'media','supports','keyframes','-webkit-keyframes','layer','container','scope','document'}:
                lines.append(ind+head+' {')
                nested=tinycss2.parse_rule_list(r.content, skip_whitespace=True, skip_comments=False)
                lines.extend(fmt_rules(nested, level+1))
                lines.append(ind+'}')
            else:
                lines.append(ind+head+' {')
                lines.extend(fmt_decls(r.content, level+1))
                lines.append(ind+'}')
            continue
        if r.type=='error':
            lines.append(ind+'/* parse error preserved */')
    return lines

rules=tinycss2.parse_stylesheet(text, skip_whitespace=True, skip_comments=False)
out='\n'.join(fmt_rules(rules))+'\n'
outp.write_text(out,encoding='utf-8')
print('formatted',outp,'lines',len(out.splitlines()),'rules',len(rules))
# Parse again to prove stylesheet stays parseable.
errs=[r for r in tinycss2.parse_stylesheet(out,skip_whitespace=True,skip_comments=False) if r.type=='error']
print('top-level parse errors',len(errs))
