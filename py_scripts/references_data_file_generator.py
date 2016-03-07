#!/usr/bin/env python
"""

1. Sanitize all filenames, i.e., remove spaces
2. Check if Markdown with directory name ("${DIR}.md") exists in directory, e.g., 'Python.md' in 'static/references/Python'
    a. if not, create such markdown from template and include links to all files and directories
    b. if md exists, append links to any files/directories not already included in markdown (except EXCLUDED)
3. If other markdown files exist in directory:
    a. sort by (opts: leading numeric numbers, date modified, date created, filename)
    b. insert Markdown content into MD_DIR above appended links
4. If sub directory exists in MD_DIR, then apply same function as above with prefix MD_DIR, e.g., 'Python.Sockets.md' in 'static/references/Python/Sockets'

Caveats:

    - directory names cannot start with '_' due to jekyll's site generation engine

"""

import re,time
import pandas as pd
import os


def get_file_list():
    excluded_dirs = [os.path.join(base_ref_dir,it) for it in EXCLUDE_DIRS]
    _files = []
    for root, sub_dir, files in os.walk(base_ref_dir):
        if not excluded_dirs.count(root):
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
def sort_funct(df,sort_col='fname',sort_type=['leading_numeric', 'case_insensitive']):
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
        
        sort_cols = ['_sort_case_sensitive',
                     '_sort_ext',
                     '_sort_case_insensitive',
                     '_sort_leading_numeric',
                     '_sort_datetime_created',
                     '_sort_datetime_modified']
        
        df['_sort_case_sensitive'] = df[sort_col].map(lambda s: s[s.rfind('/')+1:])
        df['_sort_ext'] = df[sort_col].map(lambda s: s[s.rfind('.')+1:])
        df['_sort_case_insensitive'] = df[sort_col].map(lambda s: s.lower())
        df['_sort_leading_numeric'] = df[sort_col].map(lambda s: None if 
                                               not hasattr(re.search('^\d+',s),'group') 
                                               else int(re.search('^\d+',s).group()))
        df['_sort_datetime_created'] = df.fpath.map(date_created)
        df['_sort_datetime_modified'] = df.fpath.map(date_modified)

        if type(sort_type)==str:
            sort_type = [sort_type]

        for it in sort_type:
            assert sort_cols.count('_sort_' + it)
        mod_sort_type = ['_sort_' + it for it in sort_type]
        df.sort(columns=mod_sort_type,axis=0,inplace=True)
        df.drop(sort_cols,axis=1,inplace=True)
        return df
    else:
        return df.sort(sort_col,axis=0,inplace=True)
def remove_directory_markdowns(df):
    h_cols = [it for it in df.columns.tolist() if it[0]=='h' and it[1].isdigit()]
    for c in h_cols[1:]:
        hf = df[df.fname.map(lambda s: s[:s.rfind('.')]).isin(df[c].unique().tolist())]
        f_list = hf.fpath.tolist()
        for it in f_list:
            os.system('rm -fr %s' % it)
    df = get_file_list()
    return df    
def create_markdown_from_path(new_fpath,sorted_nf):
    nf,res = sorted_nf,[]
    for i,row in nf.iterrows():
        res.append( '- [%s](%s)' % (row.fname.replace('_',' '),row.fpath.replace(base_ref_dir,'',1)) )
    res = '---\n' + '\n'.join( res )
    with open(new_fpath,'w') as f:
        f.write(res)
    return True
def create_missing_markdown_indicies(df):
    """
        Create markdowns in directory with files 
        but missing markdown with same title as directory.
    """
    h_cols = [it for it in df.columns.tolist() if it[0]=='h' and it[1].isdigit()]
    for c in h_cols[1:]:
        hf = df[(df[c]!=df.fname) & (df[c].isnull()==False)].sort(c)
        h_unique = hf[c].unique().tolist()
        for h in h_unique:
            h_title = h
            if not len(hf[(hf[c]==h_title) & (hf.fname.isin([h_title+'.md',h_title+'.markdown']))]):
                idx = hf[(hf[c]==h_title)].first_valid_index()
                f_dir = base_ref_dir + '/'.join(hf.ix[idx,h_cols[:h_cols.index(c)+1]].tolist())
                new_fpath = '%s/%s.md' % (f_dir,h_title)
                nf = sort_funct(hf[hf[c]==h_title].copy(),sort_col='fname',sort_type=sort_type)
                assert create_markdown_from_path(new_fpath,nf)
    df = get_file_list()
    return df
def create_csv(df):
    def get_markdown_content(df,c,h_title):
        new_content = []
        sub_header_cols = sorted([it for it in df.columns.tolist() if it[0]=='h' and it[1].isdigit()])
        expected_fname_h_col = sub_header_cols[sub_header_cols.index(c)+1]
        nf = sort_funct( df[(df.f_ext.isin(['md','markdown']) & (df.fname==df[expected_fname_h_col]))].copy(), sort_col='fname')
        nf['l_header_val'] = nf['l_header_val'] + 1
        if len(nf):
            for i,row in nf.iterrows():
                new_content.append([row.l_header_val,
                                   row.l_title,
                                   row.l_fname,
                                   row.l_fpath])
        return new_content
    def get_sub_header_content(df,h_title):
        new_content = []
        sub_header_cols = ['h%s'%it for it in sorted(df.l_header_val.unique().tolist())]
        for c in sub_header_cols[1:]:
            idx = sub_header_cols.index(c)
            nhf = sort_funct( df[(df[c]!=df.fname) &  
                                 (df[c].isnull()==False) &
                                 (df.l_header_val==idx+1)
                                 ].copy(),sort_col=c)
            sub_header_titles = nhf[nhf.l_title==nhf[c]]

            # If md_dir exists, create sub header title
            # else, create md_dir and create sub header title

            if len(sub_header_titles):
                for i,row in sub_header_titles.iterrows():
                    new_content.append([row.l_header_val,
                                       row.l_title,
                                       row.l_fname,
                                       row.l_fpath])
            else:
                n = nhf.first_valid_index()
                row = nhf.ix[n,:]
                md_dir = row.fpath[:row.fpath.rfind('/')]
                md_dir_fname = md_dir[md_dir.rfind('/')+1:] + '.md'
                md_dir_title = md_dir_fname[:-3].replace('_',' ').strip()
                new_fpath = os.path.join(md_dir,md_dir_fname)
                assert create_markdown_from_path(new_fpath,nhf)
                new_content.append([row.l_header_val,
                                    md_dir_title,
                                    md_dir_fname,
                                    new_fpath.replace(base_ref_dir,'',1)])
        return new_content
    
    link_created = []
    csv_content = 'idx,header_val,title,fname,fpath\n'
    csv_templ = ','.join(['%s' for it in csv_content.split(',')])

    # Create Headers for Each Directory
    # For each Directory:
    # with sub-directories
    # For each Directory with markdowns
    # For each directory with other files not referenced in
    
    # Create Info for CSV out
    df['l_fpath'] = df.fpath.map(lambda s: s.replace(base_ref_dir,'',1))
    df['l_fname'] = df.fname#.map(lambda s: s if not s.count('.') else s[:s.rfind('.')])
    df['l_title'] = df.l_fname.map(lambda s: s.replace('_',' ') if not s.count('.') else s[:s.rfind('.')].replace('_',' '))
    df['l_header_val'] = df.apply(lambda s: 1,axis=1)
    
    # Update Header Vals
    h_cols = [it for it in df.columns.tolist() if it[0]=='h' and it[1].isdigit()]
    h_pt = 1
    for c in h_cols[1:]:
        h_pt += 1
        n = df[df[c]==df.fname].index.tolist()
        ndf = df[df.index.isin(n)].copy()
        z = ndf.fname.map(lambda d: h_pt-1) 
        ndf['l_header_val'] = z
        df[df.index.isin(n)] = ndf
    
    first_header_col = 'h1'
    hf = sort_funct( df[(df[first_header_col]!=df.fname) & 
                        (df[first_header_col].isnull()==False)].copy(),
                   sort_col=first_header_col)
    h_unique = hf[first_header_col].unique().tolist()
    h_pt = 0
    for h_title in h_unique:

        # Add Main Header Row
        nf = hf[hf[first_header_col]==h_title].copy()
        try:
            d = nf[nf.fname==h_title+'.md']
            r = d.loc[d.first_valid_index()]
        except:
            print('Could not find "%s" in %s. \
            Consider using function \
            "create_missing_markdown_indicies"' % 
                  (h_title+'.md',base_ref_dir + h_title))
            raise SystemExit
        
        csv_content += str(csv_templ % (h_pt,r.l_header_val,
                                        r.l_title,r.l_fname,
                                        r.l_fpath)).rstrip(',') + '\n'
        h_pt += 1
        nf.drop(r.name,axis=0,inplace=True)
            
        for it in get_markdown_content(nf,first_header_col,h_title):
            csv_content += str(csv_templ % tuple([h_pt] + it) ).rstrip(',') + '\n'
            h_pt += 1

        for it in get_sub_header_content(nf,h_title):
            csv_content += str(csv_templ % tuple([h_pt] + it) ).rstrip(',') + '\n'
            h_pt += 1
    
    with open(csv_fpath,'w') as f:
       f.write(csv_content)
    
    return csv_content

os.chdir('%s/sethc23.github.io' % os.environ['BD'])
base_ref_dir = 'reference/'
csv_fpath = '_data/references.csv'
sort_type = ['leading_numeric', 'case_insensitive']
remake_directory_markdowns = True
include_everything = False
EXCLUDE_DIRS = ['_site']
INCLUDE_EXTENSIONS = ['md','markdown']


df = get_file_list()
# df = sanitize_filenames(df)
# df = remove_directory_markdowns(df)
# df = create_missing_markdown_indicies(df)
csv_out = create_csv(df)
# print csv_out