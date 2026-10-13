from pathlib import Path
import re, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'web/app.js'
outp=ROOT/'src/js/app.js'
s=src.read_text(encoding='utf-8')
# Conservative whitespace-only formatter. It inserts line breaks only after semicolons
# outside (), [] and strings/comments/regular expressions. It never rewrites tokens.
out=[]
state='code'; quote=''; esc=False; par=0; bracket=0; template=False; regex_class=False
prev_sig=''; word=''
line_indent=0
line_start=True

def emit(c):
    global line_start
    out.append(c)
    if c=='\n': line_start=True
    elif not c.isspace(): line_start=False

def can_start_regex(prev, last_word):
    if not prev: return True
    if prev in '([{:;,=!?&|+-*%^~<>': return True
    if prev=='>': return False
    return last_word in {'return','case','throw','else','do','typeof','instanceof','in','of','yield','await'}

last_word=''
i=0
while i<len(s):
    c=s[i]; n=s[i+1] if i+1<len(s) else ''
    if state=='line_comment':
        emit(c); i+=1
        if c=='\n': state='code'
        continue
    if state=='block_comment':
        emit(c)
        if c=='*' and n=='/': emit('/'); i+=2; state='code'; continue
        i+=1; continue
    if state=='string':
        emit(c)
        if esc: esc=False
        elif c=='\\': esc=True
        elif c==quote: state='code'; quote=''
        i+=1; continue
    if state=='template':
        emit(c)
        if esc: esc=False
        elif c=='\\': esc=True
        elif c=='`': state='code'
        i+=1; continue
    if state=='regex':
        emit(c)
        if esc: esc=False
        elif c=='\\': esc=True
        elif c=='[': regex_class=True
        elif c==']' and regex_class: regex_class=False
        elif c=='/' and not regex_class:
            state='code'
        i+=1; continue
    # code
    if c=='/' and n=='/': emit('/'); emit('/'); i+=2; state='line_comment'; continue
    if c=='/' and n=='*': emit('/'); emit('*'); i+=2; state='block_comment'; continue
    if c in ('"',"'"): quote=c; state='string'; emit(c); i+=1; continue
    if c=='`': state='template'; emit(c); i+=1; continue
    if c=='/' and can_start_regex(prev_sig,last_word): state='regex'; regex_class=False; emit(c); i+=1; continue
    if c=='(':
        par+=1
    elif c==')': par=max(0,par-1)
    elif c=='[': bracket+=1
    elif c==']': bracket=max(0,bracket-1)
    emit(c)
    if c.isalnum() or c in '_$':
        word += c
    else:
        if word: last_word=word; word=''
        if not c.isspace(): prev_sig=c
    if c==';' and par<=1 and bracket==0:
        # Preserve existing newline; otherwise add one to split packed statements.
        j=i+1
        while j<len(s) and s[j] in ' \t': j+=1
        if j<len(s) and s[j] not in '\r\n': emit('\n')
    i+=1
text=''.join(out)
# trim trailing spaces only
text='\n'.join(x.rstrip() for x in text.splitlines())+'\n'
outp.write_text(text,encoding='utf-8')
print('formatted lines',len(text.splitlines()),'max',max(map(len,text.splitlines())))
