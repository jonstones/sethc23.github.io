#!/usr/bin/env python

"""

1. Sanitize all filenames, i.e., remove spaces
2. Check if Markdown with directory name exists in directory, e.g., 'Python.md' in 'static/references/Python'
    a. if not, create such markdown ("MD_DIR.md") from template and include links to all files and directories
    b. if md exists, append links to any files/directories not already included in markdown (except EXCLUDED)
3. If Markdown files exist in directory:
    a. sort by (opts: leading numeric numbers, date modified, date created, filename)
    b. insert Markdown content into MD_DIR
4. If directory exists in MD_DIR, then apply same function as above with prefix MD_DIR, e.g., 'Python.Sockets.md' in 'static/references/Python/Sockets'

"""

import re,time
import pandas as pd
import os


def get_file_list():
    _files = []
    for root, sub_dir, files in os.walk(base_ref_dir):
        for f in files:
            _files.append(os.path.join(root,f))
    df = pd.DataFrame({'fpath':_files})  
    h_dir=1
    new_col = 'h%s'%h_dir
    df['fname'],df[new_col] = zip(*df.fpath.apply(lambda s: '|'.join([s[len(base_ref_dir):].split('/')[-1],s[len(base_ref_dir):].split('/')[0]]).split('|')))
    n = df[(df.fname!=df[new_col]) & (df[new_col].isnull()==False)].index.tolist()
    while True:
        h_dir += 1
        new_col = 'h%s'%h_dir
        df[new_col] = df[df.index.isin(n)].fpath.map(lambda s: None if len(s[len(base_ref_dir):].split('/'))<h_dir else s[len(base_ref_dir):].split('/')[h_dir-1])
        n = df[(df.fname!=df[new_col]) & (df[new_col].isnull()==False)].index.tolist()
        if not len(n):
            break
    df['f_ext'] = df.fname.map(lambda s: s[s.rfind('.')+1:])
    header_cols = sorted([it for it in df.columns.tolist() if it[0]=='h'])
    file_cols = ['fpath','fname','f_ext']
    all_cols = file_cols + header_cols
    df = df.ix[:,all_cols]
    return df
def sanitize_filenames(df):
    n = df[(df.fname.str.contains(' ')==True)].index.tolist()
    nf = df[df.index.isin(n)]
    for i,row in nf.iterrows():
        f = row.fname
        old_fpath = row.fpath
        f_dir = old_fpath[:len(f)].rstrip('/')
        new_fname = raw_input('\nHit Enter to rename:\n\t"%s" \n\nTO\n\n\t"%s"\n\n else provide new file name: ' % (f,f.replace(' ','_')))
        print ''
        if new_fname:
            new_fpath = os.path.join(f_dir,new_fname)
        else:
            new_fpath = os.path.join(f_dir,f.replace(' ','_'))
        os.system('mv "%s" "%s"' % (old_fpath,new_fpath))
        row.fpath = new_fpath
    return df
def sort_funct(df,sort_col,sort_type=['leading_numeric', 'case_insensitive']):
    """
        any number of the following options: 
            basic,
            leading_numeric,
            datetime_modified, 
            datetime_created, 
            case_sensitive,
            case_insensitive

        examples:
            
            sort_funct(['a.txt','b.txt'],'datetime_created')
            
            sort_funct(['a.txt','b.txt'],['leading_numeric','case_sensitive','case_insensitive'])
            
    """
    def date_modified(f_path):
        return time.ctime(os.path.getmtime(f_path))
    def date_created(f_path):
        return time.ctime(os.path.getctime(f_path))
    if sort_type!='basic':

        df['case_sensitive'] = df.fname.map(lambda s: s[s.rfind('/')+1:])
        df['ext'] = df.fname.map(lambda s: s[s.rfind('.')+1:])
        df['case_insensitive'] = df.fname.map(lambda s: s.lower())
        df['leading_numeric'] = df.fname.map(lambda s: None if 
                                               not hasattr(re.search('^\d+',s),'group') 
                                               else int(re.search('^\d+',s).group()))
        df['datetime_created'] = df.fpath.map(date_created)
        df['datetime_modified'] = df.fpath.map(date_modified)

        if type(sort_type)==str:
            sort_type = [sort_type]
        sort_cols = df.columns.tolist()
        for it in sort_type:
            assert sort_cols.count(it)
        df.sort(columns=sort_type,axis=0,inplace=True)
        return df
    else:
        return df.sort('fpath',axis=0,inplace=True)
def remove_directory_markdowns(df):
    cols = df.columns.tolist()
    s = cols.index('h1')
    for c in cols[s:]:
        hf = df[df.fname.map(lambda s: s[:s.rfind('.')]).isin(df[c].unique().tolist())]
        f_list = hf.fpath.tolist()
        for it in f_list:
            os.system('rm -fr %s' % it)
    df = get_file_list()
    return df
        
def create_missing_markdown_indicies(df):
    """
        Create markdowns in directory with files 
        but missing markdown with same title as directory.
    """
    df['f_ext'] = df.fname.map(lambda s: s[s.rfind('.')+1:])
    cols = df.columns.tolist()
    s = cols.index('h1')
    for c in cols[s:-1]:
        hf = df[(df[c]!=df.fname) & (df[c].isnull()==False)].sort(c)
        h_unique = hf[c].unique().tolist()
        for h in h_unique:
            h_title = h
            if not len(hf[(hf[c]==h_title) & hf.f_ext.isin(['md','markdown'])]):
                idx = hf[(hf[c]==h_title)].first_valid_index()
                f_dir = base_ref_dir + '/'.join(hf.ix[idx,cols[s:cols.index(c)+1]].tolist())
                new_fpath = '%s/%s.md' % (f_dir,h_title)
                nf = sort_funct(hf[hf[c]==h_title].copy(),sort_type)
                res = []
                for i,row in nf.iterrows():
                    res.append( '- [%s](%s)' % (row.fname.replace('_',' '),row.fpath.lstrip(base_ref_dir)) )
                res = '---\n' + '\n'.join( res )
                with open(new_fpath,'w') as f:
                    f.write(res)
    df.drop(['f_ext'],axis=1,inplace=True)
    df = get_file_list()
    return df
def create_csv(df):    
    link_created = []
    csv_content = 'idx,header_val,title,fname,fpath\n'
    csv_templ = ','.join(['%s' for it in csv_content.split(',')])
    cols = df.columns.tolist()
    s = cols.index('h1')
    h_pt = 0
    for c in cols[s:]:
        
        hf = df[(df[c]!=df.fname) & (df[c].isnull()==False)].sort(c)
        h_unique = hf[c].unique().tolist()
        for h in h_unique:
            header_val = cols.index(c)-s+1
            h_title = h
#             if not link_created.count(h_title):
#                 csv_content += str(csv_templ % (h_pt,header_val,h_title,'','')).rstrip(',') + '\n'
#                 h_pt += 1
#                 link_created.append(h_title)

            nf = sort_funct(hf[hf[c]==h_title].copy(),sort_type)
            last_row_this_header_info = None
#             sub_header_val = header_val + 1
            sub_header_val = header_val
            for j,j_row in nf.iterrows():
                
                j_path = j_row.fpath.lstrip(base_ref_dir)
                j_name = j_path[j_path.rfind('/')+1:]
                j_ext = j_name[j_name.rfind('.')+1:]
                j_title = j_row.fname[:-1*(len(j_ext)+1)].replace('_',' ')
                
                if INCLUDE_EXTENSIONS and INCLUDE_EXTENSIONS.count(j_ext):
                        
#                     if h_title==j_title[:-3]:
#                         last_row_this_header_info = [sub_header_val,j_title,j_name,j_path]
#                     else:
                    if not link_created.count(j_path):
                        csv_content += str(csv_templ % (h_pt,sub_header_val,j_title,j_name,j_path)).rstrip(',') + '\n'
                        h_pt += 1
                        link_created.append(j_path)
                        if h_title==j_title:
                            sub_header_val = header_val + 1
                        
                        
#             if last_row_this_header_info:
#                 last_row_this_header_cols = tuple([h_pt] + last_row_this_header_info)
#                 if not link_created.count(last_row_this_header_info[-1]):
#                     csv_content += str(csv_templ % last_row_this_header_cols).rstrip(',') + '\n'
#                     h_pt += 1
#                     link_created.append(last_row_this_header_info[-1])
#                 last_row_this_header_info = None
    with open(csv_fpath,'w') as f:
        f.write(csv_content)
    return csv_content

os.chdir('%s/sethc23.github.io' % os.environ['BD'])
global base_ref_dir,csv_fpath,sort_type,remake_directory_markdowns
base_ref_dir = 'reference/'
csv_fpath = '_data/references.csv'
sort_type = ['leading_numeric', 'case_insensitive']
remake_directory_markdowns = True
include_everything = False
INCLUDE_EXTENSIONS = ['md','markdown']

df = get_file_list()
df = sanitize_filenames(df)
df = remove_directory_markdowns(df)
df = create_missing_markdown_indicies(df)
csv_out = create_csv(df)
# print csv_out